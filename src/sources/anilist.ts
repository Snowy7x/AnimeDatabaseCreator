import anilist, { AnimeEntry } from "anilist-node";
const Anilist = new anilist();

let i = 1;

async function getAnimeByName(animeName: string): Promise<AnimeEntry> {
  console.log(i);
  if (i >= 30) {
    console.log("Sleeping for 10 seconds");
    sleep(10000);
  }
  i++;
  try {
    return await Anilist.search("anime", animeName, 1, 1).then(
      async (re: any) => {
        return await Anilist.media.anime(re.media[0].id);
      }
    );
  } catch (err) {
    try {
      return await Anilist.search("anime", animeName, 1, 1).then(
        async (re: any) => {
          return await Anilist.media.anime(re.media[0].id);
        }
      );
    } catch (err) {
      return null;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { getAnimeByName };
