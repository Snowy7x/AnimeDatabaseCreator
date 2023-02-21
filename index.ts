/* import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
import mongoose from "./src/db/Database";
import { getAnimeById } from "./src/sources/Manager";

server.listen(3000, () => {
  getAnimeById(2045);
  console.log("Server listening on port 3000");
}); */

import axios, { AxiosError } from "axios";
import {
  getAnime,
  getAnimeList,
  getEpisodesList,
  getWatchLinks,
} from "./src/sources/animeslayer.js";
const details_url = "https://anslayer.com/anime/public/anime/get-anime-details";
import mongoose from "./src/db/Database.js";
import { Document, Schema, Types, model } from "mongoose";
import Inc from "mongoose-sequence";
import { error } from "console";
import {
  getAnimeByName,
  getAnimeByNameWithEpisodes,
  getEpisodesWithId,
  malGetAnimeWithId,
  malGetMangaWithId,
} from "./src/sources/myanimelist.js";
import { kill } from "process";
import { fetchZoroAnimeFromName } from "./src/sources/zoro.js";

const AutoIncrement = Inc(mongoose);

const T_Schema = new Schema({
  name: { type: String, default: null },
  id: { type: Number, default: null },
});

const EpisodeDetails = new Schema({
  id: { type: Number, default: null },
  enId: { type: String, default: null },
  name: { type: String, default: null },
  number: { type: String, default: null },
  thumbnailUrl: { type: String, default: null },
  urls: { type: [String], default: [] },
});

const Relation = new Schema({
  id: { type: Number, default: null },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },
  as_id: { type: Number, default: null },
  name: { type: String, default: null },

  coverUrl: { type: String, default: null },
  rating: { type: Number, default: null },
  type: { type: String, default: null },
});

const Recommendation = new Schema({
  id: { type: Number, default: null },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },
  as_id: { type: Number, default: null },
  name: { type: String, default: null },

  coverUrl: { type: String, default: null },
  rating: { type: Number, default: null },
  type: { type: String, default: null },
});

const Adaption = new Schema({
  id: { type: Number, default: null },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },
  name: { type: String, default: null },
  coverUrl: { type: String, default: null },
  type: { type: String, default: null },
});

const AnimeSchema = new Schema({
  id: { type: Number, default: null, sparse: true },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },
  as_id: { type: Number, default: null },
  justInfo: { type: Boolean, default: false },
  adaption: { type: Adaption, default: null },

  name: { type: String, default: null },
  description_ar: { type: String, default: null },
  description_en: { type: String, default: null },
  coverUrl: { type: String, default: null },
  bannerUr: { type: String, default: null },
  trailer: { type: String, default: null },
  source: { type: String, default: null },
  duration: { type: String, default: null },

  score: { type: Number, default: null },
  scored_by: { type: Number, default: null },
  year: { type: Number, default: null },

  type: { type: String, default: null },
  Rated: { type: String, default: null },
  season: { type: String, default: null },
  status: { type: String, default: null },
  keywords: { type: [String], default: [] },

  genres_ar: [T_Schema],
  genres_en: [T_Schema],
  studios: [T_Schema],
  episodes: [EpisodeDetails],
  relations: [Relation],
  recommended: [Recommendation],
});

const MangaSchema = new Schema({
  id: { type: Number, default: null, sparse: true },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },

  name: { type: String, default: null },
  description_ar: { type: String, default: null },
  description_en: { type: String, default: null },
  coverUrl: { type: String, default: null },
  bannerUrl: { type: String, default: null },
  source: { type: String, default: null },

  score: { type: Number, default: null },
  scored_by: { type: Number, default: null },
  year: { type: Number, default: null },

  type: { type: String, default: null },
  status: { type: String, default: null },
  keywords: { type: [String], default: [] },

  genres_ar: [T_Schema],
  genres_en: [T_Schema],
  studios: [T_Schema],
  chapters: [EpisodeDetails],
  relations: [Relation],
  recommended: [Recommendation],
});

const LatestEpisodeSchema = new Schema({
  id: { type: Number, default: null, sparse: true },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },
  epId: { type: Number, default: null },
  epIdEn: { type: String, default: null },

  epNumber: { type: String, default: null },
  name: { type: String, default: null },
  description_ar: { type: String, default: null },
  description_en: { type: String, default: null },
  coverUrl: { type: String, default: null },

  score: { type: Number, default: null },
  scored_by: { type: Number, default: null },

  type: { type: String, default: null },
  status: { type: String, default: null },

  genres_ar: [T_Schema],
  genres_en: [T_Schema],
});

const topAnimeSchema = new Schema({
  id: { type: Number, default: null, sparse: true },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },

  name: { type: String, default: null },
  description_ar: { type: String, default: null },
  description_en: { type: String, default: null },
  coverUrl: { type: String, default: null },

  rank: { type: Number, default: null },
  score: { type: Number, default: null },
  scored_by: { type: Number, default: null },

  type: { type: String, default: null },
  status: { type: String, default: null },

  genres_ar: [T_Schema],
  genres_en: [T_Schema],
});

type zoroEpisode = { epNum: string; episodeName: string; episodeId: string };
type anEpisode = {
  episode_number: string;
  episode_name: string;
  episode_id: string;
  allow_comment: string;
  skip_from: string;
  skip_to: string;
  episode_watched_history: any;
  next_episode: anEpisode;
  previous_episode: anEpisode;
};

const AnimeModal = model("Anime", AnimeSchema);
const MangaModal = model("Manga", MangaSchema);
const LatestEpisodeModal = model("LatestEpisode", LatestEpisodeSchema);
const topAnimeModal = model("topAnime", topAnimeSchema);

// TODO: 3849 requires update
// TODO: animes with ani_id: 102416
mongoose.connection.on("open", async () => {
  updateTopAnime();
  updateLatestEpisodes();
  setInterval(() => {
    updateTopAnime();
  }, 1000 * 60 * 60 * 24);

  setInterval(() => {
    updateLatestEpisodes();
  }, 1000 * 60 * 30);
});

async function updateLatestEpisodes() {
  console.log("Update latest episodes");
  //  TODO: Update the latest episodes
  const latestEpisodes = await getAnimeList("latest_episodes", 100, 0).then(
    (r) => r.data
  );
  for await (let episode of latestEpisodes) {
    const anime = await AnimeModal.findOne({ as_id: episode.anime_id });
    if (
      (
        await LatestEpisodeModal.find({
          id: anime.id,
          epId: episode?.latest_episode_id,
        })
      ).length > 0
    )
      continue;
    let zoroAnime = await fetchZoroAnimeFromName(anime.name).then((an) =>
      Array.isArray(an?.episodes) ? an?.episodes[an?.episodes?.length - 1] : {}
    );
    console.log("Episode:", anime.name);
    const latestEpisode = new LatestEpisodeModal({
      id: anime.id,
      mal_id: anime.mal_id,
      ani_id: anime.ani_id,
      epId: episode?.latest_episode_id,
      epIdEn: zoroAnime?.episodeId,

      epNumber: episode.latest_episode_name
        .replace("الحلقة : ", "")
        .replace(" - فلر", ""),
      name: anime.name,
      description_ar: anime.description_ar,
      description_en: anime.description_en,
      coverUrl: anime.coverUrl,

      score: anime.score,
      scored_by: anime.scored_by,

      type: anime.type,
      status: anime.status,

      genres_ar: anime.genres_ar,
      genres_en: anime.genres_en,
    });
    await latestEpisode.save();
    //await UpdateFull(anime);
  }
}

async function updateTopAnime() {
  console.log("Updating top animes");
  // TODO: Update the top animes
  const topAnimes = await getAnimeList("top_currently_airing_mal", 100, 0).then(
    (r) => r.data
  );
  let i = 1;
  for await (let an of topAnimes) {
    const anime = await AnimeModal.findOne({ as_id: an.anime_id });
    console.log("Anime:", anime.name);
    let topAnime = await topAnimeModal.findOne({ rank: i });
    if (topAnime) {
      topAnime.id = anime.id;
      topAnime.mal_id = anime.mal_id;
      topAnime.ani_id = anime.ani_id;
      topAnime.name = anime.name;
      topAnime.description_ar = anime.description_ar;
      topAnime.description_en = anime.description_en;
      topAnime.coverUrl = anime.coverUrl;
      topAnime.rank = i;
      topAnime.score = anime.score;
      topAnime.scored_by = anime.scored_by;
      topAnime.type = anime.type;
      topAnime.status = anime.status;
      topAnime.genres_ar = anime.genres_ar;
      topAnime.genres_en = anime.genres_en;
    } else {
      topAnime = new topAnimeModal({
        id: anime.id,
        mal_id: anime.mal_id,
        ani_id: anime.ani_id,

        name: anime.name,
        description_ar: anime.description_ar,
        description_en: anime.description_en,
        coverUrl: anime.coverUrl,

        rank: i,
        score: anime.score,
        scored_by: anime.scored_by,

        type: anime.type,
        status: anime.status,

        genres_ar: anime.genres_ar,
        genres_en: anime.genres_en,
      });
    }

    await topAnime.save();
    i++;
  }
}
