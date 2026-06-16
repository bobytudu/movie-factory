import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pagination, Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import api from '../services/api';
import type { Movie } from '../services/api';

import FiltersBar from '../components/FiltersBar';
import MovieCard from '../components/MovieCard';




const PAGE_SIZE = 30;

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  // Extract filters from URL search params
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';
  const genre = searchParams.get('genre') || '';
  const sortBy = searchParams.get('sortBy') || 'release_date-desc';
  const pageStr = searchParams.get('page') || '1';
  const page = parseInt(pageStr, 10) || 1;

  // useEffect(() => {
  //   async function getSearchResult() {
  //     try {
  //       const { data: res } = await axios.get('https://api2.imdb4.shop/api/search2/bad+bo?page=0')
  //       console.log(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getSearchResult()
  // }, [])

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let apiSortBy = 'date';
        // let apiSortOrder = 'desc';

        if (sortBy.startsWith('vote_average')) {
          apiSortBy = 'rating';
        } else if (sortBy.startsWith('release_date')) {
          apiSortBy = 'date';
        }

        // if (sortBy.endsWith('asc')) {
        //   apiSortOrder = 'asc';
        // }

        const params: {
          country?: string;
          year?: string;
          genre?: string;
          sortBy?: string;
          page?: number;
          type?: number;
          countryNot?: string;
          countryNot2?: string;
          sort_by?: string;
          sort_order?: string;
          releasedate?: string;
          genre_id?: string;
        } = {
          page: page - 1,
          type: 1,
          countryNot: 'Nigeria',
          countryNot2: 'Philippines',
          sort_by: apiSortBy,
          // sort_order: apiSortOrder,
        };

        if (country) {
          params.country = country;
        }
        if (year) {
          params.releasedate = year;
        }
        if (genre) {
          params.genre_id = genre;
        }

        const response = await api.get('/movies/filter', { params });
        const results = response.data.results || [];
        setMovies(results);
        setTotalResults(response.data.pager?.total_results || 0);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [country, year, genre, sortBy, page]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 when changing filters
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({ sortBy: 'release_date-desc', page: '1' });
  };

  const handlePageChange = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', p.toString());
    setSearchParams(newParams);
    // Smooth scroll to top of movie section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          Explore The{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cinematic World
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base">
          Find your next favorite movie. Filter by country, release year, genre, or sort by ratings and titles.
        </p>
      </div>

      {/* Filters Bar */}
      <FiltersBar
        country={country}
        year={year}
        genre={genre}
        sortBy={sortBy}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Movie Grid / Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spin indicator={<LoadingOutlined className="text-4xl text-indigo-500" spin />} />
          <span className="text-slate-400 font-medium text-sm animate-pulse">Loading movies...</span>
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="opacity-0 translate-y-4 animate-fade-in"
                style={{ animationFillMode: 'forwards', animationDelay: '50ms' }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center bg-slate-900/20 border border-slate-900 rounded-xl p-4 max-w-max mx-auto shadow-md">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={totalResults}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        </>
      ) : (
        <div className="py-20 bg-slate-900/20 border border-slate-900 rounded-2xl flex items-center justify-center">
          <Empty
            description={
              <span className="text-slate-400 font-medium">No movies found matching these criteria</span>
            }
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
