import express from 'express'   
const app = express ()

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'


app.get('/', (req, res) => {
    res.send('Welcome!')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})