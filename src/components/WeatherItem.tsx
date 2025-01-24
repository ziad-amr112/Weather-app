import React, { useState } from "react";
import { SearchValidation } from "../validation";
import { FaThermometerHalf, FaTint, FaWind, FaSpinner } from "react-icons/fa";

interface IData {
  NameCity: string;
  NumberTemp: number;
  Humidity: number;
  WindSpeed: number;
}

interface IProps {
  data: IData;
  validation: { NameCity: string };
  setValidation: React.Dispatch<React.SetStateAction<{ NameCity: string }>>;
  setData: React.Dispatch<React.SetStateAction<IData>>;
}

const WeatherItem = ({ data, validation, setValidation, setData }: IProps) => {
  const [City, setCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setErrorMessage("");
  };

  const generateCity = () => City;

  const handleValidation = (field: string) => {
    const newErrors = SearchValidation({ NameCity: generateCity() });
    if (field === "NameCity") {
      setValidation({ ...newErrors, NameCity: newErrors.NameCity });
    }
    if (!newErrors.NameCity && City !== "") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const errors = SearchValidation({ NameCity: City });

    if (errors.NameCity) {
      setValidation(errors);
      setErrorMessage(errors.NameCity);
      return;
    }

    setLoading(true); 
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=8d3c5c48bc8b4c75f0e75b5674b24e42&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found. Please check the name and try again.");
      }

      const weatherData = await response.json();

      setData({
        NameCity: weatherData.name,
        NumberTemp: weatherData.main.temp,
        Humidity: weatherData.main.humidity,
        WindSpeed: weatherData.wind.speed,
      });

      setCity("");
      setValidation({ NameCity: "" });
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Weather App</h1>
        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            placeholder="Enter city name"
            value={City}
            onChange={handleCityChange}
            className="p-3 w-full max-w-xs mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            onBlur={() => handleValidation("NameCity")}
            autoFocus/>

          {validation.NameCity && !City && (
            <div className="text-red-500 text-sm ">
              {validation.NameCity}
            </div>
          )}

          {errorMessage && !validation.NameCity && (
            <div className="text-red-500 text-sm ">{errorMessage}</div>
          )}

          <button
            className="w-full max-w-xs bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition duration-300"
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              "Get Weather"
            )}
          </button>
        </div>

        {data.NameCity && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold">
              Weather in {data.NameCity}
            </h2>
            <h3 className="text-5xl font-bold mt-2 flex items-center justify-center">
              <FaThermometerHalf className="mr-2" /> {data.NumberTemp}°C
            </h3>
            <p className="text-gray-600 mt-2 flex items-center justify-center">
              <FaTint className="mr-2" /> Humidity: {data.Humidity}%
            </p>
            <p className="text-gray-600 flex items-center justify-center">
              <FaWind className="mr-2" /> Wind speed: {data.WindSpeed} km/h
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherItem;
