import * as mal from "./myanimelist";
async function getAnimeById(id) {
    // TODO: Check if in the database
    //let as_data = await animeSlayer.getAnime(id);
    let mal_data = await mal.getAnimeByName("Naruto");
    console.log(mal_data);
}
async function getAnimeByName(name) {
    // TODO: Check if in the database
}
export { getAnimeById };
