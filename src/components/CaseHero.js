import { createElement } from "../utils/dom.js";

export function renderCaseHero(caseData) {
  const hero = createElement("section", "case-hero");

  const picture = createElement("picture", "case-hero__image");
  picture.innerHTML = `
    <source media="(max-width: 768px)" srcset="${caseData.hero.mobile}" />
    <img src="${caseData.hero.desktop}" alt="${caseData.hero.alt}" />
  `;

  const content = createElement("div", "case-hero__content");
  content.innerHTML = `
    <div class="container">
      <h1 class="case-hero__title">${caseData.title}</h1>
      <p class="case-hero__client">${caseData.client}</p>
    </div>
  `;

  hero.appendChild(picture);
  hero.appendChild(content);

  return hero;
}

