import { AnimeClient, SearchOrder, SortOptions } from "@tutkli/jikan-ts";
const client = new AnimeClient();
async function Search(animeName) {
    return await client
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
    // @ts-ignore
    anime.episodeVideos = await client
        .getAnimeEpisodeVideos(anime.mal_id)
        .then((re) => re.data);
    return anime;
}
export { Search, getAnimeByName, getAnimeByNameWithEpisodes };
export default client;
