import { createElement } from "../utils/dom.js";

export function renderCaseHero(caseData) {
  const hero = createElement("section", "case-hero");

  const picture = createElement("picture", "case-hero__image");
  const source = document.createElement("source");
  source.media = "(max-width: 768px)";
  source.srcset = caseData.hero.mobile;
  const img = createElement("img");
  img.src = caseData.hero.desktop;
  img.alt = caseData.hero.alt;
  picture.append(source, img);

  const content = createElement("div", "case-hero__content");
  const container = createElement("div", "container");
  container.append(
    createElement("h1", "case-hero__title", caseData.title),
    createElement("p", "case-hero__client", caseData.client),
  );
  content.appendChild(container);

  hero.append(picture, content);
  return hero;
}
