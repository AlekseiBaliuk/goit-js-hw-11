// const { default: axios } = require('axios');
import axios from 'axios';

export default class ImagesApiService {
  #API_KEY = '29903101-949784c6f6ed1a6d356bb42d9';
  #BASE_URL = 'https://pixabay.com/api/';

  searchQuery = '';
  page = 1;
  per_page = 40;
  imgCounter = 40;

  async fetchImages() {
    const url = await axios.get(this.#BASE_URL, {
      params: {
        key: this.#API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    });

    return url.data;
  }

  incrementPage() {
    this.page += 1;
    this.imgCounter += 40;
  }

  resetPage() {
    this.page = 1;
    this.imgCounter = 40;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
