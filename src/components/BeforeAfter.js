import { createElement } from "../utils/dom.js";

export function renderBeforeAfter(beforeSrc, afterSrc) {
  const slider = createElement("div", "before-after");
  const container = createElement("div", "before-after__container");

  const before = createElement("div", "before-after__before");
  const beforeImg = createElement("img");
  beforeImg.src = beforeSrc;
  beforeImg.alt = "Before";
  before.appendChild(beforeImg);

  const after = createElement("div", "before-after__after");
  const afterImg = createElement("img");
  afterImg.src = afterSrc;
  afterImg.alt = "After";
  after.appendChild(afterImg);

  const sliderInput = document.createElement("input");
  sliderInput.type = "range";
  sliderInput.className = "before-after__slider";
  sliderInput.min = "0";
  sliderInput.max = "100";
  sliderInput.value = "50";

  sliderInput.addEventListener("input", (e) => {
    after.style.clipPath = `inset(0 ${100 - e.target.value}% 0 0)`;
  });

  container.append(before, after, sliderInput);
  slider.appendChild(container);
  return slider;
}
