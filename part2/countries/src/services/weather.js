import axios from 'axios'

const apiKey = import.meta.env.WEATHER_APIKEY
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getCurrent = (capital) => {
  return axios
    .get(`${ baseUrl }?q=${ capital }&appid=${ apiKey }&units=metric`)
    .then(({ data }) => ({
      temperature: data.main.temp, 
      wind: data.wind.speed,
      iconUrl: `https://openweathermap.org/img/wn/${ data.weather[0].icon }@2x.png`
    }))
}

export default { getCurrent }

