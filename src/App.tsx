import { useState } from "react";
import WeatherItem from "./components/WeatherItem";
import './index.css';

function App() {
  const [data, setData] = useState({
    NameCity: "Cairo",
    NumberTemp: 25,
    Humidity: 60,
    WindSpeed: 10,
  });

  const [validation, setValidation] = useState({
    NameCity: "",
  });

  return (
    <div className="App">
      <WeatherItem
        data={data}
        validation={validation}
        setValidation={setValidation}
        setData={setData}
      />
    </div>
  );
}

export default App;