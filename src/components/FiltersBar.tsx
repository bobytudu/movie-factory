import React from 'react';
import { Select, Button } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { GENRES, COUNTRIES, YEARS, SORT_OPTIONS } from '../data/movies';

interface FiltersBarProps {
  country: string;
  year: string;
  genre: string;
  sortBy: string;
  onFilterChange: (key: string, value: string | undefined) => void;
  onClear: () => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  country,
  year,
  genre,
  sortBy,
  onFilterChange,
  onClear,
}) => {
  const hasActiveFilters = country || year || genre || sortBy !== 'rating-desc';

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 sm:p-6 mb-8 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <FilterOutlined className="text-indigo-400 text-lg" />
        <h2 className="text-white text-lg font-bold m-0">Filter Movies</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Genre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Genre</label>
          <Select
            placeholder="All Genres"
            allowClear
            value={genre || undefined}
            onChange={(val) => onFilterChange('genre', val)}
            className="w-full custom-select"
            popupClassName="bg-slate-950 border border-slate-800 text-white"
          >
            {GENRES.map((g) => (
              <Select.Option key={g} value={g}>
                {g}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Country</label>
          <Select
            placeholder="All Countries"
            allowClear
            value={country || undefined}
            onChange={(val) => onFilterChange('country', val)}
            className="w-full custom-select"
            popupClassName="bg-slate-950 border border-slate-800 text-white"
          >
            {COUNTRIES.map((c) => (
              <Select.Option key={c} value={c}>
                {c}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Year</label>
          <Select
            placeholder="All Years"
            allowClear
            value={year || undefined}
            onChange={(val) => onFilterChange('year', val)}
            className="w-full custom-select"
            popupClassName="bg-slate-950 border border-slate-800 text-white"
          >
            {YEARS.map((y) => (
              <Select.Option key={y} value={y.toString()}>
                {y}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Sort By</label>
          <Select
            placeholder="Sort By"
            value={sortBy}
            onChange={(val) => onFilterChange('sortBy', val)}
            className="w-full custom-select"
            popupClassName="bg-slate-950 border border-slate-800 text-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Reset Button */}
        <div className="h-10 flex items-center">
          <Button
            type="text"
            disabled={!hasActiveFilters}
            onClick={onClear}
            icon={<ReloadOutlined />}
            className="w-full h-10 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/10 text-slate-400 hover:text-red-400 disabled:text-slate-600 disabled:border-slate-900 transition-all rounded-lg flex items-center justify-center gap-1.5"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
