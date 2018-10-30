import { Router } from 'express'
import { Storage } from '@google-cloud/storage'

const bucketName = 'monkey-test'
const keyFilename = 'Monkey-Online-Upload-ee159ae2b686.json'
const storage = new Storage({
    keyFilename
})
const bucket = storage.bucket(bucketName)

const router = Router()

router.get('/list', (req, res) => {
    storage
        .bucket(bucketName)
        .getFiles()
        .then(file => {
            const [files] = file
            const filesName = files.map(file => file.name)
            console.log(filesName)
            res.send(filesName)
        })
        .catch(err => res.send(err))
})

// router.get('/watch', (req, res) => {
//     storage
//         .bucket(bucketName)
//         .getFiles()
//         .then(file => {
//             const [files] = file
//             const filesName = files.map(file => file.name)
//             console.log(filesName)
//             res.send(filesName)
//         })
//         .catch(err => res.send(err))
// })

export default router
