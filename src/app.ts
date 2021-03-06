'use strict'

import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import index from './routes/index'
import morgan from 'morgan'
import path from 'path'
import dotenv from 'dotenv'
import { Storage } from '@google-cloud/storage'

const app = express()
dotenv.config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, '/../public')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../index.htm'))
})

app.get('/video', async function(req, res) {
    const bucketName = process.env.BUCKET
    const keyFilename = process.env.KEY
    const storage = new Storage({
        keyFilename
    })

    const bucket = storage.bucket(bucketName)
    const blob = bucket.file('1 Hour Relaxing Ocean Waves.mp4')
    const range = req.headers.range as string
    const metadata = await blob.getMetadata()
    const fileSize = metadata[0].size
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = end - start + 1
        const file = blob.createReadStream({ start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        }
        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        }
        res.writeHead(200, head)
        blob.createReadStream().pipe(res)
    }
})

app.use('/api', index)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
