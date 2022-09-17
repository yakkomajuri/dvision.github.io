async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function loadImageGridDynamically(parentElement, prefix, numberOfImages, imageFileNames = []) {
  const cols = [];
  for (let i = 0; i < 3; ++i) {
    const col = document.createElement("div");
    col.className = "col";
    cols.push(col);
    parentElement.appendChild(col);
  }

  for (let i = 1; i <= numberOfImages; ++i) {
    const imageFileName = imageFileNames[i - 1] ?? i
    const img = createImageElement(`${prefix}/${imageFileName}.jpg`);
    cols[(i - 1) % 3].appendChild(img);
    await sleep(50);
  }
}

function createImageElement(src) {
  const img = document.createElement("img");
  img.loading = 'lazy';
  img.src = src;
  return img
}