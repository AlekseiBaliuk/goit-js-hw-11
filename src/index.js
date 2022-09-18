import ImagesApiService from './js/fetch-imagesAPI';
import {
  onSuccesMessage,
  onWarningMessage,
  onWarningMessageEndSearchResults,
  onErrorMessage,
} from './js/notiflix-messages';
import refreshSimpleLigthbox from './js/simplelightbox';
import smoothScroll from './js/smooth-scroll';
import { renderImagesMarkup, clearImagesContainer } from './js/markup';
import { refs } from './js/refs';
import './js/btn-to-top';

const imagesApiService = new ImagesApiService();

refs.serchForm.addEventListener('submit', onFormSubmit);

const observe = new IntersectionObserver(
  entries => {
    entries.forEach(async entry => {
      if (entry.isIntersecting && imagesApiService.searchQuery !== '') {
        imagesApiService.incrementPage();
        try {
          const res = await imagesApiService.fetchImages();
          renderImagesMarkup(res.hits);
          refreshSimpleLigthbox();

          if (imagesApiService.page > 2) {
            smoothScroll();
          }

          if (imagesApiService.imgCounter >= res.totalHits) {
            onWarningMessageEndSearchResults();
            observe.unobserve(refs.sentinel);
          }
        } catch (error) {
          onErrorMessage();
        }
      }
    });
  },
  {
    rootMargin: '150px',
  }
);

async function onFormSubmit(e) {
  e.preventDefault();

  imagesApiService.searchQuery = e.currentTarget.searchQuery.value.trim();

  if (imagesApiService.searchQuery === '') {
    return onWarningMessage();
  }

  imagesApiService.resetPage();
  clearImagesContainer();
  e.currentTarget.reset();

  try {
    const res = await imagesApiService.fetchImages();

    if (res.hits.length === 0) {
      return onWarningMessage();
    }

    renderImagesMarkup(res.hits);
    refreshSimpleLigthbox();
    observe.observe(refs.sentinel);
    onSuccesMessage(res);
  } catch (error) {
    onErrorMessage();
  }
}
