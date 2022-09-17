import ImagesApiService from './js/fetch-imagesAPI';
import Notiflix from 'notiflix';
import refreshSimpleLigthbox from './js/simplelightbox';
import smoothScroll from './js/smooth-scroll';
import { renderImagesMarkup, clearImagesContainer } from './js/markup';
import { refs } from './js/refs';
import './js/btn-to-top';

const imagesApiService = new ImagesApiService();

refs.serchForm.addEventListener('submit', onFormSubmit);

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

  e.currentTarget.reset();
}

async function fetchImages() {
  try {
    const res = await imagesApiService.fetchImages();
    // console.log(res);

    if (res.hits.length === 0) {
      return Notiflix.Notify.failure('Error');
    }

    const observe = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && imagesApiService.searchQuery !== '') {
            imagesApiService.incrementPage();
            renderImagesMarkup(res.hits);
            refreshSimpleLigthbox();
          }

          if (imagesApiService.page > 2) {
            smoothScroll();
          }

          if (imagesApiService.imgCounter >= res.totalHits) {
            Notiflix.Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
            observe.unobserve(refs.sentinel);
          }
        });
      },
      {
        rootMargin: '150px',
      }
    );

    // const onEntry = entries => {
    //   entries.forEach(entry => {
    // if (entry.isIntersecting && imagesApiService.searchQuery !== '') {
    //   imagesApiService.incrementPage();
    //   renderImagesMarkup(res.hits);
    //   refreshSimpleLigthbox();
    // }

    // if (imagesApiService.page > 2) {
    //   smoothScroll();
    // }

    // if (imagesApiService.imgCounter >= res.totalHits) {
    //   Notiflix.Notify.warning(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    //   observe.unobserve(refs.sentinel);
    // }
    //   });
    // };

    // const observe = new IntersectionObserver(onEntry, {
    //   rootMargin: '150px',
    // });

    observe.observe(refs.sentinel);

    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Error', error);
  }
}
