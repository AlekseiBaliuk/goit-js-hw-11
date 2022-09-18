import Notiflix from 'notiflix';

function onSuccesMessage(res) {
  Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
}

function onWarningMessage() {
  Notiflix.Notify.warning(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onWarningMessageEndSearchResults() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}

function onErrorMessage() {
  Notiflix.Notify.failure('Error');
}

export {
  onSuccesMessage,
  onWarningMessage,
  onWarningMessageEndSearchResults,
  onErrorMessage,
};
