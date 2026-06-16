import axios from 'axios';
import type { Movie } from '../data/movies';

const api = axios.create({
  baseURL: 'https://api2.imdb3.shop/api/',
});

export default api;
export type { Movie };
