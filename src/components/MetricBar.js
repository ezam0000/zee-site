import { createElement } from "../utils/dom.js";

export function renderMetricBar(metrics) {
  const bar = createElement("div", "metric-bar");
  bar.setAttribute("data-sticky", "true");

  const container = createElement("div", "metric-bar__container");
  metrics.forEach((metric) => {
    const item = createElement("div", "metric-bar__item");
    item.innerHTML = `
      <span class="metric-bar__value">${metric.value}${metric.unit}</span>
      <span class="metric-bar__label">${metric.label}</span>
    `;
    container.appendChild(item);
  });

  bar.appendChild(container);
  return bar;
}

export function initStickyMetricBar() {
  const bar = document.querySelector('[data-sticky="true"]');
  if (!bar) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          bar.classList.remove("is-sticky");
        } else {
          bar.classList.add("is-sticky");
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(bar);
}

