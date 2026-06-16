export interface Staff {
  staffId: string;
  staffType: number;
  name: string;
  character: string;
  avatarUrl: string;
  detailPath: string;
}

export interface MovieDetailResult {
  title: string;
  id: string;
  backdrop_path: string;
  release_date: string;
  media_type: string;
  vote_average: string;
  channel: string[];
  season: number | null;
  genre: string[];
  subjectid: string;
  stafflist: Staff[];
  duration: string | null;
  country: string;
  embed: string | null;
  dp: string;
  embed_en: boolean;
  dis: string;
  trailer: string;
}

export interface MovieDetailResponse {
  filters: string[];
  pager: {
    current_page: number;
    items_per_page: number;
    total_pages: number;
    total_results: number;
  };
  results: MovieDetailResult[];
  sorters: string[];
  system: {
    page_key: string;
  };
}

export interface DetailedMovieInfo {
  title: string;
  id: string;
  backdrop_path: string;
  release_date: string;
  media_type: string;
  vote_average: string;
  cn: string;
  genre: string[];
  duration: string;
  director: string;
  cast: string[];
  plot: string;
  votes: number;
  stafflist: Staff[];
  trailer: string | null;
  subjectid?: string;
  dp?: string;
  banner_backdrop?: string;
}
