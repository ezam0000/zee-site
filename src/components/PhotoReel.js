import { createElement } from "../utils/dom.js";

export function renderPhotoReel(photos) {
  const reel = createElement("div", "photo-reel");

  photos.forEach((photo) => {
    const item = createElement("div", "photo-reel__item");
    const img = createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || "Photography";
    img.loading = "lazy";
    item.appendChild(img);
    reel.appendChild(item);
  });

  return reel;
}

