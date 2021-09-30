import React from "react";
import "./VietnamInfo.css";
// if props is vietnamInfo (object, then we should not use React.memo)
const VietnamInfo = React.memo(({ cases, deaths, recovered, flag }) => {
  console.log("Rendering: VietnamInfo");
  return (
    <div className="VietnamInfo">
      <div className="PinItem">
        <i className="fa fa-map-marker" aria-hidden="true"></i>
      </div>
      <div className="VietnamFlag">
        <img src={flag} alt="Vietnam Flag" />
      </div>
      <div className="Vietnam">Viet Nam</div>
      <div className="VietnamCovid">
        <div className="VietnamCases">
          {cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
        <div className="VietnamWrapper">
          <div className="VietnamDeaths">
            {deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="VietnamRecovered">
            {recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
      </div>
    </div>
  );
});
export default VietnamInfo;
