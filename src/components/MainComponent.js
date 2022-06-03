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
  const [myCocktails, setMyCocktails] = useState([]);
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

  const addMyCocktail = (cocktail) => {
    // const formattedIngredients = cocktail.requiredIngredients.join();
    // const formattedCocktail = {
    //   ...cocktail,
    //   requiredIngredients: formattedIngredients,
    // };
    setMyCocktails((prevState) => [...prevState, cocktail]);
    //postCocktail(formattedCocktail);  *** Need to add new airtable table to post 'my cocktail' list
    navigate("/mycocktails");
  };

  // This updates the  mycocktail list
  // Navigates back to the cocktail directory
  const deleteCocktail = (unwantedCocktail) => {
    const updatedCocktailList = myCocktails.filter(
      (cocktail) => cocktail.name !== unwantedCocktail.name
    );
    setMyCocktails(updatedCocktailList);
    navigate("/mycocktails");
  };

  const toggleFavorite = (cocktail) => {
    if (favorites.includes(cocktail)) {
      const updatedFavorites = favorites.filter(
        (favorite) => favorite !== cocktail
      );
      setFavorites(updatedFavorites);
    } else setFavorites([...favorites, cocktail]);
  };

  const commitEditedCocktail = (editedCocktail) => {
    const editedCocktailList = myCocktails;
    const index = editedCocktailList.findIndex(
      (cocktail) => cocktail.id === editedCocktail.id
    );
    editedCocktailList[index] = editedCocktail;
    //console.log(editedCocktailList);
    setMyCocktails(editedCocktailList);
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
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                ingredients={ingredients}
              />
            }
          />
          <Route
            path="/mycocktails/:id"
            element={
              <CocktailInfo
                cocktails={myCocktails}
                deleteCocktail={deleteCocktail}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                ingredients={ingredients}
                commitEditedCocktail={commitEditedCocktail}
              />
            }
          />
          <Route
            key="directory"
            path="/directory"
            element={
              <CocktailDirectory cocktails={cocktails} location="directory" />
            }
          />
          <Route
            path="/cocktailcreator"
            element={
              <CocktailCreator
                ingredients={ingredients}
                myCocktails={myCocktails}
                addMyCocktail={addMyCocktail}
              />
            }
          />
          <Route
            key="mycocktails"
            path="/mycocktails"
            element={
              <CocktailDirectory
                cocktails={myCocktails}
                location="mycocktails"
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
