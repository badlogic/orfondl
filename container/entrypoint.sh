#!/bin/bash

# change into orfondl directory
cd /orfondl

# parse URL for video ID ... later used as download filename
ID=$(echo $1 | sed 's:.*/::')

# fetch stream and save to orfondl directory by default ... currently $ID isnt used since output.mp4 is hardcoded
node index.js $1 $ID.mp4

# move downloaded output.mp4 to download directory and assign video ID filename
mv -f /orfondl/output.mp4 /download/$ID.mp4

