import { createElement } from "../utils/dom.js";

export function renderLogoCloud(clients, title = "Clients") {
  const section = createElement("section", "logo-cloud");
  section.innerHTML = `
    <div class="container">
      <h2 class="logo-cloud__title">${title}</h2>
      <div class="logo-cloud__grid">
        ${clients
          .map(
            (client) => `
          <div class="logo-cloud__item">
            <img src="${client.logo}" alt="${client.name}" loading="lazy" />
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
  return section;
}

