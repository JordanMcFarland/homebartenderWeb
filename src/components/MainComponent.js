import React, { useState } from 'react';
import CocktailDirectory from './CocktailDirectoryComponent';
import CocktailInfo from './CocktailInfoComponent';
import CocktailCreator from './CocktailCreatorComponent';
import Header from './HeaderComponent';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { COCKTAILS } from '../shared/cocktailList';
import { INGREDIENTS } from '../shared/ingredients';

const Main = ({history}) => {
  const [cocktails, setCocktails] = useState(COCKTAILS);
  const [ingredients] = useState(INGREDIENTS);
  let navigate = useNavigate();

  const addCocktail = (cocktail) => {
    setCocktails([...cocktails, cocktail])
  }

  // This updates the cocktail list and the remaing cocktail id necessary
  // Navigates back to the cocktail directory
  const deleteCocktail = (unwantedCocktail) => {
    const updatedCocktailList = cocktails.filter(cocktail => cocktail.name !== unwantedCocktail.name);
    //console.log(updatedCocktailList);
    setCocktails(updatedCocktailList);
    navigate('/directory');
  }

    return (
      <>
        <Header />
        <Routes>
          <Route path='/directory/:id' element={<CocktailInfo cocktails={cocktails} deleteCocktail={deleteCocktail} />} />
          <Route path='/directory' element={<CocktailDirectory cocktails={cocktails} />} />
          <Route path='/cocktailcreator' element={<CocktailCreator ingredients={ingredients} cocktails={cocktails} addCocktail={addCocktail} />} />
        </Routes>
      </>
    );
  //}
}

export default Main;