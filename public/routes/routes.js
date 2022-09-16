const express = require('express')
const router = express.Router()
const path = require('path')



router.get('/public/css', (req, res) => {
    res.sendFile('style.css', { root: path.join(__dirname, './css')})
})

router.get('/public/index.css', (req, res) => {
    res.sendFile('index.css',  { root: path.join(__dirname, './css')})
})

router.get('/public/quillcursor.js', (req, res) => {
    res.sendFile('quillcursor.js', { root: path.join(__dirname, './javascript' )})
})

router.get('/public/signup.css', (req, res) => {
    res.sendFile('signup.css', { root: path.join(__dirname, './css')})
})
router.get('/public/images/bg.jpg', (req, res) => {
    res.sendFile('bg.jpg', { root: path.join(__dirname, './css/images')})
})

router.get('/public/script.js', (req, res) => {
    res.sendFile('script.js', { root: path.join(__dirname, './javascript')})
})

router.get('/public/videos/edudocx1.mp4', (req, res) => {
    res.sendFile('edudocx1.mp4', { root: path.join(__dirname, './videos')})
})

router.get('/public/videos/edudocx2.mp4', (req, res) => {
    res.sendFile('edudocx-2.mp4', { root: path.join(__dirname, './videos')})
})

router.get('/public/videos/edudocx3.mp4', (req, res) => {
    res.sendFile('edudocx3.mp4', { root: path.join(__dirname, './videos')})
})

router.get('/public/login.css', (req, res) => {
    res.sendFile('login.css', { root: path.join(__dirname, './css')})
})

router.get('/public/notloggedin.css', (req, res) => {
    res.sendFile('notloggedin.css', { root: path.join(__dirname, './css')})
})

router.get('/public/loggedin.css', (req, res) => {
    res.sendFile('loggedin.css', { root: path.join(__dirname, './css')})
})

router.get('/apple-touch-icon.png', (req, res) => {
    res.sendFile('apple-touch-icon.png', { root: path.join(__dirname, './favicon')})
})

router.get('/favicon-32x32.png', (req, res) => {
    res.sendFile('favicon-32x32.png', { root: path.join(__dirname, './favicon')})
})

router.get('/favicon-16x16.png', (req, res) => {
    res.sendFile('favicon-16x16.png', { root: path.join(__dirname, './favicon')})
} )

router.get('/site.webmanifest', (req, res) => {
    res.sendFile('site.webmanifest', { root: path.join(__dirname, './favicon')})
})

router.get('/safari-pinned-tab.svg', (req, res) => {
    res.sendFile('safari-pinned-tab.svg', { root: path.join(__dirname, './favicon')})
})

router.get('/favicon.ico', (req, res) => {
    res.sendFile('favicon.ico', { root: path.join(__dirname, './favicon')})
})

router.get('/browserconfig.xml', (req, res) => {
    res.sendFile('browserconfig.xml', { root: path.join(__dirname, './favicon')})
})

router.get('/android-chrome-192x192.png', (req, res) => {
    res.sendFile('android-chrome-192x192.png', { root: path.join(__dirname, './favicon')})
})

router.get('/android-chrome-384x384.png', (req, res) => {
    res.sendFile('android-chrome-384x384.png', { root: path.join(__dirname, './favicon')})
})

router.get('/quillvideoresize.js', (req, res) => {
    res.sendFile('quillvideoresize.js', { root: path.join(__dirname, './javascript')})
})

module.exports = router