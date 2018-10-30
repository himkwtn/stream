'use strict'

import express from 'express'
import testRouter from './test'
import gcsRouter from './gcs'
const router = express.Router()

router.get('/', (req, res) => {
    res.send('hello world')
})

router.use('/test', testRouter)
router.use('/gcs', gcsRouter)

export default router
