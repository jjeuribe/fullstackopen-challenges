import { useState, useEffect } from 'react'
import CountryResults from './components/CountryResults'
import countriesService from './services/countries'

function App() {
  const [ countries, setCountries ] = useState(null)
  const [ countryFilter, setCountryFilter ] = useState('')

  useEffect(() => {
    countriesService
      .getAll()
      .then(countries => setCountries(countries))
      .catch(err => alert('An error ocurred. Try again!'))
  }, [])

  if (!countries) {
    return <p>Loading...</p>
  }

  const normalizedFilter = countryFilter.trim().toLowerCase()
  const filteredCountries = normalizedFilter.length === 0 ? [] :
    countries.filter(country => country.name.common.toLowerCase().includes(normalizedFilter))
  
  return (
    <>
      <p>find countries <input type="text" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}/></p>
      {normalizedFilter.length > 0 && (
        <CountryResults countries={filteredCountries}/>
      )}
    </>
  )
}

export default App
