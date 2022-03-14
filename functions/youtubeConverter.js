const youtubedl = require("youtube-dl-exec");
const request = require("request");

exports.handler = async function (event, context) {
  try {
    const queries = event.rawQuery;
    const queryParameters = parseQueryParameters(queries);

    if (!queryParameters.url) {
      throw new Error("bhai url to daal!");
    }
    const urlObj = new URL(queryParameters.url);
    if (urlObj.hostname === "youtube.com" || urlObj.hostname === "youtu.be") {
      const urlOfConvertedFile = await youtubeConversion({
        url: queryParameters.url,
        ext: queryParameters.ext || "mp4",
        format: queryParameters.format,
      });
      //   request(
      //     { url: urlOfConvertedFile, encoding: null },
      //     (err, resp, buffer) => {
      //       // Use the buffer
      //       console.log(buffer);
      //       return {
      //         statusCode: 200,

      //         body: JSON.stringify({ message: "Hello World", buffer: buffer }),
      //       };
      //       // buffer contains the image data
      //       // typeof buffer === 'object'
      //     }
      //   );
      return {
        statusCode: 200,

        body: JSON.stringify({
          message: "Hello World",
          url: urlOfConvertedFile,
        }),
      };
    } else {
      throw new Error("bhai youtube ka link daalna hai!");
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

async function youtubeConversion(data) {
  try {
    const response = await youtubedl(data.url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: data.url,
    });
    const formats = response.formats;
    const filteredFormats = formats.filter((item) => item.ext === data.ext);
    // && data.format === item.format.split(" ")[0]
    if (filteredFormats.length > 0) {
      return filteredFormats[0].url;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
}

function parseQueryParameters(queryStr) {
  try {
    const splittedStr = queryStr.split("&");
    const resultObj = {};
    splittedStr.forEach((item) => {
      const splittedItem = item.split("=");
      resultObj[splittedItem[0]] = decodeURIComponent(splittedItem[1]);
    });
    return resultObj;
  } catch (err) {
    throw err;
  }
}
