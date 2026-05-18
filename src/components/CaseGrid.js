import { createElement } from "../utils/dom.js";
import { renderImpactMetrics } from "./ImpactMetrics.js";

export function renderCaseGrid(cases) {
  const grid = createElement("div", "case-grid");

  cases.forEach((caseStudy) => {
    const card = createElement("a", "case-card");
    card.href = `/work/${caseStudy.slug}`;

    const thumbnail = createElement("div", "case-card__thumbnail");
    const img = createElement("img");
    img.src = caseStudy.thumbnail;
    img.alt = caseStudy.title;
    img.loading = "lazy";
    thumbnail.appendChild(img);

    const content = createElement("div", "case-card__content");
    content.innerHTML = `
      <h3 class="case-card__title">${caseStudy.title}</h3>
      <p class="case-card__client">${caseStudy.client}</p>
    `;

    const metrics = renderImpactMetrics(caseStudy.metrics.slice(0, 1), "grid");
    metrics.className = "case-card__metrics";

    card.appendChild(thumbnail);
    card.appendChild(content);
    card.appendChild(metrics);

    grid.appendChild(card);
  });

  return grid;
}

