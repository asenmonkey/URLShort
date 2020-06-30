const express = require('express')
const mongoose = require('mongoose')
const ShortURL = require('./models/shortURL')
const app = express()

mongoose.connect('mongodb://localhost/shortURL', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/shortURL', async (req, res) => {
    await ShortURL.create({ url: req.body.url })
    res.redirect('/')
})

app.get('/:shortURL', async (req, res) => {
    const shortURL = await ShortURL.findOne({ short: req.params.shortURL })
    if(shortURL == null) return res.sendStatus(404)

    shortURL.clicks++
    shortURL.save()

    res.redirect(shortURL.url)
})

app.listen(process.env.PORT || 5000)