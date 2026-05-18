/**
 * Hero liquid effect (from Modelista particles.js)
 * WebGL2 wave simulation — refracts a background image on cursor movement.
 */

const DEFAULT_BG = "#E8E6E2";

/** Canvas with subtle variation so refraction is visible on flat page colors. */
export function createBackgroundCanvas(color) {
  const resolved = color?.trim() || DEFAULT_BG;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const base = parseColor(resolved);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const wave =
        Math.sin(x * 0.04) * Math.sin(y * 0.04) * 18 +
        Math.sin((x + y) * 0.02) * 10;
      const n = wave + (Math.random() - 0.5) * 12;
      data[i] = clamp(base.r + n);
      data[i + 1] = clamp(base.g + n);
      data[i + 2] = clamp(base.b + n);
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/** @deprecated Use createBackgroundCanvas — kept for callers using data URLs */
export function createBackgroundDataUrl(color) {
  return createBackgroundCanvas(color).toDataURL("image/png");
}

function parseColor(color) {
  const hex = color.trim().replace("#", "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function clamp(value) {
  return Math.min(255, Math.max(0, value));
}

let canvas;
let gl;
let vao;
let heroTex;
let imgDim = [0, 0];
let fb = [null, null];
let cur = 0;
let prog = {};
let animId = null;
const mouse = { x: -1, y: -1, px: -1, py: -1 };
let cover = [1, 1, 0, 0];
let frame = 0;
let clearColor = [0.91, 0.9, 0.89];
const SIM = 256;
const REFRACTION = 0.1;

const VS = `#version 300 es
layout(location = 0) in vec2 a;
out vec2 v;
void main(){
  v = a * 0.5 + 0.5;
  gl_Position = vec4(a, 0.0, 1.0);
}`;

const WAVE = `#version 300 es
precision highp float;
in vec2 v;
uniform sampler2D s;
uniform float damp;
uniform vec4 drop;
out vec4 o;
void main(){
  vec2 t = 1.0 / vec2(textureSize(s, 0));
  vec2 h = texture(s, v).rg;
  float c = h.r;
  float p = h.g;
  float n = 2.0 * c - p + 0.25 * (
    texture(s, v + vec2(t.x, 0.0)).r +
    texture(s, v - vec2(t.x, 0.0)).r +
    texture(s, v + vec2(0.0, t.y)).r +
    texture(s, v - vec2(0.0, t.y)).r - 4.0 * c
  );
  n *= damp;
  if (drop.z > 0.0) {
    float d = length(v - drop.xy);
    n += drop.z * exp(-d * d / drop.w);
  }
  o = vec4(n, c, 0.0, 1.0);
}`;

const SHOW = `#version 300 es
precision highp float;
in vec2 v;
uniform sampler2D hero;
uniform sampler2D rip;
uniform float ref;
uniform vec4 cvr;
out vec4 o;
void main(){
  vec2 t = 1.0 / vec2(textureSize(rip, 0));
  float l = texture(rip, v - vec2(t.x, 0.0)).r;
  float r = texture(rip, v + vec2(t.x, 0.0)).r;
  float u = texture(rip, v + vec2(0.0, t.y)).r;
  float d = texture(rip, v - vec2(0.0, t.y)).r;
  vec2 g = vec2(r - l, u - d);
  vec2 uv = v * cvr.xy + cvr.zw + g * ref;
  uv.y = 1.0 - uv.y;
  o = texture(hero, clamp(uv, vec2(0.0), vec2(1.0)));
}`;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("HeroLiquid shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(vs, fs) {
  const vert = compileShader(gl.VERTEX_SHADER, vs);
  const frag = compileShader(gl.FRAGMENT_SHADER, fs);
  if (!vert || !frag) return null;

  const p = gl.createProgram();
  gl.attachShader(p, vert);
  gl.attachShader(p, frag);
  gl.bindAttribLocation(p, 0, "a");
  gl.linkProgram(p);
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("HeroLiquid program error:", gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }

  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    u[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

function initQuad() {
  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

function makeFBO() {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, SIM, SIM, 0, gl.RG, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const f = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    t,
    0
  );

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.warn("HeroLiquid: wave buffer incomplete", status);
    gl.deleteFramebuffer(f);
    gl.deleteTexture(t);
    return null;
  }

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return { t, f };
}

function texFromImg(img) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

function setHeroSource(source) {
  if (!gl || !source) return;
  imgDim = [source.width, source.height];
  if (heroTex) gl.deleteTexture(heroTex);
  heroTex = texFromImg(source);
  computeCover();
}

function blit(target) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target);
  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function fitCanvas() {
  const w = Math.max(1, window.innerWidth);
  const h = Math.max(1, window.innerHeight);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    if (imgDim[0]) computeCover();
  }
}

function computeCover() {
  const ca = canvas.width / canvas.height;
  const ia = imgDim[0] / imgDim[1];
  if (ca > ia) {
    cover = [1, ia / ca, 0, (1 - ia / ca) / 2];
  } else {
    cover = [ca / ia, 1, (1 - ca / ia) / 2, 0];
  }
}

function setPointerFromClient(clientX, clientY) {
  mouse.px = mouse.x;
  mouse.py = mouse.y;
  mouse.x = clientX / window.innerWidth;
  mouse.y = 1 - clientY / window.innerHeight;
}

function onMove(e) {
  setPointerFromClient(e.clientX, e.clientY);
}

function onTouch(e) {
  if (!e.touches[0]) return;
  setPointerFromClient(e.touches[0].clientX, e.touches[0].clientY);
}

function onPointerLeave() {
  mouse.x = -1;
  mouse.y = -1;
}

function onResize() {
  fitCanvas();
}

function loop() {
  if (!gl) return;
  frame++;

  let dx = -1;
  let dy = 0;
  let ds = 0;
  let dw = 0.0005;

  if (mouse.x >= 0 && mouse.x <= 1) {
    const vel =
      mouse.px >= 0
        ? Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py)
        : 0;
    dx = mouse.x;
    dy = mouse.y;
    ds = Math.min(0.35, 0.04 + vel * 8);
    mouse.px = mouse.x;
    mouse.py = mouse.y;
  } else if (frame % 60 === 0) {
    dx = 0.15 + Math.random() * 0.7;
    dy = 0.15 + Math.random() * 0.7;
    ds = 0.08;
    dw = 0.002;
  }

  const nxt = 1 - cur;
  const w = prog.wave;
  gl.useProgram(w.p);
  gl.viewport(0, 0, SIM, SIM);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fb[cur].t);
  gl.uniform1i(w.u.s, 0);
  gl.uniform1f(w.u.damp, 0.985);
  gl.uniform4f(w.u.drop, dx, dy, ds, dw);
  blit(fb[nxt].f);
  cur = nxt;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (heroTex) {
    const d = prog.show;
    gl.useProgram(d.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, heroTex);
    gl.uniform1i(d.u.hero, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, fb[cur].t);
    gl.uniform1i(d.u.rip, 1);
    gl.uniform1f(d.u.ref, REFRACTION);
    gl.uniform4f(d.u.cvr, cover[0], cover[1], cover[2], cover[3]);
    blit(null);
  }

  animId = requestAnimationFrame(loop);
}

function setClearColorFromHex(hex) {
  const c = parseColor(hex);
  clearColor = [c.r / 255, c.g / 255, c.b / 255];
}

function loadImageUrl(imageUrl) {
  const img = new Image();
  img.onload = () => setHeroSource(img);
  img.onerror = () => console.warn("HeroLiquid: failed to load image", imageUrl);
  img.src = imageUrl;
}

export function init(container, imageSource) {
  if (animId) destroy();

  const pageColor =
    getComputedStyle(document.body).getPropertyValue("--c-bg").trim() ||
    DEFAULT_BG;
  setClearColorFromHex(pageColor);

  canvas = document.createElement("canvas");
  canvas.className = "hero-liquid-canvas";
  container.appendChild(canvas);

  gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl) {
    console.warn("HeroLiquid: WebGL2 not available");
    destroy();
    return false;
  }

  if (!gl.getExtension("EXT_color_buffer_float")) {
    console.warn("HeroLiquid: EXT_color_buffer_float not supported");
    destroy();
    return false;
  }

  gl.getExtension("OES_texture_float_linear");

  fitCanvas();
  prog.wave = link(VS, WAVE);
  prog.show = link(VS, SHOW);
  if (!prog.wave || !prog.show) {
    destroy();
    return false;
  }

  initQuad();
  fb[0] = makeFBO();
  fb[1] = makeFBO();
  if (!fb[0] || !fb[1]) {
    destroy();
    return false;
  }

  if (imageSource instanceof HTMLCanvasElement) {
    setHeroSource(imageSource);
  } else if (typeof imageSource === "string") {
    loadImageUrl(imageSource);
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
  window.addEventListener("touchmove", onTouch, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("resize", onResize);

  loop();
  return true;
}

export function setBackgroundColor(color) {
  const resolved = color?.trim() || DEFAULT_BG;
  setClearColorFromHex(resolved);
  if (!gl) return;
  setHeroSource(createBackgroundCanvas(resolved));
}

/** Load a hero image URL and sync letterbox clear color to a CSS color. */
export function setBackgroundImage(imageUrl, clearColorHex) {
  if (!gl) return;
  const resolved = clearColorHex?.trim() || DEFAULT_BG;
  setClearColorFromHex(resolved);
  loadImageUrl(imageUrl);
}

export function switchToImage(imageUrl) {
  if (!gl) return;
  if (imageUrl instanceof HTMLCanvasElement) {
    setHeroSource(imageUrl);
    return;
  }
  loadImageUrl(imageUrl);
}

export function destroy() {
  if (animId) cancelAnimationFrame(animId);
  animId = null;

  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerdown", onMove);
  window.removeEventListener("touchmove", onTouch);
  window.removeEventListener("pointerleave", onPointerLeave);
  window.removeEventListener("resize", onResize);

  if (canvas) canvas.remove();

  if (gl) {
    fb.forEach((f) => {
      if (f) {
        gl.deleteFramebuffer(f.f);
        gl.deleteTexture(f.t);
      }
    });
    if (heroTex) gl.deleteTexture(heroTex);
  }

  canvas = null;
  gl = null;
  heroTex = null;
  fb = [null, null];
  cur = 0;
  frame = 0;
  mouse.x = -1;
}
