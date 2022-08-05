import React, { useEffect, useState } from "react";
import CocktailDirectory from "./CocktailDirectoryComponent";
import CocktailInfo from "./CocktailInfoComponent";
import CocktailCreator from "./CocktailCreatorComponent";
import Header from "./HeaderComponent";
import FavoriteComponent from "./FavoriteComponent";
import MyBarComponent from "./MyBarComponent";
import LoginComponent from "./LoginComponent";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  fetchCocktails,
  fetchIngredients,
  postCocktail,
} from "../helpers/airtable";
import {
  getUserCocktails,
  deleteUserCocktail,
  updateUserCocktail,
  getUserFavorites,
  postUserFavorite,
  deleteUserFavorite,
} from "../helpers/homebartenderServer";

const Main = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [cocktails, setCocktails] = useState([]);
  const [ingredients, setIngredients] = useState({});
  const [ingredientCategories, setIngredientCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [myCocktails, setMyCocktails] = useState([]);
  const [myBar, setMyBar] = useState([]);
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCocktailAirTable = async () => {
      try {
        const list = await fetchCocktails();
        const cocktailList = list.records
          .map((record) => {
            const { _id, name, requiredIngredients, recipe, image } =
              record.fields;
            const ingredientsArr = requiredIngredients.split(",");
            return {
              _id,
              name,
              requiredIngredients: ingredientsArr.map((item) => item.trim()),
              recipe,
              image,
            };
          })
          .sort((a, b) => (a.name > b.name ? 1 : -1));
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

  const handleUserLogin = async (userData) => {
    setUser(userData);
    handleGetUserFavorites();
    navigate("/directory");
  };

  const handleUserLogout = () => {
    setUser();
    localStorage.removeItem("token");
    navigate("/directory");
  };

  const handleGetUserCocktails = async () => {
    const updatedUserCocktails = await getUserCocktails();
    setUser({ ...user, userCocktails: updatedUserCocktails });
    navigate("/mycocktails");
  };

  const handleUpdateUserCocktail = async (userCocktailId, editedCocktail) => {
    const updatedUserCocktails = await updateUserCocktail(
      userCocktailId,
      editedCocktail
    );
    setUser({ ...user, userCocktails: updatedUserCocktails });
  };

  const handleDeleteUserCocktail = async (userCocktailId) => {
    const updatedUserCocktails = await deleteUserCocktail(userCocktailId);
    setUser({ ...user, userCocktails: updatedUserCocktails });
    navigate("/mycocktails");
  };

  const handleGetUserFavorites = async () => {
    try {
      const response = await getUserFavorites();
      const sortedFavoriteCocktails = response
        .map((item) => {
          if (!item.userId) {
            const stockCocktailInfo = cocktails.filter((cocktail) => {
              return cocktail._id.toString() === item._id;
            })[0];
            return { _id: item._id, name: stockCocktailInfo.name };
          } else return item;
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1));
      setFavorites(sortedFavoriteCocktails);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostUserFavorite = async (cocktailInfo) => {
    try {
      const response = await postUserFavorite(cocktailInfo);
      if (!response.ok) {
        const err =
          response.statusText +
          ` could not add cocktail: ${cocktailInfo} to favorites because it's already a favorite.`;
        throw err;
      } else {
        handleGetUserFavorites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUserFavorite = async (cocktailInfo) => {
    try {
      const response = await deleteUserFavorite(cocktailInfo);
      if (!response.ok) {
        const err =
          response.statusText +
          ` could not delete cocktail: ${cocktailInfo} from you favorites.`;
        throw err;
      } else {
        handleGetUserFavorites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = (cocktail) => {
    if (
      favorites.some(
        (favorite) => favorite._id.toString() === cocktail._id.toString()
      )
    ) {
      handleDeleteUserFavorite(
        JSON.stringify({ _id: cocktail._id, userId: cocktail.userId })
      );
    } else
      handlePostUserFavorite(
        JSON.stringify({ _id: cocktail._id, userId: cocktail.userId })
      );
  };

  if (err) {
    return <h1>Something went wrong. {err}</h1>;
  }

  if (!loading) {
    return (
      <>
        <Header user={user} onUserLogout={handleUserLogout} />
        <Routes>
          <Route
            path="/directory/:_id"
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
            key="directory"
            path="/directory"
            element={<CocktailDirectory cocktails={cocktails} />}
          />
          <Route
            path="/mycocktails/:_id"
            element={
              <CocktailInfo
                cocktails={user?.userCocktails}
                onDeleteCocktail={handleDeleteUserCocktail}
                onUpdateUserCocktail={handleUpdateUserCocktail}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                ingredients={ingredients}
                ingredientCategories={ingredientCategories}
              />
            }
          />
          <Route
            path="/cocktailcreator"
            element={
              <CocktailCreator
                ingredients={ingredients}
                ingredientCategories={ingredientCategories}
                userCocktails={user?.userCocktails}
                onGetUserCocktails={handleGetUserCocktails}
              />
            }
          />
          <Route
            key="mycocktails"
            path="/mycocktails"
            element={<CocktailDirectory cocktails={user?.userCocktails} />}
          />
          <Route
            path="/favorites"
            element={
              <FavoriteComponent
                favorites={favorites}
                cocktails={cocktails}
                onGetUserFavorites={handleGetUserFavorites}
              />
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
          <Route
            path="/login"
            element={
              <LoginComponent setUser={setUser} onUserLogin={handleUserLogin} />
            }
          />
        </Routes>
      </>
    );
  } else return <div>Loading...</div>;
};

export default Main;
