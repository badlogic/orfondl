# Containerize orfondl

## Build container image

change into `container` directory of `orfondl` project.

`podman build -t docker.io/toughiq/orfondl:latest .`

## Run orfondl container with output directory

`podman run -it --rm -v /my/download/directory:/download:z docker.io/toughiq/orfondl:latest https://on.orf.at/video/14212146`

where `/my/download/directory` is the path where you want your resulting videos stored and `https://on.orf.at/video/14212146` is the URL of the desired video.

## Running multiple downloads at once

Currently there is no mechanism to provide a list of download URLs. But you can invoke multiple download instances at by `daemonizing` each container at runtime with `-d` and removing the `-it` parameter.

Eg:

`podman run -d --rm -v /my/download/directory:/download:z docker.io/toughiq/orfondl:latest https://on.orf.at/video/14202586/soko-donau-zuendstoff`

`podman run -d --rm -v /my/download/directory:/download:z docker.io/toughiq/orfondl:latest https://on.orf.at/video/14211599/soko-donau-schachmatt`

You can check the progress via:
`podman ps` which shows you something like this, if the containers are still running:
```
CONTAINER ID  IMAGE                             COMMAND               CREATED         STATUS         PORTS       NAMES
914f097ef51b  docker.io/toughiq/orfondl:latest  https://on.orf.at...  10 minutes ago  Up 10 minutes              crazy_mcnulty
6562da38cf33  docker.io/toughiq/orfondl:latest  https://on.orf.at...  9 minutes ago   Up 9 minutes               stupefied_moser
a83b809bd5c1  docker.io/toughiq/orfondl:latest  https://on.orf.at...  8 minutes ago   Up 8 minutes               adoring_haibt
e87867a1db54  docker.io/toughiq/orfondl:latest  https://on.orf.at...  7 minutes ago   Up 7 minutes               heuristic_spence
```


## Inner workings

Since `output.mp4` is currently hardcoded as output filename this container does a file move and rename at the end, so the resulting video is stored with the video ID as filename within the `download` directory.

