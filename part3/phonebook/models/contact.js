const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'the contact name is required'],
    minLength: 3
  },
  phoneNumber: {
    type: String,
    required: [true, 'a phone number is required'],
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${ props.value } is not a valid phone number!`
    }
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)