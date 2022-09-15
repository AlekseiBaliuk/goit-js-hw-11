import ImagesApiService from './js/fetch-imagesAPI';
import Notiflix from 'notiflix';
import refreshSimpleLigthbox from './js/simplelightbox';
import smoothScroll from './js/smooth-scroll';
import { renderImagesMarkup, clearImagesContainer } from './js/markup';
import { refs } from './js/refs';

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
