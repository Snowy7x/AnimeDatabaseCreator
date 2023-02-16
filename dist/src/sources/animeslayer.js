import axios from "axios";
const published_url = "https://anslayer.com/anime/public/animes/get-published-animes";
const details_url = "https://anslayer.com/anime/public/anime/get-anime-details";
const headers = {
    "Client-Id": "android-app2",
    "Client-Secret": "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd",
};
/**
 * @param {"latest_episodes" | "custom_list" | "anime_list" | "currently_airing" | "latest_updated_episode" | "latest_updated_episode_new" | "top_anime" | "top_currently_airing" | "top_tv" | "top_movie" | "featured" | "filter" | "favorites" | "watching" | "plan_to_watch" | "watched" | "dropped" | "on_hold" | "watched_history" | "schedule" | "last_added_tv" | "last_added_movie" | "top_anime_mal" | "top_currently_airing_mal" | "top_tv_mal" | "top_movie_mal" | "anime_characters" | "top_upcoming" | "top_upcoming_catalog"} list_type
 * @param {number} limit
 * @param {number} offset
 * @param searchParams
 * @returns {Promise}
 */
async function getAnimeList(list_type, limit = 10, offset = 0, searchParams = null) {
    return await axios({
        method: "GET",
        url: published_url,
        headers: headers,
        params: {
            json: JSON.stringify({
                list_type: list_type,
                _limit: limit,
                _offset: offset,
                ...searchParams,
            }),
        },
    })
        .then((res) => {
        res.data = res.data.response.data;
        return res;
    })
        .catch((err) => err);
}
/**
 *
 * @param {number} animeId
 * @returns {Promise}
 */
async function getAnime(animeId) {
    return await axios({
        method: "GET",
        url: details_url,
        headers: headers,
        params: {
            anime_id: animeId,
            fetch_episodes: "Yes",
            more_info: "Yes",
        },
    })
        .then((res) => {
        res.data = res.data.response;
        return res.data;
    })
        .catch((err) => {
        console.log(err.message);
        return null;
    });
}
export async function getEpisode(animeId, episodeId) {
    return await axios
        .post("https://anslayer.com/anime/public/episodes/get-episodes-new", new URLSearchParams({
        inf: '{"a": "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==", "b": "102.185.179.127"}',
        json: `{"anime_id":${animeId},"episode_id":"${episodeId}"}`,
    }), {
        headers: {
            "Client-Id": "android-app2",
            "Client-Secret": "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd",
            Accept: "application/json, application/*+json",
            Host: "anslayer.com",
            "User-Agent": "okhttp/3.12.12",
        },
    })
        .then(function (response) {
        return {
            code: 200,
            data: response.data.response.data[0],
        };
    })
        .catch(function (error) {
        console.log("animesayer.js [113] Error:", error.message);
        return {
            code: 400,
            data: error.message,
        };
    });
}
export async function getEpisodesList(id) {
    return await axios
        .post("https://anslayer.com/anime/public/episodes/get-episodes-new", new URLSearchParams({
        inf: "",
        json: JSON.stringify({ more_info: "No", anime_id: id }),
    }), {
        headers: {
            "Client-Id": "android-app2",
            "Client-Secret": "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd",
            Accept: "application/json, application/*+json",
            Connection: "Keep-Alive",
            "User-Agent": "okhttp/3.12.12",
        },
    })
        .then(function (response) {
        return {
            code: 200,
            data: response.data.response.data,
        };
    })
        .catch(function (error) {
        console.log("animesayer.js [146] Error:", error.message);
        return {
            code: 400,
            data: error.message,
        };
    });
}
export async function getWatchLinks(animeId, episodeId) {
    console.log(animeId, episodeId);
    let episode = await getEpisode(animeId, episodeId);
    if (episode.code !== 200) {
        return [];
    }
    let servers = [];
    const urls = episode.data.episode_urls;
    if (!urls || urls.length === 0)
        return [];
    const normal_servers = await axios
        .post("https://anslayer.com/la/public/api/fw", new URLSearchParams({
        n: urls[1].episode_url.replace("https://anslayer.com/la/public/api/f2?n=", ""),
        inf: '{"a": "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==", "b": "102.185.179.127"}',
    }), {
        headers: {
            "User-Agent": "okhttp/3.12.12",
            Host: "anslayer.com",
        },
    })
        .then((re) => re.data);
    servers = normal_servers;
    if (servers.length <= 0) {
        const url_ = new URL(urls[0].episode_url);
        const params_ = url_.searchParams;
        const q = new URLSearchParams({
            f: params_.get("f"),
            e: params_.get("e"),
            inf: '{"a": "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==", "b": "102.185.179.127"}',
        });
        const og_urls = [
            "https://anslayer.com/anime/public/v-qs.php?" + q.toString(),
        ];
        /* .post(
            "https://anslayer.com/anime/public/v-qs.php",
            new URLSearchParams({
              f: params_.get("f"),
              e: params_.get("e"),
              inf: '{"a": "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==", "b": "102.185.179.127"}',
            }),
            {
              headers: {
                "User-Agent": "okhttp/3.12.12",
                Host: "anslayer.com",
              },
            }
          )
          .then((re) => {
            let decrypted = RNCryptor.Decrypt(
              re.data,
              "android-app9>E>VBa=X%;[5BX~=Q~K"
            );
            let js = JSON.parse(decrypted.toString());
            for (let i in js) {
              i =
                "http://www.snowyanime.com:3000/v2/ar/proxy?url=" +
                encodeURIComponent(js[i].file);
              /* let link = js[i].file;
              js[i].label = link.includes("h.mp4")
                ? "1080p"
                : link.includes("m.mp4")
                ? "720p"
                : link.includes("s.mp4")
                ? "480p"
                : "av";
              js[i].file =
                "http://191.101.2.27:3030/v2/ar/proxy?url=" +
                encodeURIComponent(js[i].file); */
        /*}
            return js;
          }); */
        servers = og_urls;
    }
    return servers;
}
export { getAnimeList, getAnime };
