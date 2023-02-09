import { getAnimeById, getAnimeByName } from "./dist/src/sources/anilist.js";

getAnimeByName("Mou Hitotsu no Mirai wo").then((l) => console.log(l));
