const str = "mrg+e9GTkHaj8WXD7Cz3+Wbc1E4xYrvHLqW1vRF8xSo2B4K7Y5B7wcjHaoL1haW8Ynp3gYuGBRWFY/XaoEzVRcM/g8pJtaAT3FgwZh+KajpmkenxL0V/ghBXTwctGtEQFUO/UAJVGx2QClCE6gKSTQ==";
const str2 = "4+mwbwVfA5wLr7a4GBQvzMy1/jO9fRQ/lKJXNS4vbW/FqNL3j0vtOPd5pQx2UxrJ/8UF0Xr/v/dxkse3tjvEg/1uLKKZM8CALrQrGtw0pQqZ+UiyBJqVXe9tlbFSkV9XQRkIC6qjY66uzkzk6wauPw==";
let buf = Buffer.from(str, "base64");
let buf2 = Buffer.from(str2, "base64");
console.log(buf.toString("utf-8"));
console.log("---------------------------------------------");
console.log(buf2.toString("utf-8"));
