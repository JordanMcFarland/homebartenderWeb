import React, { Component, useState } from 'react';
import CocktailDirectory from './CocktailDirectoryComponent';
import CocktailInfo from './CocktailInfoComponent';
import { Routes, Route } from 'react-router-dom';
import { COCKTAILS } from '../shared/cocktailList';

const Main = ({history}) => {
  const [cocktails, setCocktails] = useState(COCKTAILS);
  /*
  constructor(props) {
    super(props);
    this.state = {
      cocktails: COCKTAILS
    };
  }
  */
  console.log(history?.location);
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
      <Routes>
        <Route path='/directory/:id' element={<CocktailInfo cocktails={cocktails} />} />
        <Route path='/directory' element={<CocktailDirectory cocktails={cocktails} />} />
      </Routes>
    );
  //}
}

export default Main;