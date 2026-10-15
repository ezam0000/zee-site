export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function createElement(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content) el.textContent = content;
  return el;
}

const META_SEPARATOR = ' · ';

export function fillSeparatedMeta(element, meta) {
  const phrases = String(meta).split(META_SEPARATOR).filter(Boolean);
  element.replaceChildren();
  phrases.forEach((phrase) => {
    const item = document.createElement('span');
    item.textContent = phrase;
    element.append(item);
  });
}

export function addClass(el, className) {
  if (el) el.classList.add(className);
}

export function removeClass(el, className) {
  if (el) el.classList.remove(className);
}

export function toggleClass(el, className) {
  if (el) el.classList.toggle(className);
}

export function hasClass(el, className) {
  return el?.classList.contains(className);
}

