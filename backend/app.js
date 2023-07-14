const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())

const staticFilesPath = path.join(__dirname, 'frames')
app.use(express.static(staticFilesPath))

const routes = require('./routes')
const port = 8787

routes(app)

app.listen(port, () => {
    console.info('framer is running')
})