import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tag, Spin, Card } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, GlobalOutlined, CalendarOutlined, StarFilled } from '@ant-design/icons';
import api from '../services/api';
import type { Movie } from '../services/api';
import { MOVIES } from '../data/movies';


const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // 1. Search in local MOVIES mock database first
        let foundMovie = MOVIES.find((m) => m.id === id);

        // 2. If not in local data, fetch a list from live API and find it
        if (!foundMovie) {
          const response = await api.get('/movies/filter', {
            params: { page: 0, type: 1, countryNot: 'Nigeria', countryNot2: 'Philippines' }
          });
          const results: Movie[] = response.data.results || [];
          foundMovie = results.find((m) => m.id === id);
        }

        if (foundMovie) {
          // Provide fallback values for detailed fields that are missing in backend filter results
          const detailedMovie: Movie = {
            ...foundMovie,
            genre: foundMovie.genre || ["Drama", "Action"],
            duration: foundMovie.duration || "120 min",
            director: foundMovie.director || "Unknown Director",
            cast: foundMovie.cast || ["Lead Actor", "Supporting Actor"],
            plot: foundMovie.plot || "A fascinating story following the lives and unexpected events surrounding the characters in this cinematic masterpiece.",
            votes: foundMovie.votes || Math.floor(Math.random() * 5000) + 500,
          };
          setMovie(detailedMovie);
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error('Failed to fetch movie detail:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Spin size="large" />
        <span className="text-slate-400 font-medium text-sm animate-pulse">Loading movie details...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-md mx-auto my-20 text-center px-4">
        <Card className="bg-slate-900 border-slate-800 text-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-slate-400 mb-6">The movie you are looking for does not exist or has been removed.</p>
          <Button type="primary" onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-lg h-10 px-6">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-12">
      {/* Banner/Backdrop Image */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={movie.banner_backdrop || movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            onClick={() => navigate(-1)}
            icon={<ArrowLeftOutlined />}
            className="bg-slate-900/80 hover:bg-slate-800/95 border-slate-800 hover:border-indigo-500 text-white font-medium rounded-xl h-11 px-5 flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-sm"
          >
            Back
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 sm:-mt-48 relative z-10 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Poster Card */}
          <div className="w-64 sm:w-72 mx-auto lg:mx-0 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 aspect-[2/3] transform hover:scale-[1.01] transition-transform duration-300">
              <img src={movie.backdrop_path} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-grow flex flex-col justify-end pt-4 lg:pt-20 text-center lg:text-left">
            {/* Title & Year */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 flex flex-col lg:flex-row items-center lg:items-end gap-3 justify-center lg:justify-start">
              <span>{movie.title}</span>
              <span className="text-slate-400 font-normal text-2xl sm:text-3xl font-mono">({movie.release_date})</span>
            </h1>

            {/* Quick Metadata badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-sm text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
                <CalendarOutlined className="text-indigo-400" />
                <span>{movie.release_date}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
                <ClockCircleOutlined className="text-indigo-400" />
                <span>{movie.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
                <GlobalOutlined className="text-indigo-400" />
                <span>{movie.cn}</span>
              </div>
            </div>

            {/* Rating and Votes */}
            <div className="flex items-center justify-center lg:justify-start gap-3.5 mb-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
                <StarFilled className="text-yellow-500 text-lg" />
                <div>
                  <span className="text-white text-xl font-black font-mono">{parseFloat(movie.vote_average).toFixed(1)}</span>
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">/ 10</span>
                </div>
              </div>
              <div className="text-slate-400 text-xs text-left">
                <div className="font-bold text-slate-200 text-sm">{movie.votes.toLocaleString()}</div>
                <div>User Votes</div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
              {movie.genre.map((g) => (
                <Tag key={g} bordered={false} className="bg-indigo-650/20 text-indigo-300 font-semibold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase m-0 border border-indigo-500/20">
                  {g}
                </Tag>
              ))}
            </div>

            {/* Plot / Overview */}
            <div className="bg-slate-900/40 border border-slate-900/80 rounded-2xl p-6 mb-8 backdrop-blur-sm text-left">
              <h3 className="text-lg font-bold text-white mb-3">Overview</h3>
              <p className="text-slate-300 text-base leading-relaxed">{movie.plot}</p>
            </div>

            {/* Director and Cast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-slate-900/40 border border-slate-900/80 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Director</h4>
                <p className="text-white text-base font-bold">{movie.director}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-900/80 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Starring</h4>
                <p className="text-white text-base font-bold line-clamp-1">{movie.cast.join(', ')}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
