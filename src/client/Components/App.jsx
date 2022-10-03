import React, { useRef, useState } from 'react';
import stationArray from '../../data/stationIds';

import '../style/style.css';

const App = () => {
  const inputRef = useRef(null); // ref for station id

  // button diasble control
  const [buttonOn, setButtonOn] = useState(false);
  // weather station data array for table
  const [dataArray, setDataArray] = useState([]);

  // Dropdown menu of station ids
  const dataListArray = stationArray.map((el) => {
    return <option value={el} key={el} />;
  });

  // GET station id information when user submits valid value
  const handleSubmit = () => {
    if(inputRef.current.value) {
      setButtonOn(true);

      fetch(`/api/${inputRef.current.value}`)
        .then((data) => data.json())
        .then((data) => {
          setDataArray(
            data.length
              ? data.map((el) => {
                  const [id, ymd, element, val1, mflag1, qflag1, sflag1, val2] =
                    el;
                  return (
                    <tr>
                      <td>{id}</td>
                      <td>{ymd}</td>
                      <td>{element}</td>
                      <td>{val1}</td>
                      <td>{mflag1}</td>
                      <td>{qflag1}</td>
                      <td>{sflag1}</td>
                      <td>{val2}</td>
                    </tr>
                  );
                })
              : []
          );
          setButtonOn(false);
        })
        .catch((error) => console.log(error));
    } else {
      window.alert('Empty value cannot be submitted. Please try again.')
    }
  };

  return (
    <div className="app-container">
      <h1>NOAA 2017 Weather Data</h1>
      <p>
        Please select appropriate station id and click submit to return data.
      </p>
      <div className="search-container">
        <input
          list="station-id-list"
          id="station-id-input"
          ref={inputRef}
          placeholder="Station"
        />

        <datalist id="station-id-list">{dataListArray}</datalist>
      </div>
      <button id="submit-btn" onClick={handleSubmit} disabled={buttonOn}>
        Submit
      </button>
      <div className={'table-container'}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Element</th>
              <th>Value 1</th>
              <th>MFlag1</th>
              <th>QFlag1</th>
              <th>SFlag1</th>
              <th>Value2</th>
            </tr>
          </thead>
          <tbody>{dataArray}</tbody>
        </table>
      </div>
    </div>
  );
};

export default App;

