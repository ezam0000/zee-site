/**
 * JellySwitch - A WebGPU-based soft-body toggle switch with spring physics
 * Inspired by TypeGPU's Jelly Switch example
 * 
 * Features:
 * - SDF ray marching for soft-body rendering
 * - Spring physics for squash/wiggle animations
 * - Subsurface scattering effect
 * - Optional audio feedback
 */

// Spring physics class
class Spring {
    constructor(target = 0, stiffness = 120, damping = 12) {
        this.target = target;
        this.current = target;
        this.velocity = 0;
        this.stiffness = stiffness;
        this.damping = damping;
    }

    update(dt) {
        const force = -this.stiffness * (this.current - this.target);
        const damping = -this.damping * this.velocity;
        this.velocity += (force + damping) * dt;
        this.current += this.velocity * dt;
        return this.current;
    }

    set(value) {
        this.target = value;
    }

    snap(value) {
        this.target = value;
        this.current = value;
        this.velocity = 0;
    }
}

// WebGPU Jelly Switch Component
export class JellySwitch {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = {
            enableAudio: options.enableAudio ?? false,
            onToggle: options.onToggle ?? null,
            initialState: options.initialState ?? false,
            accentColor: options.accentColor ?? [0.08, 0.5, 1.0], // Blue jelly (like original TypeGPU)
            ...options
        };

        this.toggled = this.options.initialState;
        this.pressed = false;
        this.hovered = false;

        // Spring physics for animations
        this.springs = {
            toggle: new Spring(this.toggled ? 1 : 0, 80, 10),
            squashX: new Spring(1, 150, 15),
            squashZ: new Spring(1, 150, 15),
            wiggleX: new Spring(0, 100, 8),
            hover: new Spring(0, 120, 12)
        };

        // Audio context (lazy initialized)
        this.audioContext = null;

        // WebGPU resources
        this.device = null;
        this.context = null;
        this.pipeline = null;
        this.uniformBuffer = null;
        this.bindGroup = null;

        // Animation
        this.animationFrame = null;
        this.lastTime = 0;

        this.init();
    }

    async init() {
        if (!navigator.gpu) {
            console.warn('WebGPU not supported, falling back to CSS switch');
            this.createFallbackSwitch();
            return;
        }

        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.warn('No WebGPU adapter found, falling back to CSS switch');
                this.createFallbackSwitch();
                return;
            }

            this.device = await adapter.requestDevice();
            this.context = this.canvas.getContext('webgpu');

            const format = navigator.gpu.getPreferredCanvasFormat();
            this.context.configure({
                device: this.device,
                format: format,
                alphaMode: 'premultiplied'
            });

            await this.createPipeline(format);
            this.setupEventListeners();
            this.startAnimation();
        } catch (e) {
            console.error('WebGPU initialization failed:', e);
            this.createFallbackSwitch();
        }
    }

    async createPipeline(format) {
        const shaderCode = /* wgsl */`
            struct Uniforms {
                resolution: vec2f,
                time: f32,
                toggleProgress: f32,
                squashX: f32,
                squashZ: f32,
                wiggleX: f32,
                hover: f32,
                pressed: f32,
                accentColor: vec3f,
                _pad: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: Uniforms;

            struct VertexOutput {
                @builtin(position) position: vec4f,
                @location(0) uv: vec2f,
            }

            @vertex
            fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
                var pos = array<vec2f, 6>(
                    vec2f(-1.0, -1.0),
                    vec2f(1.0, -1.0),
                    vec2f(-1.0, 1.0),
                    vec2f(-1.0, 1.0),
                    vec2f(1.0, -1.0),
                    vec2f(1.0, 1.0)
                );
                var output: VertexOutput;
                output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
                output.uv = pos[vertexIndex] * 0.5 + 0.5;
                return output;
            }

            // SDF primitives
            fn sdCapsule(p: vec3f, a: vec3f, b: vec3f, r: f32) -> f32 {
                let pa = p - a;
                let ba = b - a;
                let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                return length(pa - ba * h) - r;
            }

            fn sdCylinder(p: vec3f, a: vec3f, b: vec3f, r: f32) -> f32 {
                let ba = b - a;
                let pa = p - a;
                let baba = dot(ba, ba);
                let paba = dot(pa, ba);
                let x = length(pa * baba - ba * paba) - r * baba;
                let y = abs(paba - baba * 0.5) - baba * 0.5;
                let x2 = x * x;
                let y2 = y * y * baba;
                let d = select(
                    select(0.0, x2, x > 0.0) + select(0.0, y2, y > 0.0),
                    -min(x2, y2),
                    max(x, y) < 0.0
                );
                return sign(d) * sqrt(abs(d)) / baba;
            }

            fn sdRoundBox(p: vec3f, b: vec3f, r: f32) -> f32 {
                let q = abs(p) - b;
                return length(max(q, vec3f(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
            }

            fn opSmoothUnion(d1: f32, d2: f32, k: f32) -> f32 {
                let h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
                return mix(d2, d1, h) - k * h * (1.0 - h);
            }

            // Scene SDF - Rounded box knob on cylindrical rail (like original TypeGPU)
            fn sceneSDF(p: vec3f) -> f32 {
                let toggle = uniforms.toggleProgress;
                let squashX = uniforms.squashX;
                let squashZ = uniforms.squashZ;
                let wiggle = uniforms.wiggleX;
                let hover = uniforms.hover;
                
                // Rail (thin cylinder) - horizontal
                let railLength = 0.5;
                let railRadius = 0.06;
                let railA = vec3f(-railLength, -0.08, 0.0);
                let railB = vec3f(railLength, -0.08, 0.0);
                let rail = sdCapsule(p, railA, railB, railRadius);
                
                // Knob position (moves based on toggle)
                let knobX = mix(-0.28, 0.28, toggle);
                let knobCenter = vec3f(knobX + wiggle * 0.12, 0.08, 0.0);
                
                // Apply squash to knob - rounded box shape
                let knobP = p - knobCenter;
                let squashedP = vec3f(knobP.x / squashX, knobP.y, knobP.z / squashZ);
                
                // Rounded box dimensions (like original TypeGPU jelly)
                let boxSize = vec3f(0.22, 0.18, 0.22) * (1.0 + hover * 0.05);
                let cornerRadius = 0.08;
                let knob = sdRoundBox(squashedP, boxSize, cornerRadius) * min(squashX, squashZ);
                
                // Combine with smooth union for soft jelly connection
                return opSmoothUnion(rail, knob, 0.06);
            }

            // Calculate normal using gradient
            fn calcNormal(p: vec3f) -> vec3f {
                let e = vec2f(0.001, 0.0);
                return normalize(vec3f(
                    sceneSDF(p + e.xyy) - sceneSDF(p - e.xyy),
                    sceneSDF(p + e.yxy) - sceneSDF(p - e.yxy),
                    sceneSDF(p + e.yyx) - sceneSDF(p - e.yyx)
                ));
            }

            // Subsurface scattering approximation
            fn subsurfaceScattering(p: vec3f, n: vec3f, lightDir: vec3f, thickness: f32) -> f32 {
                let scatterDir = normalize(lightDir + n * 0.3);
                let scatter = pow(max(0.0, dot(-scatterDir, n)), 2.0);
                return scatter * thickness;
            }

            @fragment
            fn fs_main(input: VertexOutput) -> @location(0) vec4f {
                let aspect = uniforms.resolution.x / uniforms.resolution.y;
                var uv = input.uv * 2.0 - 1.0;
                uv.x *= aspect;
                
                // Camera setup
                let camPos = vec3f(0.0, 0.0, 2.5);
                let camTarget = vec3f(0.0, 0.0, 0.0);
                let camUp = vec3f(0.0, 1.0, 0.0);
                
                let forward = normalize(camTarget - camPos);
                let right = normalize(cross(forward, camUp));
                let up = cross(right, forward);
                
                let rayDir = normalize(forward + uv.x * right * 0.5 + uv.y * up * 0.5);
                
                // Ray march
                var t = 0.0;
                var hit = false;
                var hitPos = vec3f(0.0);
                
                for (var i = 0; i < 64; i++) {
                    hitPos = camPos + rayDir * t;
                    let d = sceneSDF(hitPos);
                    if (d < 0.001) {
                        hit = true;
                        break;
                    }
                    if (t > 10.0) { break; }
                    t += d;
                }
                
                if (!hit) {
                    return vec4f(0.0, 0.0, 0.0, 0.0);
                }
                
                let normal = calcNormal(hitPos);
                
                // Lighting
                let lightDir1 = normalize(vec3f(1.0, 1.0, 1.0));
                let lightDir2 = normalize(vec3f(-1.0, 0.5, 0.5));
                
                // Determine if we're on the knob or rail based on Y position
                let toggle = uniforms.toggleProgress;
                let knobX = mix(-0.28, 0.28, toggle);
                let isKnob = hitPos.y > -0.02;  // Knob is above the rail
                
                // Colors - translucent jelly blue/teal for knob (like original)
                let railColor = vec3f(0.65, 0.63, 0.60);      // Dark gray rail
                let knobColorOff = vec3f(0.4, 0.6, 0.75);     // Soft blue-gray jelly
                let knobColorOn = uniforms.accentColor;       // Accent color when on
                
                let jellyColor = mix(knobColorOff, knobColorOn, toggle);
                var baseColor = select(railColor, jellyColor, isKnob);
                
                // Diffuse lighting
                let diff1 = max(0.0, dot(normal, lightDir1));
                let diff2 = max(0.0, dot(normal, lightDir2)) * 0.3;
                let diffuse = diff1 + diff2;
                
                // Fresnel (edge glow)
                let fresnel = pow(1.0 - max(0.0, dot(normal, -rayDir)), 3.0);
                
                // Subsurface scattering - stronger for jelly knob
                let sss = subsurfaceScattering(hitPos, normal, lightDir1, 0.7);
                let sssColor = select(railColor, jellyColor * 1.3, isKnob);
                
                // Specular
                let halfVec = normalize(lightDir1 - rayDir);
                let spec = pow(max(0.0, dot(normal, halfVec)), 64.0);
                
                // Ambient occlusion approximation
                let ao = 0.5 + 0.5 * normal.y;
                
                // Combine lighting
                var color = baseColor * (0.3 + diffuse * 0.7) * ao;
                color += sssColor * sss * 0.4;
                color += vec3f(1.0) * spec * 0.5;
                color += vec3f(0.9, 0.95, 1.0) * fresnel * 0.2;
                
                // Hover glow
                let hoverGlow = uniforms.hover * 0.1;
                color += uniforms.accentColor * hoverGlow * (1.0 - fresnel);
                
                // Pressed effect (slight darkening)
                color *= 1.0 - uniforms.pressed * 0.1;
                
                // Soft shadow on track from knob
                if (!isKnob) {
                    let shadowDist = length(hitPos.x - knobX);
                    let shadow = smoothstep(0.0, 0.5, shadowDist);
                    color *= 0.85 + 0.15 * shadow;
                }
                
                // Tone mapping and gamma
                color = color / (color + vec3f(1.0));
                color = pow(color, vec3f(1.0 / 2.2));
                
                // Alpha based on distance from center for soft edges
                let centerDist = length(hitPos.xy);
                let alpha = smoothstep(1.2, 0.8, centerDist);
                
                return vec4f(color, alpha);
            }
        `;

        const shaderModule = this.device.createShaderModule({
            code: shaderCode
        });

        // Create uniform buffer
        this.uniformBuffer = this.device.createBuffer({
            size: 64, // Enough for our uniforms (aligned to 16 bytes)
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: 'uniform' }
            }]
        });

        this.bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [{
                binding: 0,
                resource: { buffer: this.uniformBuffer }
            }]
        });

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        this.pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main'
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [{
                    format: format,
                    blend: {
                        color: {
                            srcFactor: 'src-alpha',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add'
                        },
                        alpha: {
                            srcFactor: 'one',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add'
                        }
                    }
                }]
            },
            primitive: {
                topology: 'triangle-list'
            }
        });
    }

    setupEventListeners() {
        this.canvas.style.cursor = 'pointer';

        this.canvas.addEventListener('mouseenter', () => {
            this.hovered = true;
            this.springs.hover.set(1);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.hovered = false;
            this.pressed = false;
            this.springs.hover.set(0);
        });

        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.pressed = true;
            this.springs.squashX.set(1.15);
            this.springs.squashZ.set(0.85);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (this.pressed) {
                this.toggle();
            }
            this.pressed = false;
            this.springs.squashX.set(1);
            this.springs.squashZ.set(1);
        });

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.pressed = true;
            this.hovered = true;
            this.springs.hover.set(1);
            this.springs.squashX.set(1.15);
            this.springs.squashZ.set(0.85);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.pressed) {
                this.toggle();
            }
            this.pressed = false;
            this.hovered = false;
            this.springs.hover.set(0);
            this.springs.squashX.set(1);
            this.springs.squashZ.set(1);
        });
    }

    toggle() {
        this.toggled = !this.toggled;
        this.springs.toggle.set(this.toggled ? 1 : 0);
        
        // Add wiggle effect
        this.springs.wiggleX.current = this.toggled ? -0.5 : 0.5;
        this.springs.wiggleX.velocity = this.toggled ? -3 : 3;

        // Play sound if enabled
        if (this.options.enableAudio) {
            this.playToggleSound();
        }

        // Callback
        if (this.options.onToggle) {
            this.options.onToggle(this.toggled);
        }
    }

    playToggleSound() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(this.toggled ? 880 : 440, this.audioContext.currentTime);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialDecayTo && gain.gain.exponentialDecayTo(0.01, this.audioContext.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
        
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.1);
    }

    startAnimation() {
        const render = (time) => {
            const dt = Math.min((time - this.lastTime) / 1000, 0.05); // Cap delta time
            this.lastTime = time;

            // Update springs
            this.springs.toggle.update(dt);
            this.springs.squashX.update(dt);
            this.springs.squashZ.update(dt);
            this.springs.wiggleX.update(dt);
            this.springs.hover.update(dt);

            this.render(time / 1000);
            this.animationFrame = requestAnimationFrame(render);
        };
        
        this.animationFrame = requestAnimationFrame(render);
    }

    render(time) {
        if (!this.device || !this.pipeline) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        // Update uniforms
        const uniformData = new Float32Array([
            width, height,           // resolution
            time,                    // time
            this.springs.toggle.current,    // toggleProgress
            this.springs.squashX.current,   // squashX
            this.springs.squashZ.current,   // squashZ
            this.springs.wiggleX.current,   // wiggleX
            this.springs.hover.current,     // hover
            this.pressed ? 1 : 0,           // pressed
            this.options.accentColor[0],    // accentColor.r
            this.options.accentColor[1],    // accentColor.g
            this.options.accentColor[2],    // accentColor.b
            0                               // padding
        ]);

        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();

        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: 'clear',
                storeOp: 'store'
            }]
        });

        renderPass.setPipeline(this.pipeline);
        renderPass.setBindGroup(0, this.bindGroup);
        renderPass.draw(6);
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    // Fallback for browsers without WebGPU
    createFallbackSwitch() {
        this.canvas.style.display = 'none';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'jelly-switch-fallback';
        wrapper.innerHTML = `
            <label class="jelly-switch-label">
                <input type="checkbox" ${this.toggled ? 'checked' : ''}>
                <span class="jelly-switch-track">
                    <span class="jelly-switch-knob"></span>
                </span>
            </label>
        `;

        const checkbox = wrapper.querySelector('input');
        checkbox.addEventListener('change', () => {
            this.toggled = checkbox.checked;
            if (this.options.onToggle) {
                this.options.onToggle(this.toggled);
            }
        });

        this.canvas.parentNode.insertBefore(wrapper, this.canvas);
    }

    setToggled(value) {
        this.toggled = value;
        this.springs.toggle.snap(value ? 1 : 0);
    }

    getToggled() {
        return this.toggled;
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.device) {
            this.uniformBuffer?.destroy();
        }
    }
}

