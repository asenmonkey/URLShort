const express = require('express')
const mongoose = require('mongoose')
const ShortURL = require('./models/shortURL')
const app = express()

//Connect to Mongo
mongoose.connect('mongodb://localhost/shortURL', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./views'))

//Load Home Page to Create New Short URLS
app.get('/', (req, res) => {
    res.render('index')
})

// Handles Request For Creating New Short URLS
app.post('/shortURL', async (req, res) => {
    await ShortURL.create({ url: req.body.url })
    res.redirect('/')
})

// Handles Traffic To URLS
app.get('/:shortURL', async (req, res) => {
    //Request URL from Mongo
    const shortURL = await ShortURL.findOne({ short: req.params.shortURL })

    //Checks If URL Acctualy Exists
    if(shortURL == null) return res.sendStatus(404)

    //Add 1 Click the Count of Clicks for this URL
    shortURL.clicks++
    shortURL.save()

    //Redirect Them to There request Full URL
    res.redirect(shortURL.url)
})

app.listen(process.env.PORT || 5000)