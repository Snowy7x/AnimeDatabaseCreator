import getVideos from "./helpers/malVideos";
import { getInfoFromName } from "mal-scraper";
export async function getAnimeByName(animeName) {
    return await getInfoFromName(animeName);
}
export async function getVideosByName(animeName) {
    return await getVideos(animeName);
}
