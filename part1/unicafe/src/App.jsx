import { useState } from 'react'
import './App.css'

function Button({ text, onClick }) {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

function StatisticsLine({ text, value }) {
  return(
    <>
      <td>{text}</td> 
      <td>{value}</td>
    </>
  )
}

function Statistics({ goodFeedback, neutralFeedback, badFeedback }) {
  const goodScore = 1
  const neutralScore = 0
  const badScore = -1
  const totalFeedback = goodFeedback + neutralFeedback + badFeedback
  const averageFeedback = (totalFeedback === 0) ? 0 : 
    ((goodFeedback * goodScore) + (neutralFeedback * neutralScore) + (badFeedback * badScore))  / totalFeedback
  const positiveFeedback = (totalFeedback === 0) ? 0 :
    (goodFeedback / totalFeedback) * 100
  
    if (totalFeedback === 0) {
      return (
        <>
          <h2>Statistics</h2>
          <p>No feedback given</p>
        </>
      )
    } 
    
    return (
    <>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <tr><StatisticsLine text="good" value={goodFeedback}/></tr>
          <tr><StatisticsLine text="neutral" value={neutralFeedback}/></tr>
          <tr><StatisticsLine text="bad" value={badFeedback}/></tr>
          <tr><StatisticsLine text="all" value={totalFeedback}/></tr>
          <tr><StatisticsLine text="average" value={averageFeedback}/></tr>
          <tr><StatisticsLine text="positive" value={`${positiveFeedback} %`}/></tr>
        </tbody>
      </table>
    </>
  )
}

function App() {
  const [ goodFeedback, setGoodFeedback ] = useState(0)
  const [ neutralFeedback, setNeutralFeedback ] = useState(0)
  const [ badFeedback, setBadFeedback ] = useState(0)

  const handleGoodFeedback = () => {
    setGoodFeedback(goodFeedback + 1)
  }
  
  const handleNeutralFeedback = () => {
    setNeutralFeedback(neutralFeedback + 1)
  }

  const handleBadFeedback = () => {
    setBadFeedback(badFeedback + 1)
  }
  
  return (
    <>
      <h1>Give Feedback</h1>
      <div>
        <Button onClick={handleGoodFeedback} text="good"/>
        <Button onClick={handleNeutralFeedback} text="neutral"/>
        <Button onClick={handleBadFeedback} text="bad"/>
      </div>
      <Statistics
        goodFeedback={goodFeedback} 
        neutralFeedback={neutralFeedback}
        badFeedback={badFeedback}
      />
    </>
  )
}

export default App
