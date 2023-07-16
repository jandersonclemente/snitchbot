import { useState } from "react"
import { Status } from "./status"
import { Matches } from "./matches"
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'

const port = 8787

const frameVideo = async () => {
    const framerResponse = await fetch(`//localhost:${port}/framer`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    
    if (!framerResponse.ok) return false

    return await framerResponse.json()
}

const imageRecognition = async framesArray => {
    const predictionsText = []
    const objectsFound = []
 
    if (!framesArray) {
        return {
            predictionsText,
            objectsFound
        }
    }

    for (const frameUrl of framesArray) {
        const currentImage = new Image()
        currentImage.src = `http://localhost:3000/frames/${frameUrl}`

        await new Promise(resolve => {
            currentImage.onload = resolve
        })

        await cocoSsd.load()
        .then(model => {
            model.detect(currentImage)
            .then(predictions => {
                if (predictions.length) {
                    for(const currentPrediction of predictions) {
                        const predictionText = `At frame ${frameUrl}: ${currentPrediction.class} with ${(currentPrediction.score * 100).toFixed(2)}% of accuracy`
                        predictionsText.push(predictionText)
                        objectsFound.push(currentPrediction.class)
                    }
                }
            })
        })
    }

    return {
        predictionsText,
        objectsFound
    }
}

export const Content = () => {
    const [searchTerms, setSearchTerms] = useState('')
    const [searchTermsMatches, setSearchTermsMatches] = useState([])
    const [status, setStatus] = useState({
        type: undefined,
        text: ''
    })

    const clearStates = () => {
        setSearchTermsMatches([])
        setStatus({
            type: undefined,
            text: ''
        })
    }

    const matchSearchTerm = (searchTerms, objectsFound) => {
        searchTerms = searchTerms.split(',')
        const matches = []

        searchTerms.forEach(item => {
            item = item.toLowerCase().trim()

            objectsFound.forEach( objectFound => {
                if (objectFound.toLowerCase().trim() === item) {
                    matches.push(`${item}`)
                }
            })
        })

        return matches
    }

    const submitHandler = async event => {
        event.preventDefault()

        clearStates()

        setStatus({
            type: 'info',
            text: 'Begining framing process'
        })

        const framingResponse = await frameVideo()

        if (!framingResponse) {
            setStatus({
                type: 'error',
                text: 'There was an error framing the video'
            })

            return
        }

        setStatus({
            type: 'success',
            text: 'Video processed. Begining analysis' 
        })

        const {images} = framingResponse
        const predictionsResult = await imageRecognition(images)

        if (predictionsResult.predictionsText.length) {
            if (searchTerms) {
                const matches = matchSearchTerm(searchTerms, predictionsResult.objectsFound)
            
                if (matches.length) {
                    setSearchTermsMatches(matches)
                }
            }

            setStatus({
                type: "success",
                text: predictionsResult.predictionsText
            })
        } else {
            setStatus({
                type: "info",
                text: "no predictions were made"
            }) 
        }
        
    }

    return(
        <div>
            <section className="content">
                <form id="framerForm" onSubmit={event => submitHandler(event)}>
                    <div className="labelBox">
                        <div className="framerSearchTerms">
                            Search terms are optional. The app will return all the findings and, if search terms are provided, they will be highlighted if found.
                        </div>
                    </div>

                    <div className="inputBox">
                        <input
                            type = "text"
                            onChange = {(text => setSearchTerms(text.target.value))}
                            content = {searchTerms}
                            name = "framerSearchTerms"
                            id = "framerSearchTerms"
                            placeholder = "search terms comma separated"
                        />
                    </div>

                    <div className="submitBox">
                        <input type="submit" id="framerSubmit" value="analise video" />
                        <div className="folderInfo">
                            the video must be placed at the 'backend/ingest' folder
                        </div>
                    </div>

                    {searchTermsMatches.length > 0 && (
                        <Matches items = {searchTermsMatches} />
                    )}

                </form>
            </section>
            <section className= "status">
                {status.text && (
                    <Status message = {status} />
                )}
            </section>
        </div>
    )
}