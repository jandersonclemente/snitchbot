import { useState } from "react"
import { Status } from "./status"
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
    //let textResponse = ''

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
                console.log(predictions)
            })
        })
    }
}

export const Content = () => {
    const [searchTerms, setSearchTerms] = useState('')
    const [status, setStatus] = useState({
        type: undefined,
        text: ''
    })

    const submitHandler = async event => {
        event.preventDefault()

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
        await imageRecognition(images)
        
    }

    return(
        <div>
            <section className="content">
                <form id="framerForm" onSubmit={event => submitHandler(event)}>
                    
                    <input
                        type = "text"
                        onChange = {(text => setSearchTerms(text.target.value))}
                        content = {searchTerms}
                        name = "framerSearchTerms"
                        id = "framerSearchTerms"
                        placeholder = "search terms separated by comma"
                    />

                    <input type="submit"  content="start analisys" />
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