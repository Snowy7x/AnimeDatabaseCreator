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

  epNumber: { type: Number, default: null },
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
    updateLatestEpisodes();
  }, 1000 * 60 * 10);
});

async function updateLatestEpisodes() {
  console.log("Update latest episodes");
  //  TODO: Update the latest episodes
  const latestEpisodes = await getAnimeList("latest_episodes", 100, 0).then(
    (r) => r.data
  );
  for await (let episode of latestEpisodes) {
    const anime = await AnimeModal.findOne({ as_id: episode.anime_id });
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

      epNumber: episode.latest_episode_name.replace("الحلقة : ", ""),
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
  const topAnimes = await getAnimeList("top_currently_airing_mal", 1, 0).then(
    (r) => r.data
  );
  let i = 1;
  for await (let an of topAnimes) {
    const anime = await AnimeModal.findOne({ as_id: an.anime_id });
    console.log("Anime:", anime.name);
    const topAnime = new topAnimeModal({
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
    await topAnime.save();
    i++;
  }
}

async function UpdateFull(doc) {
  console.log("Updating:", doc.id);
  await getAnime(doc.as_id)
    .then(async (anime) => {
      if (!anime) return console.log("Got issues with the anime");
      const ji = anime.just_info == "Yes" || anime.just_info == "YES";
      doc.justInfo = ji;
      if (!ji) {
        let anime = await malGetAnimeWithId(doc.mal_id);
        console.log("title:", anime.title);
        doc.name = anime.title;

        // Update Relations
        if (anime.relations && anime.relations.length > 0) {
          console.log("Updating relations:", anime.relations.length);
          let final_relations = [];

          for await (const relation of anime.relations) {
            if (
              relation.relation == "Adaptation" ||
              relation.relation == "adaptation"
            ) {
              const source = await malGetMangaWithId(relation.entry[0].mal_id);
              console.log("Adaptation:", source.title);
              // Updating manga info:
              let manga = await MangaModal.findOne({ mal_id: source.mal_id });
              if (!manga) {
                manga = new MangaModal({
                  mal_id: source.mal_id,
                  name: source.title,
                  description_ar: "",
                  description_en: source.synopsis,
                  coverUrl: source.images.jpg.image_url,
                  bannerUrl: source.images.jpg.image_url,
                  source: null,
                  score: source.score,
                  scored_by: source.scored_by,
                  year: source.published.from.split("-").shift(),
                  type: source.type,
                  status: source.status,
                  keywords: source.titles.map((title) => title.title),
                  genres_en: source.genres.map((genre) => ({
                    id: genre.mal_id,
                    name: genre.name,
                  })),
                  studios: source.serializations.map((ser) => ({
                    id: ser.mal_id,
                    name: ser.name,
                  })),
                });
                await manga.save();
              }
              // Add the manga
              doc.adaptation = {
                id: manga.id,
                mal_id: source?.mal_id,
                ani_id: -1,
                name: source?.title,
                coverUrl: source?.images.jpg?.maximum_image_url
                  ? source?.images.jpg.maximum_image_url
                  : source?.images.webp?.maximum_image_url
                  ? source?.images.webp.maximum_image_url
                  : null,
                type: source.type,
              };
            } else {
              for (const entry of relation.entry) {
                const rel =
                  (await AnimeModal.findOne({ mal_id: entry.mal_id })) ?? null;

                final_relations.push({
                  id: rel?.id,
                  mal_id: rel?.mal_id,
                  ani_id: rel?.ani_id,
                  as_id: rel?.as_id,
                  coverUrl: rel?.coverUrl,
                  rating: rel?.score,
                  type: rel?.type,
                });
              }
            }
          }
          doc.relations = final_relations;
        } else {
          console.log("No Relations found for this anime");
        }

        // Update Episodes:
        const promises = [
          new Promise<anEpisode[]>((resolve) => {
            getEpisodesList(doc.as_id).then((episodes) =>
              resolve(episodes?.data)
            );
          }),
          new Promise<zoroEpisode[]>((resolve) => {
            fetchZoroAnimeFromName(anime.title).then((an) =>
              resolve(an?.episodes)
            );
          }),
        ];

        await Promise.all(promises)
          .then(async (re) => {
            const ar = <anEpisode[]>re[0];
            const en = <zoroEpisode[]>re[1];
            console.log(`Ar episodes for [${doc.id}] ` + ar.length);
            console.log(`En episodes for [${doc.id}] ` + en.length);
            let count = ar.length < en.length ? ar.length : en.length;
            let episodesFinal = [];
            for (let i = 0; i < count; i++) {
              const arEp = ar[i];
              const enEp = en[i];
              let ep = {
                id: arEp?.episode_id,
                enId: enEp?.episodeId,
                name: enEp?.episodeName
                  ? enEp?.episodeName
                  : arEp?.episode_name,
                number: enEp?.epNum ? enEp?.epNum : arEp?.episode_number,
                thumbnailUrl: doc?.episodes[i]?.thumbnailUrl,
                urls: doc?.episodes[i]?.urls,
              };
              episodesFinal.push(ep);
            }
            doc.episodes = new Types.DocumentArray(episodesFinal);
            console.log("Updated episodes");
            await doc.save();
          })
          .catch((err) => {
            console.log(
              `Error saving episodes for [${doc.id}] because:`,
              err.message
            );
          });
      }
      await doc.save();
    })
    .catch((err) => console.log(err.message));
}
