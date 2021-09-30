import React from "react";
import "./style.css";
const WorldInfo = React.memo(({ totalCases, totalDeaths, totalRecovered }) => {
  console.log("Rendering: WorldInfo");
  return (
    <div className="WorldInfo">
      <div className="TotalCases">
        {totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
      <div className="WorldInfoBottom">
        <div className="TotalDeathWrapper">
          <div className="TotalDeaths">
            {totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="TotalDeathsText">DEATHS</div>
        </div>
        <div className="TotalRecoveredWrapper">
          <div className="TotalRecovered">
            {totalRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="TotalRecoveredText">RECOVERIES</div>
        </div>
      </div>
    </div>
  );
});
export default WorldInfo;
