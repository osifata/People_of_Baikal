document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const assets = document.querySelector('a-assets');
  const models = document.querySelectorAll('[gltf-model]');
  let modelsLoaded = 0;

  if (assets && loadingScreen && progressBar && progressText) {
    assets.addEventListener('progress', (e) => {
      if (e.detail.total > 0) {
        const percent = Math.floor((e.detail.loaded / e.detail.total) * 100);
        progressBar.style.width = percent + '%';
        progressText.innerText = `Загрузка... ${percent}%`;
      }
    });

    models.forEach(model => {
      model.addEventListener('model-loaded', () => {
        modelsLoaded++;

        // Автоматически берем трансформации из data-атрибутов
        const pos = model.getAttribute('data-position');
        const rot = model.getAttribute('data-rotation');
        const scale = model.getAttribute('data-scale');

        if (pos) model.setAttribute('position', pos);
        if (rot) model.setAttribute('rotation', rot);
        if (scale) model.setAttribute('scale', scale);

        model.setAttribute('visible', 'true');

        const percent = Math.floor((modelsLoaded / models.length) * 100);
        progressBar.style.width = percent + '%';
        progressText.innerText = `Загрузка моделей... ${percent}%`;

        if (modelsLoaded === models.length) {
          progressBar.style.width = '100%';
          progressText.innerText = 'Загрузка завершена';

          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }
      });
    });
  }
});
