import { refs } from './refs';

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function renderImagesMarkup(data) {
  const makrup = createImagesMarkup(data);
  refs.imagesContainer.insertAdjacentHTML('beforeend', makrup);
}

function createImagesMarkup(data) {
  return data
    .map(
      ({
        largeImageURL,
        tags,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`;
      }
    )
    .join('');
}

export { clearImagesContainer, renderImagesMarkup };
