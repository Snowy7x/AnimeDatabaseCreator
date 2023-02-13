import {
  AnimeClient,
  AnimeEpisodeVideo,
  SearchOrder,
  SortOptions,
  Anime,
} from "@tutkli/jikan-ts";

const client = new AnimeClient();

async function Search(animeName: string) {
  return await client
    .getAnimeSearch({
      q: animeName,
      order_by: SearchOrder.title,
      sort: SortOptions.desc,
    })
    .then((re) => re.data);
}

let i = 0;

async function getAnimeByName(animeName: string) {
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

interface FullAnime extends Anime {
  episodeVideos: AnimeEpisodeVideo[];
}

async function getAnimeByNameWithEpisodes(
  animeName: string
): Promise<FullAnime> {
  let anime = await getAnimeByName(animeName);

  let episodeVideos = await client
    .getAnimeEpisodeVideos(anime.mal_id)
    .then((re) => re.data);
  await sleep(1000);

  return { episodeVideos, ...anime };
}

async function getEpisodesWithId(id: number): Promise<AnimeEpisodeVideo[]> {
  console.log("getEpisodesWithId");
  let episodeVideos = await client
    .getAnimeEpisodeVideos(id)
    .then((re) => re.data);
  await sleep(3000);

  return episodeVideos;
}

export {
  Search,
  getAnimeByName,
  getAnimeByNameWithEpisodes,
  getEpisodesWithId,
};
export default client;
