// eslint-disable-next-line
import React, { useEffect, useState, useMemo, useCallback } from "react";
import "font-awesome/css/font-awesome.min.css";
import WorldInfo from "../components/WorldInfo";
import VietnamInfo from "../components/VietnamInfo";
import CountriesList from "./CountriesList";
import axios from "axios";
import "./App.css";
import LoadingScreen from "../components/LoadingScreen";

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

  // information about number of region
  const searchPlaceholder = useMemo(() => {
    return "Search " + countriesInfo.length.toString() + " regions...";
  }, [countriesInfo]);

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

  const showResult = useMemo(
    () => (countrySearch === "" ? "" : "Show Result(s) for " + countrySearch),
    [countrySearch]
  );

  if (Array.isArray(countriesInfo) && countriesInfo.length === 0)
    return <LoadingScreen />;
  else
    return (
      <div className="App">
        <div className="AppContainer">
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
              <button type="button" onClick={handleCountrySearch}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
              <input
                type="text"
                value={countryInput}
                onChange={handleCountryInput}
                placeholder={searchPlaceholder}
              />
            </form>
          </div>
          {showResult === "" ? (
            <div></div>
          ) : (
            <div className="ShowResult">{showResult}</div>
          )}
          <CountriesList
            countriesInfo={countriesInfo}
            filter={countrySearch.trim()}
          />
        </div>
      </div>
    );
};

export default App;
