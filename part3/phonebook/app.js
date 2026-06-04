const express = require('express')
const morgan = require('morgan')
const app = express()

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', (req) => {
  return req.method === 'POST' 
  ? JSON.stringify(req.body)
  : ''
})

app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const generateContactId = () => Math.random().toString(36).substring(2, 11)
const contactExists = (name) => {
  const normalizedName = name.trim().toLowerCase()
  return phonebook.some(contact => contact.name.toLowerCase() === normalizedName)
}
const validateNewContact = (name, number) => {
  if (!name) {
    return { error: 'Contact name is missing' }
  }

  if (!number) {
     return { error: 'Phone number is missing' }
  }

  return { error: null }
}
  
app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const contactId = request.params.id
  const contact = phonebook.find(c => c.id === contactId)

  if (!contact) {
    return response.status(404).end()
  }

  response.json(contact)
})

app.delete('/api/persons/:id', (request, response) => {
  const contactId = request.params.id
  phonebook = phonebook.filter(c => c.id !== contactId)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body
  const contactValidation = validateNewContact(name, number)

  if (contactValidation.error) {
    return response.status(400).json({
      error: contactValidation.error
    })
  }

  if (contactExists(name)) {
    return response.status(400).json({
      error: `Contact ${ name } already exists in your phonebook`
    })
  }

  const contact = {
    id: generateContactId(),
    name, 
    number
  }

  phonebook = [ ...phonebook, contact ]

  response.send(contact)
})

app.get('/info', (request, response) => {
  const now = new Date()
  const phonebookCount = phonebook.length

  response.send(`
    <p>Phonebook has info for ${ phonebookCount } people</p>
    <p>${ now }</p>
  `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`)
})