function CountryWeather({ capital, temperature, wind, icon}) {
    return (
      <>
        <h2>Weather in {capital}</h2>
        <p>Temperature {temperature} Celcius</p>
        <p>Wind {wind} m/s</p>
        <div>
          <img src={icon} alt={`Weather of`} />
        </div>
      </>
    )
}

export default CountryWeather