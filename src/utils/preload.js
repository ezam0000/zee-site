export async function preloadImages(urls) {
  const promises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  });

  return Promise.allSettled(promises);
}

export function preloadCriticalAssets() {
  const criticalImages = [
    "/public/images/hero/hero-main.jpg",
  ];

  return preloadImages(criticalImages);
}

