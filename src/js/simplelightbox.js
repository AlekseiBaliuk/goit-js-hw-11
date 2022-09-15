import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export default function refreshSimpleLigthbox() {
  let lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh('show.simplelightbox', function () {});
}
