import './App.css';
import SearchIcon from "@material-ui/icons/Search";
import { useState, useEffect, useRef } from 'react';
import InfoBox from './components/InfoBox';
import Table from './components/Table';
import { prettyPrintStat, sortData, showDataOnMap } from './util';
import LineGraph from './components/LineGraph';
import "leaflet/dist/leaflet.css";
import { Map as Leaflet, TileLayer } from "react-leaflet";
import {  Countries } from "./countries";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  const mapRef = useRef();

  let c = [23.120153621695614, 41.55029296875001];  // Algeria coordinations

  const handleBounds = () => {
    try {
      console.log(mapRef?.current?.leafletElement?.getBounds());
    } catch(err) { console.log(err) }
  }

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
    setCountries(Countries);
  }, []);
  
  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = sortData(data);
        setMapCountries(data);
        setTableData(sortedData);
      })
    }
    getCountries();
  }, [countries]);
  
  const handleCountry = (e) => {
    const str = e.target.value.toLowerCase().replace(/\b[a-z]/g, function(letter) {
      return letter.toUpperCase();
    });

    setCountry(str);
  }


  const onCountryChange = async (e) => {
    e.preventDefault();   
    let mapCenter = [0, 0], mapZoom = 3;
    const url = country === "" 
      ? "https://disease.sh/v3/covid-19/all" 
      : `https://disease.sh/v3/covid-19/countries/${country}`;

    countries.map((c) => {
      const langCountry = new Intl.Collator('de');
      Object.keys(c.translations).some(key => { return (langCountry.compare(country, c.translations[key]) === 0)})
      if (country === c.name || Object.keys(c.translations).some(key => { return (langCountry.compare(country, c.translations[key]) === 0)})) {
        mapCenter = [c.latitude, c.longitude];
        mapZoom = 5;
      };
      return null
    });

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });

      const { current = {} } = mapRef;
      const { leafletElement: map } = current;

  
      map.flyTo(mapCenter, mapZoom, {
        duration: 2
      });
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <div className="app__search">
            <SearchIcon fontSize="small" />
            <form onSubmit={(e) => onCountryChange(e)}>
              <input type="text" placeholder='Search country' value={country} onChange={(e) => handleCountry(e)} />
            </form>
          </div>
        </div>

        <div className='map'>
          <Leaflet ondragend={handleBounds} ref={mapRef} onClick={(e) => console.log(e)} center={c}  zoom={5}
          >
              <TileLayer 
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {showDataOnMap(mapCountries, casesType)}
          </Leaflet>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Cases"
            active={casesType === "cases"}
            isRed
            cases={prettyPrintStat(countryInfo.todayCases)}
            onClick={(e) => setCasesType("cases")}
            color="blue"
          />
          <InfoBox
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            onClick={(e) => setCasesType("recovered")}
            color="green"
          />
          <InfoBox
            title="Deaths"
            active={casesType === "deaths"}
            isRed
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            onClick={(e) => setCasesType("deaths")}
            color="red"
          />
        </div>
        </div>

      <div className="app__right">
        <div className='app__rightContainer'>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </div>
      </div>
    </div>
  );
}

export default App;
