import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag } from 'antd';
import { StarFilled, ClockCircleOutlined, GlobalOutlined } from '@ant-design/icons';
import type { Movie } from '../services/api';


interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <Card
        hoverable
        className="bg-slate-900/40 border-slate-800/80 overflow-hidden h-full flex flex-col hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 rounded-xl"
        bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        cover={
          <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
            <img
              src={movie.backdrop_path}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            {/* Rating badge */}
            <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-yellow-500/30 flex items-center gap-1 shadow-lg">
              <StarFilled className="text-yellow-500 text-xs" />
              <span className="text-white text-xs font-bold font-mono">
                {parseFloat(movie.vote_average).toFixed(1)}
              </span>
            </div>
            
            {/* Country badge */}
            <div className="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium tracking-wider uppercase flex items-center gap-1">
              <GlobalOutlined className="text-[10px]" />
              {movie.cn}
            </div>
          </div>
        }
      >
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-xs font-medium mb-1 flex justify-between items-center">
              <span>{movie.release_date}</span>
              <span className="flex items-center gap-1">
                <ClockCircleOutlined className="text-[10px]" />
                {movie.duration}
              </span>
            </div>
            <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-indigo-400 transition-colors mb-2">
              {movie.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-1 mt-auto">
            {movie.genre?.slice(0, 3).map((g) => (
              <Tag key={g} bordered={false} className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded m-0">
                {g}
              </Tag>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MovieCard;
