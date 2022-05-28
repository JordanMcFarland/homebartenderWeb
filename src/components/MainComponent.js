import React, { useEffect, useState } from "react";
import CocktailDirectory from "./CocktailDirectoryComponent";
import CocktailInfo from "./CocktailInfoComponent";
import CocktailCreator from "./CocktailCreatorComponent";
import Header from "./HeaderComponent";
import FavoriteComponent from "./FavoriteComponent";
import { Routes, Route, useNavigate } from "react-router-dom";
import { INGREDIENTS } from "../shared/ingredients";
import { postCocktail } from "../helpers/airtable";

const Main = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [cocktails, setCocktails] = useState([]);
  const [ingredients] = useState(INGREDIENTS);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAirTable = async () => {
      try {
        const response = await fetch(
          `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/COCKTAILS`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
            },
          }
        );
        const list = await response.json();
        const cocktailList = list.records.map((record) => {
          const { id, name, requiredIngredients, recipe, image } =
            record.fields;
          const ingredientsArr = requiredIngredients.split(",");
          return {
            id,
            name,
            requiredIngredients: ingredientsArr.map((item) => item.trim()),
            recipe,
            image,
          };
        });
        console.log(cocktailList);
        setCocktails((prevState) => [...prevState, ...cocktailList]);
      } catch (e) {
        console.error(e);
        setErr(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAirTable();
  }, []);

  useEffect(() => {
    console.log(favorites);
  }, [favorites]);

  const addCocktail = (cocktail) => {
    setCocktails([...cocktails, cocktail]);
    const formattedIngredients = cocktail.requiredIngredients.join();
    const formattedCocktail = {
      ...cocktail,
      requiredIngredients: formattedIngredients,
    };
    console.log(formattedCocktail);
    postCocktail(formattedCocktail);
    navigate("/directory");
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

  const toggleFavorite = (cocktailId) => {
    if (favorites.includes(cocktailId)) {
      const updatedFavorites = favorites.filter(
        (favorite) => favorite !== cocktailId
      );
      setFavorites(updatedFavorites);
    } else setFavorites([...favorites, cocktailId]);
  };

  const commitEditedCocktail = (editedCocktail) => {
    const editedCocktailList = cocktails;
    const index = editedCocktailList.findIndex(
      (cocktail) => cocktail.id === editedCocktail.id
    );
    editedCocktailList[index] = editedCocktail;
    //console.log(editedCocktailList);
    setCocktails(editedCocktailList);
  };

  if (err) {
    return <h1>Something went wrong.</h1>;
  }

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
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                ingredients={ingredients}
                commitEditedCocktail={commitEditedCocktail}
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
