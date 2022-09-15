import ImagesApiService from './js/fetch-imagesAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  serchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();

refs.serchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', fetchImages);

function onFormSubmit(e) {
  e.preventDefault();

  imagesApiService.searchQuery = e.currentTarget.searchQuery.value.trim();

  if (imagesApiService.searchQuery === '') {
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  imagesApiService.resetPage();
  clearImagesContainer();
  fetchImages();
  refs.loadMoreBtn.classList.add('visible');
}

async function fetchImages() {
  try {
    const res = await imagesApiService.fetchImages();
    // console.log(res);

    if (res.hits.length === 0) {
      return console.log('error');
    }

    if (imagesApiService.imgCounter >= res.totalHits) {
      refs.loadMoreBtn.classList.remove('visible');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    imagesApiService.incrementPage();
    renderImagesMarkup(res.hits);
    smoothScroll();
    refreshSimpleLigthbox();

    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Error', error);
  }
}

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

function refreshSimpleLigthbox() {
  let lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh('show.simplelightbox', function () {});
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
