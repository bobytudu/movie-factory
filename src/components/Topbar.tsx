import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AutoComplete, Input, Spin } from 'antd';
import { SearchOutlined, VideoCameraFilled } from '@ant-design/icons';
import api from '../services/api';
import type { Movie } from '../services/api';


const Topbar: React.FC = () => {
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchValue.trim()) {
      setOptions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/search2/${encodeURIComponent(searchValue)}`, {
          params: { page: 0 },
        });
        const movies: Movie[] = response.data.results || [];

        const formatted = movies.map((movie) => ({
          value: movie.id,
          label: (
            <div className="flex items-center gap-3 p-1 cursor-pointer hover:bg-slate-800 transition-colors">
              <img
                src={movie.backdrop_path}
                alt={movie.title}
                className="w-10 h-14 object-cover rounded shadow-md border border-slate-700"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-white font-medium text-sm truncate">{movie.title}</span>
                <span className="text-slate-400 text-xs">
                  {movie.release_date} • {movie.cn || movie.media_type}
                </span>
              </div>
            </div>
          ),
        }));

        setOptions(formatted);
      } catch (error) {
        console.error('Failed to search movies:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  const handleSelect = (value: string) => {
    setSearchValue('');
    setOptions([]);
    navigate(`/movie/${value}`);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
            <VideoCameraFilled className="text-xl text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-violet-300 transition-colors">
            MOVIE FACTORY
          </span>
        </Link>

        {/* Searchbar */}
        <div className="w-full sm:w-96 relative">
          <AutoComplete
            options={options}
            onSelect={handleSelect}
            onSearch={(value) => setSearchValue(value)}
            value={searchValue}
            popupClassName="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl"
            className="w-full"
          >
            <Input
              placeholder="Search movies by title..."
              prefix={<SearchOutlined className="text-slate-400 mr-1" />}
              suffix={loading && <Spin size="small" />}
              className="bg-slate-900/50 hover:bg-slate-900 border-slate-800 hover:border-indigo-500 focus:border-indigo-500 text-white rounded-lg py-2 transition-all placeholder:text-slate-500"
            />
          </AutoComplete>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
