enum Type {
  TV,
  OVA,
  ONA,
  Movie,
  Special,
  Music,
}

enum Status {
  Finished_Airing,
  Currently_Airing,
  Not_Yet_Aired,
}

enum Rated {
  G, // All ages
  PG, // Children
  PG_3, // +13
  R_17, // +17
  R_plus, // mild nudity
  Rx, // hentai
}

enum Season {
  Spring,
  Summer,
  Winter,
  Fall,
}

enum Quality {
  AV,
  SD,
  HD,
  FHD,
  UHD,
}

type T = {
  name: string;
  id: number;
};

type Video = {
  quality: Quality;
  url: string;
};

type Recommendation = {
  id: number;
  mal_id: number;
  ani_id: number;
  as_id: number;

  name: string;
  coverUrl: string;
};

type Relation = {
  id: number;
  mal_id: number;
  ani_id: number;
  as_id: number;

  name: string;
  coverUrl: string;
  rating: number;
  type: Type;
};

interface AnimeDetails {
  id: number;
  mal_id: number;
  ani_id: number;
  as_id: number;

  name: string;
  description_ar: string;
  description_en: string;
  coverUrl: string;
  bannerUr: string;
  trailer: string;
  source: string;
  duration: string;

  score: number;
  scored_by: number;
  year: number;

  type: Type;
  Rated: Rated;
  season: Season;
  status: Status;

  genres_ar: T[];
  genres_en: T[];
  studios: T[];
  episodes: EpisodeDetails[];
  relations: Relation[];
  recommended: Recommendation[];
}

interface EpisodeDetails {
  id: number;
  name: string;
  thumbnailUrl: string;
  urls: Video[];
}
