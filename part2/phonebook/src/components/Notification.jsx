function Notification({ payload }) {

  if (!payload) return null

  const { message, status } = payload

  return <p className={`message ${status}`}>{ message }</p>
}

export default Notification