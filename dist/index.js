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
import { getEpisodesList, getWatchLinks, } from "./src/sources/animeslayer.js";
const details_url = "https://anslayer.com/anime/public/anime/get-anime-details";
import mongoose from "./src/db/Database.js";
import { Schema, Types, model } from "mongoose";
import Inc from "mongoose-sequence";
import { getAnimeByNameWithEpisodes, } from "./src/sources/myanimelist.js";
const AutoIncrement = Inc(mongoose);
const T_Schema = new Schema({
    name: { type: String, default: null },
    id: { type: Number, default: null },
});
const EpisodeDetails = new Schema({
    id: { type: Number, default: null },
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
    keywords: { type: [String], default: [] },
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
// TODO: 3849 requires update
// TODO: animes with ani_id: 102416
let urls = await getWatchLinks(79, 64);
console.log(urls);
mongoose.connection.on("open", async () => {
    let promises = [];
    let docs = AnimeModal.find();
    let count = await docs.count();
    console.log(count);
    // TODO: Update the episodes
    for await (const doc of docs) {
        let eps = await getEpisodesList(doc.as_id);
        let anime = await getAnimeByNameWithEpisodes(doc.name);
        let episodes = [];
        for (const ep of eps.data) {
            const ep2 = anime.episodeVideos.find((p) => p.episode === ep.episode_number);
            let urls = await getWatchLinks(doc.as_id, ep.episode_id);
            episodes.push({
                id: ep.episode_id,
                name: ep.episode_name,
                number: ep.episode_number,
                thumbnail: ep2?.images?.jpg?.maximum_image_url
                    ? ep2?.images?.jpg?.maximum_image_url
                    : ep2?.images?.webp?.maximum_image_url
                        ? ep2?.images?.webp?.maximum_image_url
                        : doc.coverUrl,
                urls: urls,
            });
        }
        doc.episodes = new Types.DocumentArray(episodes);
        await doc.save();
        console.log("Updated episodes: ", episodes.length);
    }
    // TODO: Updating the rest...
    /* for await (const doc of docs) {
      console.log("Getting anime[anime slayer]: " + doc.as_id);
      let anime = await getAnime(doc.as_id);
      if (!anime) {
        console.log("Could not find anime[anime slayer]: " + doc.as_id);
        continue;
      } else {
        console.log("got anime[anime slayer]: " + anime.anime_keywords);
      }
      let mal_data = null;
      let keywords = anime.anime_keywords;
      if (
        !keywords ||
        keywords.length <= 2 ||
        keywords === "," ||
        keywords === " ," ||
        keywords === ", "
      ) {
        mal_data = await getAnimeByName(doc.name);
      } else {
        for await (const keyword of keywords.split(",")) {
          if (
            !keyword ||
            keyword.length <= 1 ||
            keyword === "," ||
            keyword === " ," ||
            keyword === ", "
          )
            continue;
          const mal_data = await getAnimeByName(keyword);
          if (!mal_data || mal_data.mal_id == null) continue;
          else break;
        }
      }
      if (mal_data != null) {
        if (!mal_data || mal_data.mal_id == null) continue;
        console.log("Updating anime: " + mal_data.title);
        doc.description_en = mal_data.synopsis;
        doc.mal_id = mal_data.mal_id;
        doc.ani_id = null;
        doc.duration = mal_data?.duration?.toString();
        doc.source = mal_data.source;
        doc.score = mal_data.score;
        doc.scored_by = mal_data.scored_by;
        doc.trailer = mal_data?.trailer.url;
        doc.genres_en = new Types.DocumentArray(
          mal_data.genres?.map((re, ind) => ({
            id: re.mal_id,
            name: re.name,
          }))
        );
        doc.coverUrl = mal_data.images.jpg?.maximum_image_url
          ? mal_data.images.jpg?.maximum_image_url
          : mal_data.images.webp?.maximum_image_url;
        doc.bannerUr = mal_data.images.jpg?.maximum_image_url;
        doc.studios = new Types.DocumentArray(
          mal_data.studios?.map((e) => ({
            name: e.name,
            id: e.mal_id,
          }))
        );
  
        doc.keywords = keywords
          .split(",")
          .filter((keyword) => keyword.length > 0)
          .concat(
            mal_data?.title_synonyms?.filter(
              (item) => keywords.split(",").indexOf(item) < 0
            )
          );
        await doc.save();
      }
      //await UpdateAnime(doc);
    } */
});
/* async function UpdateAnime(doc) {
  let mal_data =
    doc.ani_id >= 1
      ? await getAnimeById(doc.ani_id)
      : await getAnimeByName(doc.name);
  if (!mal_data || mal_data.id == null) {
    console.log("Anime not found[Updating using animeslayer]: " + doc.name);
    let anime = await getAnime(doc.as_id);
    doc.source = anime?.more_info_result?.source;
    doc.trailer = anime?.more_info_result?.trailer_url;
    doc.score = anime?.more_info_result?.score;
    doc.score_by = anime?.more_info_result?.score_by;
    doc.duration = anime?.more_info_result?.duration;
    doc.coverUrl = anime.anime_cover_image_full_url
      ? anime.anime_cover_image_full_url
      : anime.anime_cover_image_url;
    doc.bannerUr = anime?.anime_banner_image_url
      ? anime.anime_banner_image_url
      : doc.coverUrl;
    doc.studios = anime?.more_info_result?.studios;
  } else {
    doc.description_en = mal_data.description;
    doc.mal_id = mal_data.idMal;
    doc.ani_id = mal_data.id;
    doc.duration = mal_data.duration.toString();
    doc.source = mal_data.source;
    doc.score = (mal_data.averageScore / 100) * 10;
    doc.trailer = mal_data.trailer;
    doc.genres_en = new Types.DocumentArray(
      mal_data.genres?.map((re, ind) => ({
        id: ind,
        name: re,
      }))
    );
    doc.coverUrl = mal_data.coverImage.large;
    doc.bannerUr = mal_data.bannerImage;
    doc.studios = new Types.DocumentArray(
      mal_data.studios?.map((e) => ({
        name: e.name,
        id: e.id,
      }))
    );
  }
  await doc.save();
}
 */
async function updateWithKeywords(doc) { }
