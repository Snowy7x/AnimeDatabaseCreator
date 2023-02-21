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

import {
  Schema,
  Types,
  model,
  HydratedDocument,
  HydratedDocumentFromSchema,
} from "mongoose";
import Inc from "mongoose-sequence";
import mongoose from "./src/db/Database.js";
import { getAnime, getEpisodesList } from "./src/sources/animeslayer.js";
import {
  fetchSearchZoro,
  fetchZoroAnimeFromName,
  fetchZoroAnimeInfo,
} from "./src/sources/zoro.js";
import {
  getAnimeByNameWithEpisodes,
  malGetAnimeWithId,
  malGetMangaWithId,
} from "./src/sources/myanimelist.js";
import { CONNREFUSED } from "dns";

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
  updated: { type: Boolean, default: false },
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

MangaSchema.plugin(AutoIncrement, { inc_field: "id" });
//AnimeSchema.plugin(AutoIncrement, { inc_field: "id" });

const AnimeModal = model("Anime", AnimeSchema);
const MangaModal = model("Manga", MangaSchema);

//fetchZoroAnimeFromName("Naruto").then((anime) =>onsole.log(anime));
//getEpisodesWithId(53446).then((ep) => console.log("Episodes: ", ep));
//getWatchLinks(2395, 42838).then((links) => console.log(links));
/* const promises = [ c
  new Promise((resolve, reject) => {
    getEpisodesList(2010).then((episodes) => resolve(episodes?.data));
  }),
  new Promise((resolve, reject) => {
    fetchZoroAnimeFromName("Naruto").then((anime) => resolve(anime?.episodes));
  }),
];

Promise.all(promises).then((re) => {
  console.log(re);
}); */

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

/* fetchZoroAnimeFromName(
  "One Piece Movie 09: Episode of Chopper Plus - Fuyu ni Saku, Kiseki no Sakura"
).then((r) => console.log(r));
 */
// TODO: 3849 requires update
// TODO: animes with ani_id: 102416
//getAnimeByNameWithEpisodes(7786).then((r) => console.log(r.episodeVideos[0]));

mongoose.connection.on("open", async () => {
  //const doc = await AnimeModal.findOne({ id: 343 });
  //UpdateFull(doc);
  //return;
  // Updating the animes
  const docs_ = await AnimeModal.find({
    updated: null,
    mal_id: { $ne: null },
  });
  console.log("Animes to update:", docs_.length);
  for await (const doc_ of docs_) {
    await UpdateFull(doc_);
  }
});
async function UpdateFull(doc) {
  console.log("Updating:", doc.id);
  await getAnime(doc.as_id)
    .then(async (anime) => {
      if (!anime) return console.log("Got issues with the anime");
      const ji = anime.just_info == "Yes" || anime.just_info == "YES";
      doc.justInfo = ji;
      if (!ji) {
        let anime = await getAnimeByNameWithEpisodes(doc.mal_id);
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
                mal_id: source.mal_id,
                ani_id: -1,
                name: source.title,
                coverUrl: source.images.jpg.maximum_image_url,
                type: source.type,
              };
            } else {
              for (const entry of relation.entry) {
                const rel = await AnimeModal.find({
                  mal_id: entry.mal_id,
                })
                  .then((r) => (r.length > 0 ? r[0] : null))
                  .catch(() => null);

                if (rel === null) {
                  console.log("No anime with mal_id: " + entry.mal_id);
                  continue;
                }

                final_relations.push({
                  id: rel.id,
                  mal_id: rel.mal_id,
                  ani_id: rel.ani_id,
                  as_id: rel.as_id,
                  coverUrl: rel.coverUrl,
                  rating: rel.score,
                  type: rel.type,
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
            const ar = Array.isArray(re[0]) ? <anEpisode[]>re[0] : [];
            const en = Array.isArray(re[1]) ? <zoroEpisode[]>re[1] : [];
            console.log(`Ar episodes for [${doc.id}] ` + ar.length);
            console.log(`En episodes for [${doc.id}] ` + en.length);
            let count = ar.length < en.length ? ar.length : en.length;
            let episodesFinal = [];
            for (let i = 0; i < count; i++) {
              const arEp = ar[i];
              const enEp = en[i];
              const num = enEp?.epNum ? enEp?.epNum : arEp?.episode_number;
              let ep = {
                id: arEp?.episode_id,
                enId: enEp?.episodeId,
                name: enEp?.episodeName
                  ? enEp?.episodeName
                  : arEp?.episode_name,
                number: num,
                thumbnailUrl: anime.episodeVideos.find(
                  (x) => x.episode.replace("Episode ", "") == num
                )?.images?.jpg.image_url,
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
