import { createElement } from "../utils/dom.js";

export function renderBeforeAfter(beforeSrc, afterSrc) {
  const slider = createElement("div", "before-after");
  slider.innerHTML = `
    <div class="before-after__container">
      <div class="before-after__before">
        <img src="${beforeSrc}" alt="Before" />
      </div>
      <div class="before-after__after">
        <img src="${afterSrc}" alt="After" />
      </div>
      <input type="range" class="before-after__slider" min="0" max="100" value="50" />
    </div>
  `;

  const sliderInput = slider.querySelector(".before-after__slider");
  const afterDiv = slider.querySelector(".before-after__after");

  sliderInput.addEventListener("input", (e) => {
    const value = e.target.value;
    afterDiv.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  });

  return slider;
}

