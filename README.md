# orfondl

Download videos from ORF ON. This is a one-off, experimental project. It may or may not work. Currently, videos are limited to
720p max, as I can not figure out where to get higher resolution MPEG-DASH "representations". Generally, the selection of the
MPEG-DASH manifest file from all URLs within a video's HTML/JS content is poor.

## Installation

- Install [nodejs 20+](https://nodejs.org/en)
- Install [ffmpeg](https://ffmpeg.org/download.html)

You must be able to run both from the command line, e.g. CMD.exe on Windows, any shell on Linux and macOS. This usually requires
modifying your `PATH` environment variable.

Once you have installed the above, run

```
npm install
```

## Downloading a single video

```
node index.js <video-url>
```

E.g.

```
node index.js https://on.orf.at/video/14211223
```

This will download the video and save it as `<video-title.mp4>`, where the title is taken from the video metadata.

You can also specify the output file name manually:

```
node index.js https://on.orf.at/video/14211223 output.mp4
```

## Downloading a list of videos

Instead of specifying a single video url, you can specify a text file, where each line is a video url.

E.g. `videos.txt`:

```
https://on.orf.at/video/14210856
https://on.orf.at/video/14209917/gute-nacht-oesterreich
https://on.orf.at/video/14208867/gute-nacht-oesterreich
```

```
node index.js videos.txt
```

This will download all 3 videos specified in the `videos.txt` file.
