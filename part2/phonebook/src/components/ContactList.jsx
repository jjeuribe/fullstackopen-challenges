function ContactList({ contacts, onRemove }) {
  return(
    <ul>
      {contacts.map(({ id, name, phoneNumber }) => 
        <li key={id}>{name} {phoneNumber} <span><button onClick={() => onRemove(id, name)}>delete</button></span></li>
      )}
    </ul>
    )
}

export default ContactList