import anilist from "anilist-node";
const Anilist = new anilist();
let i = 1;
async function getAnimeByName(animeName) {
    console.log("Getting anime by name: " + animeName);
    if (i >= 25) {
        console.log("Sleeping for 30 seconds");
        await sleep(30000);
        i = 0;
    }
    i++;
    try {
        return await Anilist.search("anime", animeName, 1, 1).then(async (re) => {
            return await Anilist.media.anime(re.media[0].id);
        });
    }
    catch (err) {
        try {
            return await Anilist.search("anime", animeName, 1, 1).then(async (re) => {
                return await Anilist.media.anime(re.media[0].id);
            });
        }
        catch (err) {
            return null;
        }
    }
}
async function getAnimeById(id) {
    console.log("Getting anime by id: " + id);
    if (i >= 25) {
        console.log("Sleeping for 30 seconds");
        await sleep(30000);
        i = 0;
    }
    i += 0.5;
    return await Anilist.media.anime(id);
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export { getAnimeByName, getAnimeById };
