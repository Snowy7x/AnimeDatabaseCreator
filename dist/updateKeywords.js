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
import { Schema, Types, model } from "mongoose";
import Inc from "mongoose-sequence";
import mongoose from "./src/db/Database.js";
import { getEpisodesList } from "./src/sources/animeslayer.js";
import { fetchZoroAnimeFromName } from "./src/sources/zoro.js";
const AutoIncrement = Inc(mongoose);
const T_Schema = new Schema({
    name: { type: String, default: null },
    id: { type: Number, default: null },
});
const EpisodeDetails = new Schema({
    id: { type: Number, default: null },
    enId: { type: Number, default: null },
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
// TODO: 3849 requires update
// TODO: animes with ani_id: 102416
mongoose.connection.on("open", async () => {
    let docs = AnimeModal.find({
        mal_id: { $ne: null },
        status: { $ne: "Not Yet Aired" },
        as_id: { $gte: 1184 },
    });
    let count = await docs.clone().count();
    console.log(count);
    // TODO: Update the episodes
    for await (const doc of (await docs).reverse()) {
        const promises = [
            new Promise((resolve) => {
                getEpisodesList(doc.as_id).then((episodes) => resolve(episodes?.data));
            }),
            new Promise((resolve) => {
                fetchZoroAnimeFromName(doc.name).then((anime) => resolve(anime?.episodes));
            }),
        ];
        await Promise.all(promises).then(async (re) => {
            const ar = re[0];
            const en = re[1];
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
                    name: enEp?.episodeName ? enEp?.episodeName : arEp?.episode_name,
                    number: enEp?.epNum ? enEp?.epNum : arEp?.episode_number,
                    thumbnailUrl: doc?.episodes[i]?.thumbnailUrl,
                    urls: doc?.episodes[i]?.urls,
                };
                episodesFinal.push(ep);
            }
            doc.episodes = new Types.DocumentArray(episodesFinal);
            console.log("Updated episodes");
            await doc.save();
        });
    }
});
