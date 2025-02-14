import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ADDR } from '../config';

import SearchView from './SearchView.jsx';
import ResultsView from './ResultsView.jsx';

const ExploreView = ({ user, favorites, currentView, captureFavorites, captureNavigation, captureRecipeId, capturePantry, liked, captureLikes }) => {

  const [ingredients, setIngredients] = useState([]);
  const [ingredientsMap, setIngredientsMap] = useState({});
  const [pantry, setPantry] = useState({});
  const [results, setResults] = useState([]);
  const [sortOption, setSortOption] = useState('mostPopular');
  const [searchTerms, setSearchTerms] = useState({});
  const [searchTitle, setSearchTitle] = useState('');

  if (ingredients.length === 0) {
    axios.get(`${API_ADDR}/ingredients`)
      .then((response) => {
        setIngredients(response.data);
        for (let i = 0; i < response.data.length; i++) {
          let ingredient = response.data[i];
          ingredientsMap[ingredient.name] = i;
        }
        setIngredientsMap({...ingredientsMap});
      });
  }

  if (Object.keys(ingredientsMap).length !== 0 && Object.keys(pantry).length === 0 && user.id) {
    axios.get(`${API_ADDR}/users/${user.id}/ingredients`)
      .then((response) => {
        if (response.data.length === 0) {
          togglePantryItem([
            'water',
            'salt',
            'black pepper',
          ]);
        } else {
          let newPantry = {};
          for (let i = 0; i < response.data.length; i++) {
            let ingredient = response.data[i];
            newPantry[ingredient.name] = true;
          }
          setPantry(newPantry);
        }
      });
  }

  const fetchResults = () => {
    if (user.usePantry) {
      const idString = Object.keys(pantry)
        .filter((name) => (
          pantry[name]
        ))
        .map((name) => (
          ingredients[ingredientsMap[name]].id
        ))
        .join(',');
      if (!idString) return;
      axios.get(`${API_ADDR}/match/ingredients?ids=${idString}${
        searchTitle ? `&query=${searchTitle}` : ''
      }`)
        .then((response) => {
          setResults(response.data.rows);
        });
    } else {
      const idString = Object.keys(searchTerms)
        .map((name) => (
          ingredients[ingredientsMap[name]].id
        ))
        .join(',');
      if (!idString) {
        setResults([]);
        return;
      };
      const [sortString, dirString] = {
        'mostPopular': ['likes', 'desc'],
        'highPrice': ['price', 'desc'],
        'lowPrice': ['price', 'asc'],
      }[sortOption];
      if (!(sortString && dirString)) return;
      console.log(`${API_ADDR}/search/ingredients?ids=${idString}&sort=${sortString}&direction=${dirString}`);
      axios.get(`${API_ADDR}/search/ingredients?ids=${idString}&sort=${sortString}&direction=${dirString}`)
        .then((response) => {
          setResults(response.data.rows);
        });
    }
  };

  const togglePantryItem = (ingredientNames, categoryMode=false) => {
    const newPantry = {...pantry};
    let categoryModeIsAllFalse = !categoryMode || !ingredientNames.reduce((acc, name) => (acc || newPantry[name]), false);
    for (let ingredient of ingredientNames) {
      if (newPantry[ingredient]) {
        newPantry[ingredient] = false;
        axios.put(`${API_ADDR}/users/${user.id}/ingredients/${ingredients[ingredientsMap[ingredient]].id}/remove`);
      } else if (!categoryMode || categoryModeIsAllFalse) {
        newPantry[ingredient] = true;
        axios.post(`${API_ADDR}/users/${user.id}/ingredients/${ingredients[ingredientsMap[ingredient]].id}/add`);
      }
    }
    setPantry(newPantry);
  };

  const captureSortOption = (option) => {
    setSortOption(option);
  };

  const setSearchTerm = (term, active) => {
    if (user.usePantry) {
      setSearchTitle(term);
      return false;
    } else {
      if (term in ingredientsMap) {
        const newSearchTerms = {...searchTerms};
        if (active) {
          newSearchTerms[term] = true;
        } else if (newSearchTerms[term]) {
          delete newSearchTerms[term];
        }
        setSearchTerms(newSearchTerms);
        return true;
      }
      return false;
    }
  }

  const togglePantry = () => {
    capturePantry(null, !user.usePantry);
  }

  useEffect(() => {
    fetchResults();
  }, [pantry, user.usePantry, sortOption, searchTerms, searchTitle])

  useEffect(() => {
    capturePantry(
      Object.keys(pantry)
        .filter((name) => pantry[name])
        .map((name) => ingredients[ingredientsMap[name]].id)
    , user.usePantry);
  }, [pantry])

  return (
    <div className="searchResultsView">
      {currentView === 'explore' || currentView === 'pantry' ? (
        <SearchView
          ingredients={ingredients}
          ingredientsMap={ingredientsMap}
          pantry={pantry}
          mobile={currentView !== 'explore'}
          usePantry={user.usePantry}
          togglePantry={togglePantry}
          togglePantryItem={togglePantryItem}
        />
      ) : ''}

      {currentView === 'explore' || currentView === 'search' ? (
        <ResultsView
          ingredients={ingredients}
          results={results}
          favorites={favorites}
          mobile={currentView !== 'explore'}
          usePantry={user.usePantry}
          searchTerms={searchTerms}
          sortOption={sortOption}
          captureFavorites={captureFavorites}
          captureNavigation={captureNavigation}
          captureRecipeId={captureRecipeId}
          setSearchTerm={setSearchTerm}
          captureSortOption={captureSortOption}
          liked={liked}
          captureLikes={captureLikes}
        />
      ) : ''}
    </div>
  )
}

export default ExploreView;