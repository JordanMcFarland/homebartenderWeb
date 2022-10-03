import React, { useEffect, useState } from "react";
import {
  Card,
  Label,
  Button,
  Input,
  CardImg,
  CardImgOverlay,
  CardTitle,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { updateUserBar } from "../helpers/homebartenderServer";

function MyBar({ ingredients, ingredientCategories, cocktails, user }) {
  const [displayCraftable, toggleDisplayCraftable] = useState(false);
  const [editingMyBar, toggleEditMyBar] = useState(false);
  const [craftableList, setCraftableList] = useState([]);
  const [userBarCategories, setUserBarCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const newCategories = Object.keys(user.userBar);
    setUserBarCategories(newCategories);
  }, [user]);

  // Create the cards for each ingredient item that is in myBar
  const renderMyBar = userBarCategories.map((category, index) => {
    if (user.userBar[category].length) {
      return (
        <div key={index} className="mt-3">
          <h3>{category}</h3>
          <div className="row mx-auto">
            {user.userBar[category].map((ingredient) => {
              return (
                <div
                  key={ingredient._id}
                  className="col-6 col-md-4 col-lg-3 px-2 my-1"
                >
                  <Card className="p-2">{ingredient.name}</Card>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else return;
  });

  // Returns a list of cocktails that the user can create based on what is in myBar
  // function getCraftableList() {
  //   const regex = /[0-9]*\.*[0-9]* (ozs|oz|dashes|dash)|\([^)]*\)/g;
  //   const craftableCocktailList = [];
  //   const lowerCaseMyBar = [];
  //   ingredientCategories.forEach((category) =>
  //     ingredients[category].forEach((ingredient) => {
  //       if (myBar.includes(ingredient._id)) {
  //         lowerCaseMyBar.push(ingredient.name.toLowerCase());
  //       }
  //     })
  //   );
  //   cocktails.forEach((cocktail) => {
  //     let trimmedIngredientList = cocktail.requiredIngredients.map(
  //       (ingredient) => ingredient.replace(regex, "").trim().toLowerCase()
  //     );
  //     if (
  //       trimmedIngredientList.every((ingredient) =>
  //         lowerCaseMyBar.includes(ingredient)
  //       )
  //     ) {
  //       craftableCocktailList.push(cocktail);
  //     }
  //   });
  //   setCraftableList(craftableCocktailList);
  // }

  return (
    <div className="container my-2">
      <div className="row">
        <Button
          className="col m-1"
          style={{ background: "#B70D29" }}
          onClick={() => navigate("/mybar/craftablecocktails")}
        >
          What can I make?
        </Button>
        <Button
          className="col m-1"
          onClick={() => navigate("/mybar/editor")}
          color="secondary"
        >
          Edit My Bar
        </Button>
      </div>
      <div className="row">{renderMyBar}</div>
    </div>
  );
}

export default MyBar;
