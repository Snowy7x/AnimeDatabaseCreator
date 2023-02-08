import anilist, { AnimeEntry } from "anilist-node";
const Anilist = new anilist();

async function getAnimeByName(animeName: string): Promise<AnimeEntry> {
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

export { getAnimeByName };
