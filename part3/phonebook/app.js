const express = require('express')
const morgan = require('morgan')
const app = express()
const config = require('./utils/config')
const Contact = require('./models/contact')

morgan.token('body', (req) => {
  return req.method === 'POST' 
  ? JSON.stringify(req.body)
  : ''
})

app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
  
app.get('/api/persons', (request, response, next) => {
  Contact
    .find({})
    .then(contacts => {
      response.json(contacts)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact
    .findById(request.params.id)
    .then(contact => {
      if (!contact) {
        return response.status(404).end()
      }
      
      response.json(contact)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact 
    .findByIdAndDelete(request.params.id)
    .then(_ => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, phoneNumber } = request.body

  Contact
    .exists({ name })
    .then(contactExists => {
      if (contactExists) {
        const error = new Error(`Contact ${ name } already exists in your phonebook`)
        error.code = 'CONTACT_EXISTS'
        
        throw error
      }

      const contact = new Contact({
        name, 
        phoneNumber
      })
      
      return contact.save()
    })
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

app.patch('/api/persons/:id', (request, response, next) => {
  const { phoneNumber } = request.body

  Contact.findById(request.params.id)
    .then(contact => {
      if (!contact) {
        return null 
      }

      contact.phoneNumber = phoneNumber

      return contact.save()
    })
    .then(updatedContact => {
      if (!updatedContact) {
        return response.status(404).end()
      }

      response.json(updatedContact)
    })
    .catch(error => next(error))

})

app.get('/info', (request, response, next) => {
  const now = new Date()

  Contact
    .countDocuments({})
    .then(total => {
      response.send(`
        <p>Phonebook has info for ${ total } people</p>
        <p>${ now }</p>
      `)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.code === 'CONTACT_EXISTS') {
    return response.status(409).json({
      error: error.message
    })
  }
  
  if (error.name === 'CastError') {
	  return response.status(400).json({
      error: 'malformatted id' 
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ 
      error: error.message 
    })  
  }

  console.error(error)

  return response.status(500).json({
    error: 'Internal server error'
   })
}

app.use(errorHandler)

const PORT = config.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`)
})