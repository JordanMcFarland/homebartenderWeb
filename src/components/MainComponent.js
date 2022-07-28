import React, { useEffect, useState } from "react";
import CocktailDirectory from "./CocktailDirectoryComponent";
import CocktailInfo from "./CocktailInfoComponent";
import CocktailCreator from "./CocktailCreatorComponent";
import Header from "./HeaderComponent";
import FavoriteComponent from "./FavoriteComponent";
import MyBarComponent from "./MyBarComponent";
import LoginComponent from "./LoginComponent";
import { Routes, Route, useNavigate } from "react-router-dom";
import { fetchIngredients, postCocktail } from "../helpers/airtable";

const Main = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [cocktails, setCocktails] = useState([]);
  const [ingredients, setIngredients] = useState({});
  const [ingredientCategories, setIngredientCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [myCocktails, setMyCocktails] = useState([]);
  const [myBar, setMyBar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCocktailAirTable = async () => {
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
        const cocktailList = list.records
          .map((record) => {
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
          })
          .sort((a, b) => (a.name > b.name ? 1 : -1));
        //console.log(cocktailList);
        setCocktails((prevState) => [...prevState, ...cocktailList]);
      } catch (e) {
        console.error(e);
        setErr(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCocktailAirTable();
  }, []);

  useEffect(() => {
    const fetchIngredientAirTable = async () => {
      try {
        const list = await fetchIngredients();

        // Create a list object with {category: ingredient array} pairs
        const listObj = {};
        list.records.forEach((record) => {
          const { type, name } = record.fields;

          if (!listObj[type]) {
            listObj[type] = [];
          }

          listObj[type] = [...listObj[type], name];
        });

        // Create category array and sort ingredients in each category
        const keyArr = Object.keys(listObj);
        keyArr.forEach((key) => {
          listObj[key] = listObj[key].sort();
        });

        // Set ingredient & ingredient category state
        setIngredients((prevState) => ({ ...prevState, ...listObj }));
        setIngredientCategories((prevState) => [...prevState, ...keyArr]);
      } catch (e) {
        console.error(e);
        setErr(true);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredientAirTable();
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
                ingredientCategories={ingredientCategories}
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
            path="/favorites"
            element={
              <FavoriteComponent favorites={favorites} cocktails={cocktails} />
            }
          />
          <Route
            path="/mybar"
            element={
              <MyBarComponent
                ingredients={ingredients}
                ingredientCategories={ingredientCategories}
                cocktails={cocktails}
                myBar={myBar}
                setMyBar={setMyBar}
              />
            }
          />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </>
    );
  } else return <div>Loading...</div>;
};

export default Main;
