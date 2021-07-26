// eslint-disable-next-line
import React, { useEffect, useState, useMemo, useCallback } from "react";
import "font-awesome/css/font-awesome.min.css";
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
    setCountryInput(event.target.value);
  };

  const handleCountrySearch = (event) => {
    event.preventDefault();
    setCountrySearch(countryInput);
  };

  if (Array.isArray(countriesInfo) && countriesInfo.length === 0)
    return (
      <div className="App">
        Loading
        <i className="fa fa-spinner fa-spin"></i>
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
              placeholder="Search for countries"
            />
            <button type="button" onClick={handleCountrySearch}>
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </form>
        </div>
        <CountriesList
          countriesInfo={countriesInfo}
          filter={countrySearch.trim()}
        />
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
      {Array.isArray(newCountriesInfo) && newCountriesInfo.length !== 0 ? (
        newCountriesInfo.map((countryInfo) => (
          <CountryInfo
            key={
              countryInfo.countryInfo._id === null
                ? --missingId
                : countryInfo.countryInfo._id
            }
            countryFlag={countryInfo.countryInfo.flag}
            countryName={countryInfo.country}
            countryCases={countryInfo.cases}
            countryDeaths={countryInfo.deaths}
            countryRecovered={countryInfo.recovered}
          />
        ))
      ) : (
        <div className="CountryNotFound">Not Found</div>
      )}
    </div>
  );
});

const CountryInfo = React.memo(
  ({
    countryFlag,
    countryName,
    countryCases,
    countryDeaths,
    countryRecovered,
  }) => {
    console.log("Rendering: CountryInfo");
    return (
      <div className="CountryInfo">
        <div className="CountryFlag">
          <img src={countryFlag} alt={countryName + " Flag"} />
        </div>
        <div className="CountryName">{countryName}</div>
        <div className="CountryCases">{countryCases}</div>
        <div className="CountryDeaths">{countryDeaths}</div>
        <div className="CountryRecovered">{countryRecovered}</div>
      </div>
    );
  }
);

export default App;
