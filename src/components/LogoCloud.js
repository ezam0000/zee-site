import { createElement } from "../utils/dom.js";

export function renderLogoCloud(clients, title = "Clients") {
  const section = createElement("section", "logo-cloud");
  const container = createElement("div", "container");
  const heading = createElement("h2", "logo-cloud__title", title);
  const grid = createElement("div", "logo-cloud__grid");

  clients.forEach((client) => {
    const item = createElement("div", "logo-cloud__item");
    const img = createElement("img");
    img.src = client.logo;
    img.alt = client.name;
    img.loading = "lazy";
    item.appendChild(img);
    grid.appendChild(item);
  });

  container.appendChild(heading);
  container.appendChild(grid);
  section.appendChild(container);
  return section;
}
