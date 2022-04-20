import React, { useState } from 'react';
import CocktailDirectory from './CocktailDirectoryComponent';
import CocktailInfo from './CocktailInfoComponent';
import IngredientDirectory from './IngredientDirectoryComponent';
import Header from './HeaderComponent';
import { Routes, Route } from 'react-router-dom';
import { COCKTAILS } from '../shared/cocktailList';
import { INGREDIENTS } from '../shared/ingredients';

const Main = ({history}) => {
  const [cocktails, setCocktails] = useState(COCKTAILS);
  const [ingredients, setIngredients] = useState(INGREDIENTS);
  /*
  constructor(props) {
    super(props);
    this.state = {
      cocktails: COCKTAILS
    };
  }
  */
  // render() {
    const toggleCocktail = (newCocktail) => {
      if (!cocktails.includes(newCocktail)) {
        setCocktails((prevState) => [...prevState, newCocktail]);
      } else {
        setCocktails(cocktails.filter(cocktail => cocktail !== newCocktail))
      }
    }

    // const CocktailWithId = ({match}) => {
    //   return (
    //     <CocktailInfo cocktail={cocktails.filter(cocktail => cocktail.id === +match.params.cocktailId)[0]} />
    //   );
    // }

    return (
      <>
        <Header />
        <Routes>
          <Route path='/directory/:id' element={<CocktailInfo cocktails={cocktails} />} />
          <Route path='/directory' element={<CocktailDirectory cocktails={cocktails} />} />
          <Route path='/ingredientdirectory' element={<IngredientDirectory ingredients={ingredients} />} />
        </Routes>
      </>
    );
  //}
}

export default Main;