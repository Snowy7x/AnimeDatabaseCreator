import { getAnimeById } from "./dist/src/sources/anilist.js";

getAnimeById(20).then((l) => console.log(l.meanScore));
