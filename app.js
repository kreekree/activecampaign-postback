require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/trackpixel/track', (req, res) => {
  const tid = req.query.tid
  const amt = req.query.amt
  const email = req.query.email
  const offer = req.query.offer

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

    // Replace these with actual tag ID fetch calls
    const tagIdConversion = 1306 // Fetch this from API
    const tagIdAmt = 1307 // Fetch this from API
    const tagIdOffer = 1308 // Fetch this from API

    const tagOptions = {
      method: 'POST',
      url: 'https://tasteoftheoldcountry.api-us1.com/api/3/contactTags',
      headers: {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactTag: {
          contact: contactId,
          tag: tagIdConversion,
        },
      }),
    }

    // Add the conversion tag
    request(tagOptions, function (error, response, body) {
      if (error) throw new Error(error)

      tagOptions.body = JSON.stringify({
        contactTag: {
          contact: contactId,
          tag: tagIdAmt,
        },
      })

      // Add the amt tag
      request(tagOptions, function (error, response, body) {
        if (error) throw new Error(error)
        console.log(body) // Add this line
        tagOptions.body = JSON.stringify({
          contactTag: {
            contact: contactId,
            tag: tagIdOffer,
          },
        })

        // Add the offer tag
        request(tagOptions, function (error, response, body) {
          if (error) throw new Error(error)
          res.status(200).send('Pixel tracking and tagging successful')
        })
      })
    })
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
