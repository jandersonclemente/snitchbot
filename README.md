# snitchbot #

This is a very simples prove of concept. It consists in a React frontend that is running the Tensorflow's *coco-ssd* model and a NodeJS backend that ingest a mp4 video and slice it into frames to deliver to the frontend app.

## Requirements ##
Besides the dependencies into the three *package.json* files (frontend, backend and starter), you'll need to have ffmpeg running in your machine.
Make sure to have the enviroment variables set properly (you can use the command *ffmpeg* in your terminal to check it).

You might need to set the path to the ffmpeg binaries manually in the *backend/frame.js* file. Check the fluent-ffmpeg module doc for further information:
https://www.npmjs.com/package/fluent-ffmpeg

## How to use it ##
 - Run *npm i* at the root folder
 - Run *npm run setup*

 The frontend should open at the port 3000 and the backend at port 8787 (this one can be changed in the *settings* file).

 Copy your video into the *backend/ingest* folder and fill the field videoFile in the *backend/settings.js* file.
 At the frontend page you can simply click the *ANALISE VIDEO* button to check what Tensorflow will find in the extracted frames or provide some search terms,
 separated by comma. If any of the search terms are found, they will be highlighted.

 ## Improvements ##
 There is alot of room to improvement, like Dockerize the package, provide a upload area to the video in the frontend and etc.
 This is only a prove of concept, fell free to use and change it as you wish.

 Thanks!
