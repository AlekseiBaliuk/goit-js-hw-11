import { refs } from './refs';

refs.goTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function trackScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;
  const halfcoords = coords / 3;

  if (scrolled > halfcoords) {
    refs.goTopBtn.classList.add('back-to-top-show');
  }
  if (scrolled < halfcoords) {
    refs.goTopBtn.classList.remove('back-to-top-show');
  }
}

window.addEventListener('scroll', trackScroll);
