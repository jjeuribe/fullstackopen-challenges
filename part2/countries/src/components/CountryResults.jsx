import CountryDetail from './CountryDetail'
import CountryItemResult from './CountryItemResult'

function CountryResults({ countries }) {

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <>
        {countries.map(country => <CountryItemResult country={country}/>)}
      </>
    )
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]}/>
  }

  return <p>No matches</p>
}

export default CountryResults