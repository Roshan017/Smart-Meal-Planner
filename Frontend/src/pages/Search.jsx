import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { searchMeals } from '../services/function';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchValue, setValue] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchValue.trim()) {
        setMeals([]);
        return;
      }
      setLoading(true);
      try {
        const mealRes = await searchMeals(searchValue);
        if (mealRes.data.error) {
          setMeals([]);
        } else {
          setMeals(mealRes.data.meals || []);
        }
      } catch (e) {
        console.error(e);
        setMeals([]);
      }
      setLoading(false);
    }, 500); // Debounce delay 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col items-center mb-8">
        <img src="/images/Title.png" alt="Title" className="mb-4 w-44 md:w-52" />
        <div className="w-full max-w-md">
          <Input
            value={searchValue}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for delicious meals..."
            className="shadow-md focus:ring-2 focus:ring-green-400 transition rounded-xl"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-500">Searching meals...</p>
      )}

      {/* Display Meals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 md:px-0">
        {meals.map((meal) => (
          <div
            key={meal.id}
            onClick={() => nav(`/meal/${meal.id}`)}
            className="rounded-lg bg-white border shadow hover:shadow-xl transition-transform transform hover:-translate-y-1 p-3 cursor-pointer"
          >
            <img
              src={meal.image}
              alt={meal.title}
              className="rounded-lg w-full h-40 object-cover mb-2"
            />
            <h3 className="font-semibold text-gray-700 truncate">{meal.title}</h3>
          </div>
        ))}
      </div>

      {/* Empty Result */}
      {!loading && meals.length === 0 && searchValue.trim() && (
        <p className="text-gray-500 text-center mt-10 text-lg">
          No meals found 😔
        </p>
      )}
    </div>
  );
};

export default Search;
