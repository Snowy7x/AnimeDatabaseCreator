import { SearchOrder, SortOptions, JikanClient, } from "@tutkli/jikan-ts";
import axios from "axios";
const client = new JikanClient();
async function Search(animeName) {
    return await client.anime
        .getAnimeSearch({
        q: animeName,
        order_by: SearchOrder.title,
        sort: SortOptions.desc,
    })
        .then((re) => re.data);
}
let i = 0;
async function getAnimeByName(animeName) {
    i = 0;
    if (i > 2) {
        console.log("Sleeping for 1.5 secs...");
        await sleep(1500);
        i = 0;
    }
    return await Search(animeName).then((re) => re[0]);
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function getAnimeByNameWithEpisodes(animeName) {
    let anime = await getAnimeByName(animeName);
    let episodeVideos = await client.anime
        .getAnimeEpisodeVideos(anime.mal_id)
        .then((re) => re.data);
    await sleep(1000);
    return { episodeVideos, ...anime };
}
async function getEpisodesWithId(id, page = 1, tries = 0) {
    console.log("getEpisodesWithId: " + id);
    /* let episodeVideos = await client
      .getAnimeEpisodeVideos(id)
      .then((re) => re.data); */
    if (tries >= 5)
        return [];
    let data = await axios
        .get(`https://api.jikan.moe/v4/anime/${id}/videos/episodes?page=${page}`)
        .then(async (res) => {
        let eps = res.data.data;
        let hasNext = res.data?.pagination?.has_next_page;
        if (hasNext) {
            let count = res.data?.pagination?.last_visible_page - page;
            for (let i = page; i <= count; i++) {
                let d = await axios
                    .get(`https://api.jikan.moe/v4/anime/${id}/videos/episodes?page=${i}`)
                    .then((res) => {
                    return res.data.data;
                })
                    .catch(async (err) => {
                    await sleep(3000);
                    console.log("Error: ", err.message);
                    return await getEpisodesWithId(id, i, tries++);
                });
                eps.push(d);
            }
        }
        return eps;
    })
        .catch(async (err) => {
        await sleep(3000);
        console.log("Error: ", err.message);
        return await getEpisodesWithId(id, page, tries++);
    });
    await sleep(1000);
    return data;
}
export async function malGetAnimeWithId(mal_id) {
    let anime = null;
    let i = 0;
    while (anime === null && i < 5) {
        anime = client.anime
            .getAnimeById(mal_id)
            .then((res) => res.data)
            .catch(async () => {
            await sleep(1000);
            return null;
        });
    }
    return anime;
}
export async function malGetMangaWithId(mal_id) {
    let manga = null;
    let i = 0;
    while (manga === null && i < 5) {
        manga = client.manga
            .getMangaById(mal_id)
            .then((res) => res.data)
            .catch(() => null);
        sleep(2000);
    }
    return manga;
}
export { Search, getAnimeByName, getAnimeByNameWithEpisodes, getEpisodesWithId, };
export default client;
