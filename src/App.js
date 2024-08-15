import './index.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FOURSQUARE_API_KEY = process.env.REACT_APP_FOURSQUARE_API_KEY;


const allCuisines = [
  'Italian', 'Chinese', 'Mexican', 'Japanese', 'Indian', 
  'Thai', 'American', 'French', 'Greek', 'Spanish', 'Korean', 
  'Vietnamese' 
];

function App() {
  const [location, setLocation] = useState('');
  const [cuisineChoices, setCuisineChoices] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [finalCuisine, setFinalCuisine] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const [readyForLocation, setReadyForLocation] = useState(false);

useEffect(() => {
  if (cuisineChoices.length === 0) {
    setCuisineChoices(shuffleArray(allCuisines));
  }
}, [cuisineChoices]);

  const handleLocationInput = (event) => {
    setLocation(event.target.value);
  };

  const handleCuisineChoice = (chosenIndex) => {
    const chosenCuisine = cuisineChoices[chosenIndex];
    if (cuisineChoices.length === 2) {
      setFinalCuisine(chosenCuisine);
      setReadyForLocation(true);
    } else {
      setCuisineChoices([chosenCuisine, ...cuisineChoices.slice(2)]);
      setCurrentRound(currentRound + 1);
    }
  };


  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const fetchRestaurants = async () => {
    if (readyForLocation && finalCuisine && location) {
      try {
        const response = await axios.get(
          'https://api.foursquare.com/v3/places/search',
          {
            headers: {
              Accept: 'application/json',
              Authorization: FOURSQUARE_API_KEY,
            },
            params: {
              query: finalCuisine,
              near: location,
              limit: 10,
              categories: '13065', //category id for restaurants
            },
          }
        );
  
        setRestaurants(
          response.data.results.map((result) => ({
            name: result.name,
            address: result.location.address,
            // no ratings bc of free tier at four squares
          }))
        );
  
        setReadyForLocation(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    }
  };

  const resetChoices = () => {
    setFinalCuisine(null);
    setRestaurants([]);
    setCurrentRound(0);
    setCuisineChoices(shuffleArray(allCuisines));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-5 text-center text-gray-900">Bite Swipe</h1>
          
          {!finalCuisine && cuisineChoices.length >= 2 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Choose your preferred cuisine:</h2>
              <div className="space-y-2">
                <button onClick={() => handleCuisineChoice(0)} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                  {cuisineChoices[0]}
                </button>
                <button onClick={() => handleCuisineChoice(1)} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                  {cuisineChoices[1]}
                </button>
              </div>
            </div>
          )}
  
          {finalCuisine && readyForLocation && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">Your chosen cuisine: {finalCuisine}</h2>
              <p className="mb-4">Enter your city to find restaurants:</p>
              <input 
                type="text" 
                value={location} 
                onChange={handleLocationInput} 
                placeholder="Enter your location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={fetchRestaurants} className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
                Find Restaurants
              </button>
            </div>
          )}
  
  {restaurants.length > 0 && (
  <div className="mt-6">
    <h3 className="text-lg font-medium mb-2 text-gray-600">
      {finalCuisine} Restaurants in {location}:
    </h3>
    <ul className="space-y-2">
      {restaurants.map((restaurant, index) => (
        <li key={index} className="bg-gray-50 p-2 rounded-md">
          {restaurant.name} - {restaurant.address}
        </li>
      ))}
    </ul>
    <button
      onClick={resetChoices}
      className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
    >
      Start Over
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default App;
