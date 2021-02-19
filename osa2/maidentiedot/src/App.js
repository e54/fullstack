import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountrySearch = (props) => {

  const SearchResults = () => {
    const matchingCountries = props.countries
      .filter(country => String(country.name)
        .toLowerCase()
        .includes(props.filter)
      )

    if (matchingCountries.length > 10) {
      return <div>Too many matches, specify another filter</div>
    } else if (matchingCountries.length > 1) {
      return multipleSearchResults(matchingCountries)
    } else if (matchingCountries.length === 1) {
      return countryInfo(matchingCountries[0])
    } else {
      return <div>No matches</div>
    }
  }

  const multipleSearchResults = (matchingCountries) => (
    matchingCountries.map(country =>
      <div key={country.name}>
        {country.name}
      </div>
    )
  )

  const countryInfo = (country) => (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language =>
          <li key={language.iso639_2}>
            {language.name}
          </li>
        )}
      </ul>
      <img src={country.flag} width={200}/>
    </div>
  )

  return (
    <div>find countries
      <input
        value={props.filter}
        onChange={props.handleSearchTextChange}
      />
      <SearchResults />
    </div>
  )
}

const App = () => {
  const [ filter, setFilter ] = useState('')
  const [ countries, setCountries ] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchTextChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
        <CountrySearch
          filter={filter}
          handleSearchTextChange={handleSearchTextChange}
          countries={countries}
        />
    </div>
  )
}

export default App;
