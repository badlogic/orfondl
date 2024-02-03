# orfondl

Download videos from ORF ON. This is a one-off, experimental project. It may or may not work. Currently, videos are limited to
720p max, as I can not figure out where to get higher resolution MPEG-DASH "representations". Generally, the selection of the
MPEG-DASH manifest file from all URLs within a video's HTML/JS content is poor.

Prerequisits:

- Install [nodejs 20+](https://nodejs.org/en)
- Install [ffmpeg](https://ffmpeg.org/download.html)

You must be able to run both from the command line, e.g. CMD.exe on Windows, any shell on Linux and macOS. This usually requires
modifying your `PATH` environment variable.

Once you have installed the above, run

```
npm install
```

You can then execute the program like this:

```
node index.js <video-url> <output-file.mp4>
```

E.g.

```
node index.js https://on.orf.at/video/14211223 output.mp4
```
