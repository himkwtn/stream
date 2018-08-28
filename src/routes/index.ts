'use strict'

import express from 'express'
import testRouter from './test'
const router = express.Router()

router.get('/', (req, res) => {
    res.send('hello world')
})

router.use('/test', testRouter)
export default router
