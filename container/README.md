# Containerize orfondl

## Build container image

change into `container` directory of `orfondl` project.

`podman build -t orfondl:latest .`

## Run ordondl container with output directory

`podman run -it --rm -v /my/download/directory:/download:z orfondl:latest https://on.orf.at/video/14212146`
where `/my/download/directory` is the path where you want your resulting videos stored and `https://on.orf.at/video/14212146` is the URL of the desired video.

