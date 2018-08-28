'use strict'

import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import index from './routes/index'
import morgan from 'morgan'
const app = express()

//view engine setup
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/', index)
//catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err['status'] = 404
    next(err)
})

//error handlers

//development error handler
//will print stacktrace
if (process.env.NODE_ENV === 'development') {
    app.use((err: Error, req, res, next) => {
        res.status(err['status'] || 500)
        res.render('error', {
            title: 'error',
            message: err.message,
            error: err
        })
    })
}

//production error handler
// no stacktrace leaked to user
app.use((err: Error, req, res, next) => {
    res.status(err['status'] || 500)
    res.render('error', {
        title: 'error',
        message: err.message,
        error: {}
    })
})

export default app
