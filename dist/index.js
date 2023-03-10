import axios from "axios";
import { getAnime, getAnimeList, getEpisodesList, } from "./src/sources/animeslayer.js";
const details_url = "https://anslayer.com/anime/public/anime/get-anime-details";
import mongoose from "./src/db/Database.js";
import { Schema, Types, model } from "mongoose";
import Inc from "mongoose-sequence";
import { getAnimeByNameWithEpisodes, malGetMangaWithId, } from "./src/sources/myanimelist.js";
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
const ScheduleAnimeSchema = new Schema({
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
    genres_ar: [T_Schema],
    genres_en: [T_Schema],
    nextEpisode: { type: Number, default: 1 },
});
const ScheduleSchema = new Schema({
    Saturday: [ScheduleAnimeSchema],
    Sunday: [ScheduleAnimeSchema],
    Monday: [ScheduleAnimeSchema],
    Tuesday: [ScheduleAnimeSchema],
    Wednesday: [ScheduleAnimeSchema],
    Thursday: [ScheduleAnimeSchema],
    Friday: [ScheduleAnimeSchema],
});
const ScheduleModal = mongoose.model("Schedule", ScheduleSchema);
async function UpdateSchedule() {
    console.log("Updating Schedule");
    const ans_schedule = await axios
        .get("https://anslayer.com/anime/public/animes/get-published-animes", {
        params: {
            json: '{"list_type":"schedule"}',
        },
        headers: {
            "Client-Id": "android-app2",
            "Client-Secret": "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd",
            Accept: "application/json, application/*+json",
            Connection: "Keep-Alive",
            "User-Agent": "okhttp/3.12.12",
        },
    })
        .then((response) => response.data.response.data);
    let schedule;
    const res = await ScheduleModal.find();
    if (!res || res.length === 0) {
        schedule = new ScheduleModal();
    }
    else {
        schedule = res[0];
    }
    for (const day in ans_schedule) {
        console.log("Updating day: " + day);
        let ans_animes = ans_schedule[day];
        let animes = [];
        for (const an of ans_animes) {
            const animeDoc = await AnimeModal.findOne({ as_id: an.anime_id });
            let anime = animeDoc.toJSON();
            if (anime.episodes.length > 0) {
                anime.nextEpisode =
                    parseInt(anime.episodes[anime.episodes.length - 1].number) + 1;
            }
            else {
                anime.nextEpisode = 1;
            }
            delete anime.episodes;
            delete anime.recommended;
            delete anime.relations;
            delete anime.studios;
            animes.push(anime);
        }
        schedule[day] = animes;
    }
    await schedule.save();
}
const AnimeModal = model("Anime", AnimeSchema);
const MangaModal = model("Manga", MangaSchema);
const LatestEpisodeModal = model("LatestEpisode", LatestEpisodeSchema);
const topAnimeModal = model("topAnime", topAnimeSchema);
// TODO: 3849 requires update
// TODO: animes with ani_id: 102416
mongoose.connection.on("open", async () => {
    updateLatestEpisodes();
    UpdateSchedule();
    setInterval(() => {
        updateTopAnime();
        UpdateSchedule();
    }, 1000 * 60 * 60 * 24);
    setInterval(() => {
        updateLatestEpisodes();
    }, 1000 * 60 * 30);
});
async function updateLatestEpisodes() {
    console.log("Update latest episodes");
    //  TODO: Update the latest episodes
    const latestEpisodes = await getAnimeList("latest_episodes", 100, 0).then((r) => r.data);
    for await (let episode of latestEpisodes) {
        const anime = await AnimeModal.findOne({ as_id: episode.anime_id });
        if ((await LatestEpisodeModal.find({
            id: anime.id,
            epId: episode?.latest_episode_id,
        })).length > 0)
            continue;
        let zoroAnime = await fetchZoroAnimeFromName(anime.name).then((an) => Array.isArray(an?.episodes) ? an?.episodes[an?.episodes?.length - 1] : {});
        console.log("Episode:", anime.name);
        const latestEpisode = new LatestEpisodeModal({
            id: anime.id,
            mal_id: anime.mal_id,
            ani_id: anime.ani_id,
            epId: episode?.latest_episode_id,
            epIdEn: zoroAnime?.episodeId,
            epNumber: episode.latest_episode_name
                .replace("???????????? : ", "")
                .replace(" - ??????", ""),
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
        await UpdateFull(anime);
        const animeDoc = await AnimeModal.findOne({ id: anime.id });
        if (animeDoc) {
            if (animeDoc.episodes.find((ep) => ep.number ==
                episode.latest_episode_name
                    .replace("???????????? : ", "")
                    .replace(" - ??????", ""))) {
                console.log("Updated-");
            }
            else {
                animeDoc.episodes.push({
                    id: latestEpisode.epId,
                    enId: latestEpisode.epIdEn,
                    number: latestEpisode.epNumber,
                    thumbnailUrl: null,
                    urls: [],
                });
                await animeDoc.save().then((e) => {
                    console.log("Updated--");
                });
            }
        }
        else {
            animeDoc.episodes.push({
                id: latestEpisode.epId,
                enId: latestEpisode.epIdEn,
                number: latestEpisode.epNumber,
                thumbnailUrl: null,
                urls: [],
            });
            await animeDoc.save().then((e) => {
                console.log("Updated---");
            });
        }
    }
}
async function updateTopAnime() {
    console.log("Updating top animes");
    // TODO: Update the top animes
    const topAnimes = await getAnimeList("top_currently_airing_mal", 100, 0).then((r) => r.data);
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
        }
        else {
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
async function UpdateFull(doc) {
    console.log("Updating:", doc.id);
    await getAnime(doc.as_id)
        .then(async (anime) => {
        if (!anime)
            return console.log("Got issues with the anime");
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
                    if (relation.relation == "Adaptation" ||
                        relation.relation == "adaptation") {
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
                    }
                    else {
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
            }
            else {
                console.log("No Relations found for this anime");
            }
            // Update Episodes:
            const promises = [
                new Promise((resolve) => {
                    getEpisodesList(doc.as_id).then((episodes) => resolve(episodes?.data));
                }),
                new Promise((resolve) => {
                    fetchZoroAnimeFromName(anime.title).then((an) => resolve(an?.episodes));
                }),
            ];
            await Promise.all(promises)
                .then(async (re) => {
                const ar = Array.isArray(re[0]) ? re[0] : [];
                const en = Array.isArray(re[1]) ? re[1] : [];
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
                        thumbnailUrl: anime.episodeVideos.find((x) => x.episode.replace("Episode ", "") == num)?.images?.jpg.image_url,
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
        return doc;
    })
        .catch((err) => console.log(err.message));
}
