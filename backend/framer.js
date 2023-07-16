const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')

const settings = require('./settings')

function deleteDirectoryContents(directoryPath) {
    const files = fs.readdirSync(directoryPath)
  
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const isDirectory = fs.lstatSync(filePath).isDirectory();
  
    if (isDirectory) {
        deleteDirectoryContents(filePath);
        fs.rmdirSync(filePath);
    } else {
        fs.unlinkSync(filePath);
      }
    }
}

function getDirectoryContents(directoryPath) {
    return fs.readdirSync(directoryPath)
}


const framer = async () => {
    const fps = settings.fps
    const video = settings.videoFile

    const videoPath = `${__dirname}/ingest/${video}`
    const framesDirectory = `${__dirname}/../frontend/public/frames`

    deleteDirectoryContents(framesDirectory)
    
    return new Promise( (resolve, reject) => {
        ffmpeg(videoPath)
            .outputOptions('-vf', `fps=${fps}`)
            .output(path.join(framesDirectory, 'frame-%d.png'))
            .on('end', (info, errors) => {
                resolve(getDirectoryContents(framesDirectory))
            })
            .on('error', e => {
                console.error('Extraction error: ', e)
                reject(false)
            })
            .run()
        })
}

module.exports = framer