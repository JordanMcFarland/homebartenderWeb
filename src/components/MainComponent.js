import React, { useEffect, useState } from "react";
import CocktailDirectory from "./CocktailDirectoryComponent";
import CocktailInfo from "./CocktailInfoComponent";
import CocktailCreator from "./CocktailCreatorComponent";
import Header from "./HeaderComponent";
import FavoriteComponent from "./FavoriteComponent";
import { Routes, Route, useNavigate } from "react-router-dom";
//import { COCKTAILS } from "../shared/cocktailList";
import { INGREDIENTS } from "../shared/ingredients";
import { baseUrl } from "../shared/baseUrl";

const Main = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [cocktails, setCocktails] = useState([]);
  const [ingredients] = useState(INGREDIENTS);
  const [favorites, setFavorites] = useState([]);
  let navigate = useNavigate();

  //fetch the cocktails
  useEffect(() => {
    const fetchCocktails = async () => {
      const response = await fetch(baseUrl + "cocktails");
      const cocktailList = await response.json();
      setCocktails(...cocktails, cocktailList);
      setLoading(false);
    };
    fetchCocktails();
  }, []);

  useEffect(() => {
    console.log(favorites);
  }, [favorites]);

  const addCocktail = (cocktail) => {
    setCocktails([...cocktails, cocktail]);
  };

  // This updates the cocktail list and the remaing cocktail id necessary
  // Navigates back to the cocktail directory
  const deleteCocktail = (unwantedCocktail) => {
    const updatedCocktailList = cocktails.filter(
      (cocktail) => cocktail.name !== unwantedCocktail.name
    );
    setCocktails(updatedCocktailList);
    navigate("/directory");
  };

  const addFavorite = (cocktailId) => {
    if (favorites.includes(cocktailId)) {
      setFavorites([...favorites]);
      console.log("Cocktail is already a favorite");
    } else setFavorites([...favorites, cocktailId]);
  };

  if (!loading) {
    return (
      <>
        <Header />
        <Routes>
          <Route
            path="/directory/:id"
            element={
              <CocktailInfo
                cocktails={cocktails}
                deleteCocktail={deleteCocktail}
                addFavorite={addFavorite}
              />
            }
          />
          <Route
            path="/directory"
            element={<CocktailDirectory cocktails={cocktails} />}
          />
          <Route
            path="/cocktailcreator"
            element={
              <CocktailCreator
                ingredients={ingredients}
                cocktails={cocktails}
                addCocktail={addCocktail}
              />
            }
          />
          <Route
            path="favorites"
            element={
              <FavoriteComponent favorites={favorites} cocktails={cocktails} />
            }
          />
        </Routes>
      </>
    );
  } else return <div>Loading...</div>;
};

export default Main;
