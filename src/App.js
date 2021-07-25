// eslint-disable-next-line
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  console.log("Rendering: App");
  const [countriesInfo, setCountriesInfo] = useState([]);

  // fetch in a 3-minute interval
  useEffect(() => {
    fetchData();
    const timerId = setInterval(() => fetchData(), 3 * 60 * 1000);
    return () => clearInterval(timerId);
  }, []);

  // fetch countries info from API using axios
  const fetchData = async () => {
    await axios("https://disease.sh/v3/covid-19/countries")
      .then((response) => setCountriesInfo(response.data))
      .catch((error) => console.log("Error fetching data: ", error));
  };

  // information about Vietnam
  const vietnamInfo = useMemo(() => {
    for (var i = 0; i < countriesInfo.length; i++)
      if (countriesInfo[i].country === "Vietnam") return countriesInfo[i];
  }, [countriesInfo]);

  // information about total cases, deaths, recovered
  const totalCases = useMemo(
    () => countriesInfo.reduce((total, { cases }) => total + cases, 0),
    [countriesInfo]
  );
  const totalDeaths = useMemo(
    () => countriesInfo.reduce((total, { deaths }) => total + deaths, 0),
    [countriesInfo]
  );
  const totalRecovered = useMemo(
    () => countriesInfo.reduce((total, { recovered }) => total + recovered, 0),
    [countriesInfo]
  );

  // search country
  const [countryInput, setCountryInput] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const handleCountryInput = (event) => {
    setCountryInput(event.target.value.trim());
  };

  const handleCountrySearch = (event) => {
    event.preventDefault();
    setCountrySearch(countryInput);
  };

  if (Array.isArray(countriesInfo) && countriesInfo.length === 0)
    return (
      <div className="App">
        <h1>Loading</h1>
      </div>
    );
  else
    return (
      <div className="App">
        <WorldInfo
          totalCases={totalCases}
          totalDeaths={totalDeaths}
          totalRecovered={totalRecovered}
        />
        <VietnamInfo
          cases={vietnamInfo.cases}
          deaths={vietnamInfo.deaths}
          recovered={vietnamInfo.recovered}
          flag={vietnamInfo.countryInfo.flag}
        />
        <div className="SearchBar">
          <form onSubmit={handleCountrySearch}>
            <input
              type="text"
              value={countryInput}
              onChange={handleCountryInput}
            />
            <button type="button" onClick={handleCountrySearch}>
              Search
            </button>
          </form>
        </div>
        <CountriesList countriesInfo={countriesInfo} filter={countrySearch} />
      </div>
    );
};

const WorldInfo = React.memo(({ totalCases, totalDeaths, totalRecovered }) => {
  console.log("Rendering: WorldInfo");
  return (
    <div className="WorldInfo">
      <div className="TotalCases">{totalCases}</div>
      <div className="TotalDeaths">{totalDeaths}</div>
      <div className="TotalRecovered">{totalRecovered}</div>
    </div>
  );
});

// if props is vietnamInfo (object, then we should not use React.memo)
const VietnamInfo = React.memo(({ cases, deaths, recovered, flag }) => {
  console.log("Rendering: VietnamInfo");
  return (
    <div className="VietnamInfo">
      <div className="VietnamFlag">
        <img src={flag} alt="Vietnam Flag" />
      </div>
      <div className="VietnamCases">{cases}</div>
      <div className="VietnamDeaths">{deaths}</div>
      <div className="VietnamRecovered">{recovered}</div>
    </div>
  );
});

const CountriesList = React.memo(({ countriesInfo, filter }) => {
  let missingId = 0;

  console.log("Rendering: CountriesList");
  let newCountriesInfo = countriesInfo;
  if (filter === "") {
    newCountriesInfo = [...countriesInfo]
      .sort(function (countries1, countries2) {
        return countries2.cases - countries1.cases;
        // return countries2.country - countries1.country;
      })
      .slice(0, 10);
  } else {
    newCountriesInfo = countriesInfo.filter((countryInfo) => {
      return (
        (countryInfo.country === null ? "" : countryInfo.country)
          .toLowerCase()
          .includes(filter.toLowerCase()) ||
        (countryInfo.countryInfo.iso2 === null
          ? ""
          : countryInfo.countryInfo.iso2
        )
          .toLowerCase()
          .includes(filter.toLowerCase()) ||
        (countryInfo.countryInfo.iso3 === null
          ? ""
          : countryInfo.countryInfo.iso3
        )
          .toLowerCase()
          .includes(filter.toLowerCase())
      );
    });
  }
  return (
    <div className="CountriesList">
      {newCountriesInfo.map((countryInfo) => (
        <CountryInfo
          key={
            countryInfo.countryInfo._id === null
              ? --missingId
              : countryInfo.countryInfo._id
          }
          info={countryInfo}
        />
      ))}
    </div>
  );
});

const CountryInfo = ({ info }) => {
  console.log("Rendering: CountryInfo");
  return (
    <div className="CountryInfo">
      <div className="CountryFlag">
        <img src={info.countryInfo.flag} alt={info.country + " Flag"} />
      </div>
      <div className="CountryName">{info.country}</div>
      <div className="CountryCases">{info.cases}</div>
      <div className="CountryDeaths">{info.deaths}</div>
      <div className="CountryRecovered">{info.recovered}</div>
      <div className="CountryUpdate">{}</div>
    </div>
  );
};

export default App;
