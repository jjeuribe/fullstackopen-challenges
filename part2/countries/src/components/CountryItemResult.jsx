import { useState } from 'react'
import CountryDetail from './CountryDetail'

function CountryItemResult({ country }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <p>
        <span>{country.name.common}</span>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "Show"}
        </button>
      </p>
      {showDetails && (
        <div>
          <CountryDetail country={country}/>
        </div>
      )}
    </>
  )
}

export default CountryItemResult