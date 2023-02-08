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
const details_url = "https://anslayer.com/anime/public/anime/get-anime-details";
import mongoose from "./src/db/Database.js";
import { Schema, Types, model } from "mongoose";
import Inc from "mongoose-sequence";
import { getAnimeByNameWithEpisodes } from "./src/sources/myanimelist.js";
const AutoIncrement = Inc(mongoose);
const T_Schema = new Schema({
  name: { type: String, default: null },
  id: { type: Number, default: null },
});
const EpisodeDetails = new Schema({
  id: { type: Number, default: null },
  name: { type: String, default: null },
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
const AnimeSchema = new Schema({
  id: { type: Number, default: null, sparse: true },
  mal_id: { type: Number, default: null },
  ani_id: { type: Number, default: null },
  as_id: { type: Number, default: null },
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
  genres_ar: [T_Schema],
  genres_en: [T_Schema],
  studios: [T_Schema],
  episodes: [EpisodeDetails],
  relations: [Relation],
  recommended: [Recommendation],
});
AnimeSchema.plugin(AutoIncrement, { inc_field: "id" });
const AnimeModal = model("Anime", AnimeSchema);
const headers = {
  "Client-Id": "android-app2",
  "Client-Secret": "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd",
};
async function createAnime(d) {
  const anime = new AnimeModal({
    as_id: d.anime_id,
    name: d.anime_name,
    description_ar: d.anime_description,
    coverUrl: d.anime_cover_image_full_url ?? d.anime_cover_image_url,
    bannerUr: d.anime_banner_image_url,
    source: d?.more_info_result?.source,
    year: d.anime_release_year,
    type: d.anime_type,
    Rated: d.anime_age_rating,
    season: d.anime_season,
    status: d.anime_status,
    genres_ar: d?.anime_genres?.split(", ").map((e, i) => ({
      name: e,
      id: d?.anime_genre_ids?.split(", ")[i],
    })),
  });
  await anime.save();
}
mongoose.connection.on("open", async () => {
  console.log("Connected to db 2.");
  for await (const doc of AnimeModal.find()) {
    let mal_data = await getAnimeByNameWithEpisodes(doc.name);
    console.log(`Got anime[${doc.id} - ${mal_data.mal_id}]: ${doc.name}`);
    doc.description_en = mal_data.synopsis;
    doc.mal_id = mal_data.mal_id;
    doc.duration = mal_data.duration;
    doc.source = mal_data.source;
    doc.score = mal_data.score;
    doc.scored_by = mal_data.scored_by;
    doc.genres_en = new Types.DocumentArray(
      mal_data.genres.map((re) => ({
        id: re.mal_id,
        name: re.name,
      }))
    );
    doc.coverUrl =
      mal_data.images.jpg.maximum_image_url ??
      mal_data.images.webp.maximum_image_url;
    doc.studios = new Types.DocumentArray(
      mal_data.studios.map((re) => ({
        id: re.mal_id,
        name: re.name,
      }))
    );
    await doc.save();
  }
});
