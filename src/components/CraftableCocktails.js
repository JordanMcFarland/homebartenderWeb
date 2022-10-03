import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const CraftableCocktails = ({ user, cocktails }) => {
  const [craftableCocktails, setCraftableCocktails] = useState([]);

  useEffect(() => {
    function getCraftableList() {
      const regex = /[0-9]*\.*[0-9]* (ozs|oz|dashes|dash)|\([^)]*\)/g;
      const craftableCocktailList = [];
      const lowerCaseUserBar = [];
      const userBarIngredientCategories = Object.keys(user.userBar);

      // Convert ingredient names to lowercase
      userBarIngredientCategories.forEach((category) =>
        user.userBar[category].forEach((ingredient) => {
          lowerCaseUserBar.push(ingredient.name.toLowerCase());
        })
      );

      // Cycle through stock cocktails
      // Trim measurement from ingredient list and convert ingredient name to lowercase
      // Check if all ingredients are in my bar and if so, add to craftable list
      cocktails.forEach((cocktail) => {
        let trimmedIngredientList = cocktail.requiredIngredients.map(
          (ingredient) => ingredient.replace(regex, "").trim().toLowerCase()
        );
        if (
          trimmedIngredientList.every((ingredient) =>
            lowerCaseUserBar.includes(ingredient)
          )
        ) {
          craftableCocktailList.push(cocktail);
        }
      });

      // Cycle through user cocktails
      // Trim measurement from ingredient list and convert ingredient name to lowercase
      // Check if all ingredients are in my bar and if so, add to craftable list
      user.userCocktails.forEach((userCocktail) => {
        let trimmedIngredientList = userCocktail.requiredIngredients.map(
          (ingredient) =>
            ingredient.name.replace(regex, "").trim().toLowerCase()
        );
        if (
          trimmedIngredientList.every((ingredient) =>
            lowerCaseUserBar.includes(ingredient)
          )
        ) {
          craftableCocktailList.push(userCocktail);
        }
      });

      // Sort cocktails by name
      craftableCocktailList.sort((a, b) => a.name > b.name);

      console.log(craftableCocktailList);
      setCraftableCocktails(craftableCocktailList);
    }

    getCraftableList();
  }, []);

  const renderCraftableList = craftableCocktails.map((cocktail) => {
    return (
      <div
        key={cocktail._id}
        className="col-sm-6 col-lg-4"
        style={{ marginTop: 8 }}
      >
        <Card style={{ minHeight: 60 }}>
          {cocktail.userId && (
            <FontAwesomeIcon
              icon={faUser}
              style={{
                position: "absolute",
                right: 8,
                top: 20,
              }}
            />
          )}
          <Link
            to={
              cocktail.userId
                ? `/mycocktails/${cocktail._id}`
                : `/directory/${cocktail._id}`
            }
          >
            {cocktail.image && (
              <CardImg src={cocktail.image} alt={cocktail.name} width="30" />
            )}

            <CardTitle
              style={{
                marginTop: 16,
                marginLeft: 8,
                display: "inline-flex",
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              {cocktail.name}
            </CardTitle>
          </Link>
        </Card>
      </div>
    );
  });

  return (
    <div className="container" style={{ marginTop: 16 }}>
      <div className="row">{renderCraftableList}</div>
    </div>
  );
};

export default CraftableCocktails;
