import getVideos from "./helpers/malVideos";
import { AnimeDataModel, getInfoFromName } from "mal-scraper";

export async function getAnimeByName(
  animeName: string
): Promise<AnimeDataModel> {
  return await getInfoFromName(animeName);
}

export async function getVideosByName(
  animeName: string
): Promise<{ thumbnail: string; episodeNumber: string }> {
  return await getVideos(animeName);
}
