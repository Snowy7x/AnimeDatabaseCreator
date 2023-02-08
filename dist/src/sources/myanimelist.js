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
async function getAnimeByName(animeName) {
    return await Search(animeName).then((re) => re[0]);
}
async function getAnimeEpisodesByName(animeName) {
    let anime = await getAnimeByName(animeName);
    return client.getAnimeEpisodeVideos(anime.mal_id).then((re) => re.data);
}
export { Search, getAnimeByName, getAnimeEpisodesByName };
export default client;
