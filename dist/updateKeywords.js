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
import { Schema, Types, model, } from "mongoose";
import Inc from "mongoose-sequence";
import mongoose from "./src/db/Database.js";
import { getAnime, getEpisodesList } from "./src/sources/animeslayer.js";
import { fetchZoroAnimeFromName } from "./src/sources/zoro.js";
import { malGetAnimeWithId, malGetMangaWithId, } from "./src/sources/myanimelist.js";
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
MangaSchema.plugin(AutoIncrement, { inc_field: "id" });
//AnimeSchema.plugin(AutoIncrement, { inc_field: "id" });
const AnimeModal = model("Anime", AnimeSchema);
const MangaModal = model("Manga", MangaSchema);
// TODO: 3849 requires update
// TODO: animes with ani_id: 102416
mongoose.connection.on("open", async () => {
    // Updating the animes
    const docs_ = await AnimeModal.find({
        justInfo: null,
        mal_id: { $ne: null },
    });
    for await (const doc_ of docs_) {
        await UpdateFull(doc_);
    }
});
async function UpdateFull(doc) {
    await getAnime(doc.as_id).then(async (anime) => {
        const ji = anime.just_info == "Yes" || anime.just_info == "YES";
        doc.justInfo = ji;
        if (!ji) {
            let anime = await malGetAnimeWithId(doc.mal_id);
            doc.name = anime.title;
            // Update Relations
            if (anime.relations && anime.relations.length > 0) {
                let final_relations = [];
                for await (const relation of anime.relations) {
                    if (relation.relation == "Adaptation" ||
                        relation.relation == "adaptation") {
                        const source = await malGetMangaWithId(relation.entry[0].mal_id);
                        // TODO: Add manga to manga list
                        const manga = new MangaModal({
                            mal_id: source.mal_id,
                            name: source.title,
                            description_ar: "",
                            description_en: source.synopsis,
                            coverUrl: source.images.jpg?.maximum_image_url
                                ? source.images.jpg.maximum_image_url
                                : source.images.webp?.maximum_image_url
                                    ? source.images.webp.maximum_image_url
                                    : null,
                            bannerUrl: source.images.jpg?.maximum_image_url
                                ? source.images.jpg.maximum_image_url
                                : source.images.webp?.maximum_image_url
                                    ? source.images.webp.maximum_image_url
                                    : null,
                            source: null,
                            score: source.score,
                            scored_by: source.scored_by,
                            year: source.published.from,
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
                        // Add the manga
                        doc.adaptation = {
                            id: 0,
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
                    }
                    else {
                        for (const entry of relation.entry) {
                            const rel = (await AnimeModal.findOne({ mal_id: entry.mal_id })) ?? null;
                            final_relations.push({
                                id: rel?.id,
                                mal_id: rel?.mal_id,
                                ani_id: rel?.ani_id,
                                as_id: rel?.as_id,
                                coverUrl: rel?.coverUrl,
                                rating: rel?.coverUrl,
                                type: rel?.type,
                            });
                        }
                    }
                }
                doc.relations = final_relations;
            }
            // Update Episodes:
            const promises = [
                new Promise((resolve) => {
                    getEpisodesList(doc.as_id).then((episodes) => resolve(episodes?.data));
                }),
                new Promise((resolve) => {
                    fetchZoroAnimeFromName(anime.title).then((anime) => resolve(anime?.episodes));
                }),
            ];
            await Promise.all(promises)
                .then(async (re) => {
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
            })
                .catch((err) => {
                console.log(`Error saving episodes for [${doc.id}] because:`, err.message);
            });
        }
        await doc.save();
    });
}
