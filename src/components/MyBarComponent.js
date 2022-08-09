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
import { Link } from "react-router-dom";
import { updateUserBar } from "../helpers/homebartenderServer";

function MyBarComponent({
  ingredients,
  ingredientCategories,
  cocktails,
  myBar,
  setMyBar,
}) {
  const [displayCraftable, toggleDisplayCraftable] = useState(false);
  const [editingMyBar, toggleEditMyBar] = useState(false);
  const [craftableList, setCraftableList] = useState([]);

  // Add/Remove ingredients from myBar
  // This isn't saved to server unless user hits submit
  // Create a pop up for if they navigate away that asks if they want to save changes?
  const toggleIngredient = (ingredientId) => {
    if (myBar.includes(ingredientId)) {
      setMyBar((prevState) =>
        prevState.filter((item) => item !== ingredientId)
      );
    } else {
      setMyBar((prevState) => [...prevState, ingredientId]);
    }
  };

  const updateMyBar = async () => {
    try {
      const response = updateUserBar(myBar);

      if (response.ok) {
        setMyBar(response.userBar);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create the cards for each ingredient item that is in myBar
  const myBarList = ingredientCategories.map((category, index) => {
    if (
      ingredients[category].some((ingredient) => myBar.includes(ingredient._id))
    ) {
      return (
        <div key={index} className="mt-3">
          <h3>{category}</h3>
          <div className="row mx-auto">
            {ingredients[category].map((ingredient) => {
              if (myBar.includes(ingredient._id)) {
                return (
                  <div
                    key={ingredient._id}
                    className="col-6 col-md-4 col-lg-3 px-2 my-1"
                  >
                    <Card className="p-2">{ingredient.name}</Card>
                  </div>
                );
              } else return <></>;
            })}
          </div>
        </div>
      );
    } else return <></>;
  });

  // Render the cards for adding ingredient to myBar
  const renderIngredientList = ingredientCategories.map((category, index) => {
    return (
      <div key={index} className="mt-3">
        <h3>{category}</h3>
        <div className="row mx-auto">
          {ingredients[category].map((ingredient) => {
            return (
              <div
                className="col-6 col-md-4 col-lg-3 px-2 my-1"
                key={ingredient._id}
              >
                <Card>
                  <Label className="pt-2 mx-3" check>
                    <Input
                      type="checkbox"
                      //ingredient={{ ingredient }}
                      onChange={() => {
                        toggleIngredient(ingredient._id);
                      }}
                      checked={myBar.includes(ingredient._id)}
                    />
                    {" " + ingredient.name}
                  </Label>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  // Returns a list of cocktails that the user can create based on what is in myBar
  function getCraftableList() {
    const regex = /[0-9]*\.*[0-9]* (ozs|oz|dashes|dash)|\([^)]*\)/g;
    const craftableCocktailList = [];
    const lowerCaseMyBar = [];
    ingredientCategories.forEach((category) =>
      ingredients[category].forEach((ingredient) => {
        if (myBar.includes(ingredient._id)) {
          lowerCaseMyBar.push(ingredient.name.toLowerCase());
        }
      })
    );
    cocktails.forEach((cocktail) => {
      let trimmedIngredientList = cocktail.requiredIngredients.map(
        (ingredient) => ingredient.replace(regex, "").trim().toLowerCase()
      );
      if (
        trimmedIngredientList.every((ingredient) =>
          lowerCaseMyBar.includes(ingredient)
        )
      ) {
        craftableCocktailList.push(cocktail);
      }
    });
    setCraftableList(craftableCocktailList);
  }

  // Displays cards for craftable cocktails
  // *if craftable list not empty, show cocktails, else say the list is empty
  const renderCraftableCocktails = craftableList.length ? (
    craftableList.map((cocktail) => {
      return (
        <div className="col-md-6 my-1" key={cocktail._id}>
          <Card style={{ minHeight: 60 }}>
            <Link to={`/directory/${cocktail._id}`}>
              {cocktail.image ? (
                <CardImg src={cocktail.image} alt={cocktail.name} width="30" />
              ) : (
                <div />
              )}
              <CardImgOverlay>
                <CardTitle>{cocktail.name}</CardTitle>
              </CardImgOverlay>
            </Link>
          </Card>
        </div>
      );
    })
  ) : (
    <div className="col">
      You cannot make any cocktails based on your ingredients
    </div>
  );

  return (
    <div className="container my-2">
      <div className="row">
        <Button
          className="col m-1"
          style={{ background: "#B70D29" }}
          onClick={() => {
            if (!displayCraftable) {
              getCraftableList();
            } else toggleEditMyBar(false);
            toggleDisplayCraftable(!displayCraftable);
          }}
        >
          {displayCraftable ? "Back to My Bar" : "What can I make?"}
        </Button>
        {!displayCraftable ? (
          <>
            {/* button below is for testing and should be removed in final build*/}
            {/* <Button
              className="col m-1"
              color="success"
              onClick={getCraftableList}
            >
              Show filtered ingredient lists (in console)
            </Button> */}
            <Button
              className="col m-1"
              onClick={() => {
                if (editingMyBar) {
                  console.log("Sending ingredients to server...");
                  updateMyBar();
                }
                toggleEditMyBar(!editingMyBar);
              }}
              color="secondary"
            >
              {editingMyBar ? "Submit" : "Edit My Bar"}
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="row">
        {/*
         ** if wanting to display craftable cocktails, do it
         ** if editing and not displaying craftable, display complete list of ingredients w/ checkboxes
         ** if not editing and myBar is NOT empty, display ingredients in myBar
         ** if not editing and myBar IS empty, show text below*/}
        {displayCraftable ? (
          renderCraftableCocktails
        ) : editingMyBar ? (
          renderIngredientList
        ) : myBar.length ? (
          myBarList
        ) : (
          <div>You have no ingredients in your bar.</div>
        )}
      </div>
    </div>
  );
}

export default MyBarComponent;
