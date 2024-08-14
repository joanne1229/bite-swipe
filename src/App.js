import './index.css';
import React, { useState, useEffect } from 'react';

const allCuisines = [
  'Italian', 'Chinese', 'Mexican', 'Japanese', 'Indian', 
  'Thai', 'American', 'French', 'Greek', 'Spanish'
];

function App() {
  const [location, setLocation] = useState('');
  const [cuisineChoices, setCuisineChoices] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [finalCuisine, setFinalCuisine] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const [readyForLocation, setReadyForLocation] = useState(false);

// Modify the useEffect hook to handle the new logic
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
    setCuisineChoices([chosenCuisine, ...cuisineChoices.slice(2)]);
    if (cuisineChoices.length === 2) {
      setFinalCuisine(chosenCuisine);
      setReadyForLocation(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const fetchRestaurants = () => {
    if (readyForLocation && finalCuisine) {
      // This is where you would normally make an API call
      // For this example, we'll just set some mock data
      setRestaurants([
        { name: `Best ${finalCuisine} Place in ${location}`, rating: 4.5 },
        { name: `${finalCuisine} Delight in ${location}`, rating: 4.2 },
        { name: `${finalCuisine} Express in ${location}`, rating: 3.8 },
      ]);
      setReadyForLocation(false); // Reset this after fetching
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
          
          <input 
            type="text" 
            value={location} 
            onChange={handleLocationInput} 
            placeholder="Enter your location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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

          {finalCuisine && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">Your chosen cuisine: {finalCuisine}</h2>
              <h3 className="text-lg font-medium mb-2 text-gray-600">Restaurants in {location}:</h3>
              <ul className="space-y-2">
                {restaurants.map((restaurant, index) => (
                  <li key={index} className="bg-gray-50 p-2 rounded-md">
                    {restaurant.name} - Rating: {restaurant.rating}
                  </li>
                ))}
              </ul>
              <button onClick={resetChoices} className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
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
