const xml2js = require("xml2js");
const fs = require("fs");
const { spawn } = require("child_process");

async function downloadAndAppendFile(url, dest) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to download: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const data = Buffer.from(buffer);
    fs.appendFileSync(dest, data);
  } catch (error) {
    console.error("Append failed: " + url, error);
    process.exit(-1);
  }
}

const downloadStream = async (
  baseUrl,
  templates,
  representation,
  timeline,
  file
) => {
  const initFile = templates.initialization.replace(
    "$RepresentationID$",
    representation.id
  );
  console.log("Downloading segment " + initFile);
  await downloadAndAppendFile(baseUrl + initFile, file);

  let time = 0;
  let representationId = representation.id;
  for (const segment of timeline) {
    const segmentFile = templates.media
      .replace("$RepresentationID$", representationId)
      .replace("$Time$", time.toString());
    console.log("Downloading segment " + segmentFile);
    await downloadAndAppendFile(baseUrl + segmentFile, file);
    time += parseInt(segment.d);
    if (segment.r) {
      for (let i = 0; i < segment.r; i++) {
        const segmentFile = templates.media
          .replace("$RepresentationID$", representationId)
          .replace("$Time$", time.toString());
        console.log("Downloading segment " + segmentFile);
        await downloadAndAppendFile(baseUrl + segmentFile, file);
        time += parseInt(segment.d);
      }
    }
  }
};

function extractUrls(text) {
  const regex = /"(https?:\/\/[^"\s]+?manifest\.mpd)"/g;
  let urls = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

(async () => {
  if (process.argv.length < 3) {
    console.log("orfondl <video-url>");
    process.exit(-1);
  }
  const url = process.argv[2];
  let output = process.argv[3];

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Could not fetch video page");
    process.exit(-1);
  }
  const html = await response.text();
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : undefined;
  if (!output) output = title + ".mp4";
  if (!output) {
    console.error("Please specify an output file name.");
    process.exit(-1);
  }
  const urls = extractUrls(html).filter((url) => true);
  if (urls.length == 0) {
    console.error("Could not find video manifest.mpd");
    process.exit(-1);
  }

  let manifestUrl = undefined;
  for (const url of urls) {
    if (!manifestUrl) {
      manifestUrl = url;
      continue;
    }
    if (url.includes("QXB.mp4")) {
      manifestUrl = url;
      break;
    }
  }

  const xmlResponse = await fetch(manifestUrl);
  if (!xmlResponse.ok) {
    console.error("Could not fetch manifest.mpd");
    process.exit(-1);
  }
  const xml = await xmlResponse.text();
  const manifest = await xml2js.parseStringPromise(xml);

  const videoSet = manifest.MPD.Period[0].AdaptationSet[0];
  const videoRepresentations = videoSet.Representation;
  let videoRepresentation = undefined;
  for (const rep of videoRepresentations) {
    if (!videoRepresentation) {
      videoRepresentation = rep.$;
      continue;
    }
    if (parseInt(rep.$.width) > parseInt(videoRepresentation.width)) {
      videoRepresentation = rep.$;
    }
  }
  const videoTemplates = videoSet.SegmentTemplate[0].$;
  const videoTimeline = videoSet.SegmentTemplate[0].SegmentTimeline[0].S.map(
    (s) => s.$
  );

  const audioSet = manifest.MPD.Period[0].AdaptationSet[1];
  const audioRepresentations = audioSet.Representation;
  let audioRepresentation = undefined;
  for (const rep of audioRepresentations) {
    if (!audioRepresentation) {
      audioRepresentation = rep.$;
      continue;
    }
    if (
      parseInt(rep.$.audioSamplingRate) >
      parseInt(audioRepresentation.audioSamplingRate)
    ) {
      audioRepresentation = rep.$;
    }
  }
  const audioTemplates = audioSet.SegmentTemplate[0].$;
  const audioTimeline = audioSet.SegmentTemplate[0].SegmentTimeline[0].S.map(
    (s) => s.$
  );

  console.log(`Saving to '${output}'`);
  console.log(videoRepresentation);
  console.log(audioRepresentation);

  const baseUrl = manifestUrl.replaceAll("/manifest.mpd", "/");
  await Promise.all([
    downloadStream(
      baseUrl,
      videoTemplates,
      videoRepresentation,
      videoTimeline,
      "__video.mp4"
    ),
    downloadStream(
      baseUrl,
      audioTemplates,
      audioRepresentation,
      audioTimeline,
      "__audio.mp4"
    ),
  ]);
  console.log("Merging streams");
  const ffmpeg = spawn("ffmpeg", [
    "-loglevel",
    "error",
    "-y",
    "-i",
    "__video.mp4",
    "-i",
    "__audio.mp4",
    "-c",
    "copy",
    output,
  ]);

  ffmpeg.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpeg.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpeg.on("close", (code) => {
    fs.rmSync("__video.mp4");
    fs.rmSync("__audio.mp4");
    console.log(`Done`);
    process.exit(code);
  });
})();
