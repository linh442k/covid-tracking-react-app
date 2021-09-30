import React from "react";
import "./CountryInfo.css";
const CountryInfo = React.memo(
  ({
    index,
    countryFlag,
    countryName,
    countryCases,
    countryDeaths,
    countryRecovered,
  }) => {
    console.log("Rendering: CountryInfo");
    return (
      <div className="CountryInfo">
        <div className="CountryIndex">{index + 1}</div>
        <div className="CountryFlag">
          <img src={countryFlag} alt={countryName + " Flag"} />
        </div>
        <div className="CountryName">{countryName}</div>
        <div className="CountryCovid">
          <div className="CountryCases">
            {countryCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="CountryWrapper">
            <div className="CountryDeaths">
              {countryDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
            <div className="CountryRecovered">
              {countryRecovered
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CountryInfo;
