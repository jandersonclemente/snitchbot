const framer = require('./framer')

const routes = async (app) => {
    app.get('/framer', async (req, res) => {
        const framerResult = await framer()
        
        if (!framerResult) {
            return res.status(400).json({
                status: 'error'
            })
        }

        return res.status(200).json({
            images: framerResult
        })
    })
}

module.exports = routes