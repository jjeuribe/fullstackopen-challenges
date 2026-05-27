function ContactForm({ name, phoneNumber, onNameChange, onPhoneNumberChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <div>name: <input value={name} onChange={onNameChange}/></div>
      <div>number: <input value={phoneNumber} onChange={onPhoneNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default ContactForm