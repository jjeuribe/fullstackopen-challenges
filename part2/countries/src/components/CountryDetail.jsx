import { useState, useEffect } from 'react'
import CountryWeather from '../components/CountryWeather'
import weatherService from '../services/weather'

function CountryDetail({ country }) {
  const name = country.name.common
  const capital = country.capital[0]
  const area = country.area
  const languages = Object.values(country.languages)
  const flagIcon = country.flags.png
  const [ weather, setWeather ] = useState(null)

  useEffect(() => {
    weatherService
      .getCurrent(capital)
      .then(weather => setWeather(weather))
      .catch(err => alert('An error ocurred. Try again!'))
  }, [])

  return (
    <>
      <h1>{name}</h1>
      <p>Capital: {capital}</p>
      <p>Area: {area}</p>
      <h2>Languages</h2>
      <ul>
        {languages.map(language => 
          <li key={language}>
            {language}
          </li>)}
      </ul>
      <div>
        <img src={flagIcon} alt={`Flag of ${ name }`} />
      </div>
      {weather ? (<CountryWeather
                      capital={capital}
                      temperature={weather.temperature}
                      wind={weather.wind}
                      icon={weather.iconUrl}
        />) : (
          <p>Retrieving weather conditions for {capital}...</p>
        )
      }
    </>
  )
}

export default CountryDetail