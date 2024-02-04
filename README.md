# orfondl

Download videos from [ORF ON](https://on.orf.at/). Currently only supports downloading 720p. This is an experimental project which may or may not work for you.

## Installation

Install [FFMPEG](https://ffmpeg.org/download.html).

- Windows: https://ffmpeg.org/download.html#build-windows
- macOS: via brew `brew install ffmpeg`
- Linux: use your package manager, e.g. `apt install ffmpeg`

The path to the FFMPEG executable must be in your `PATH` environment variable, so `orfondl` can find and execute it.

Next, download the latest `orfondl` executable for your operating system from the [release page](https://github.com/badlogic/orfondl/releases). Also make sure its path is in your `PATH` environment variable.

> **Note** on macOS and Linux run `chmod a+x <executable>` before launching the executable
> **Note** on macOS you will see the infamous "You want to run software on your computer? Not without a silly dance!" dialog after the first run. Open `Privacy and Security`, scroll down and press "Allow" or whatever the current flavor of this idiocy is. The run the executable again.

## Downloading a video

1. Go to the video in your browser on ORF ON and copy the URL from the address bar.
2. Run `orfondl <video-url>` on the command line

Alternatively, you can specify an output file name, e.g. `orfondl <video-url> output.mp4`. To download multiple videos at once, create a text file and put
each video's URL on a separate line. E.g. `videos.txt`:

```
https://on.orf.at/video/14211311/zib-700-vom-29012024
https://on.orf.at/video/14211757/zib-700-vom-01022024
https://on.orf.at/video/14211478/zib-700-vom-30012024
```

Run `orfondl videos.txt` to download all videos specified in the file `videos.txt`.

## Building from source

You'll need [Go](https://go.dev/) installed. Then:

```
git clone https://github.com/badlogic/orfondl
cd orfondl
go build -o orfondl
```
