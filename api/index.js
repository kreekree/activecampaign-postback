require('dotenv').config()
const express = require('express')
const request = require('request')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.get('/api/trackpixel/track', (req, res) => {
  const email = req.query.email
  const offerTagId = req.query.offer

  const contactOptions = {
    method: 'GET',
    url: `https://tasteoftheoldcountry.api-us1.com/api/3/contacts?email=${email}`,
    headers: {
      'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
      'Content-Type': 'application/json',
    },
  }

  request(contactOptions, (error, response, body) => {
    if (error) throw new Error(error)

    const contactId = JSON.parse(body).contacts[0].id

    const tagOptionsConversion = {
      method: 'POST',
      url: 'https://tasteoftheoldcountry.api-us1.com/api/3/contactTags',
      headers: {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactTag: {
          contact: contactId,
          tag: 1306,
        },
      }),
    }

    const tagOptionsOffer = {
      method: 'POST',
      url: 'https://tasteoftheoldcountry.api-us1.com/api/3/contactTags',
      headers: {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactTag: {
          contact: contactId,
          tag: offerTagId,
        },
      }),
    }

    // Add the conversion tag
    request(tagOptionsConversion, function (error, response, body) {
      if (error) throw new Error(error)

      // Add the offer tag
      request(tagOptionsOffer, function (error, response, body) {
        if (error) throw new Error(error)
        res.status(200).send('Pixel tracking and tagging successful')
      })
    })
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
