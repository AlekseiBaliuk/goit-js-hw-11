import ImagesApiService from './js/fetch-imagesAPI';
import Notiflix from 'notiflix';
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
            Notiflix.Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
            observe.unobserve(refs.sentinel);
          }
        } catch (error) {
          Notiflix.Notify.failure('Error', error);
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
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  imagesApiService.resetPage();
  clearImagesContainer();
  e.currentTarget.reset();

  try {
    const res = await imagesApiService.fetchImages();

    if (res.hits.length === 0) {
      return Notiflix.Notify.failure('Error');
    }

    renderImagesMarkup(res.hits);
    refreshSimpleLigthbox();
    observe.observe(refs.sentinel);
    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
  } catch (error) {
    Notiflix.Notify.failure('Error', error);
  }
}
