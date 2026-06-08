import { useState, useEffect } from 'react'
import SearchContact from './components/SearchContact'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'
import Notification from './components/Notification'
import phonebookService from './services/phonebook'

function App() {
  const [ contacts, setContacts ] = useState([])
  const [ contactName, setContactName ] = useState('')
  const [ contactPhoneNumber, setContactPhoneNumber ] = useState('')
  const [ nameFilter, setNameFilter ] = useState('')
  const [ notification, setNotification ] = useState(null)

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(nameFilter.toLowerCase()))
  const resetContactForm = () => {
    setContactName('')
    setContactPhoneNumber('')
  }
  const notifySuccess = (message) => {
    setNotification({ message, status: 'success' })
    dismissNotification()
  }
  const notifyError = (message) => {
    setNotification({ message, status: 'error' })
    dismissNotification()
  }
  const dismissNotification = (delay = 5000) =>  {
    setTimeout(_ => {
      setNotification(null)
    }, delay)
  }

  const createContact = (name, phoneNumber) => {
    const newContact = { name, phoneNumber }

    phonebookService
      .create(newContact)
      .then(contact => {
        setContacts([ ...contacts, contact ])
        notifySuccess(`Added ${ contact.name }`)
      })
      .catch(err => notifyError(`${ err.response.data.error }`))
  }

  const updateContactPhoneNumber = (contact, phoneNumber) => {
    const shouldReplace = window.confirm(`${contact.name} is already added to phonebook, replace the old number with a new one?`)

    if (!shouldReplace) return
              
    phonebookService
      .update(contact.id, { phoneNumber })
      .then(updatedContact => setContacts(contacts.map(c => c.id === contact.id ? updatedContact : c)))
      .catch(err => notifyError(`Information of ${ contact.name } has already been removed from server`))
  }

  const handleAddNewContact = (e) => {
    e.preventDefault()

    const newName = contactName.trim()
    const newPhoneNumber = contactPhoneNumber.trim()
    
    if (!newName || !newPhoneNumber) return

    const existingContact = contacts.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingContact) {
      updateContactPhoneNumber(existingContact, newPhoneNumber)
    } else {
      createContact(newName, newPhoneNumber)
    }

    resetContactForm()
  }

  const handleRemoveContact = (id, name) => {
    phonebookService
      .remove(id)
      .then(_ => setContacts(contacts.filter(c => c.id !== id)))
      .catch(err => notifyError(`Information of ${ name } has already been removed from server`))
  }

  useEffect(() => {
    phonebookService
      .getAll()
      .then(contacts => setContacts(contacts))
  }, [])

  return (
    <div>
      <Notification payload={notification}/>
      <h2>Phonebook</h2>
        <SearchContact
          criteria={nameFilter} 
          onChange={e => setNameFilter(e.target.value)}/>
      <h2>Add a new</h2>
        <ContactForm 
          name={contactName} 
          phoneNumber={contactPhoneNumber}
          onNameChange={e => setContactName(e.target.value)}
          onPhoneNumberChange={e => setContactPhoneNumber(e.target.value)}
          onSubmit={handleAddNewContact}/>
      <h2>Numbers</h2>
        <ContactList contacts={filteredContacts} onRemove={handleRemoveContact}/>
    </div>
  )
}

export default App
