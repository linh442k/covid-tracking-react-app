import React from "react";
import "./CountriesList.css";
import CountryInfo from "../components/CountryInfo";
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
        newCountriesInfo.map((countryInfo, index) => (
          <CountryInfo
            key={
              countryInfo.countryInfo._id === null
                ? --missingId
                : countryInfo.countryInfo._id
            }
            index={index}
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

export default CountriesList;
