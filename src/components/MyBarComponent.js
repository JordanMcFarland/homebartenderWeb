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

  useEffect(() => {
    console.log(ingredients);
  }, []);

  // Add/Remove ingredients from myBar
  const toggleIngredient = (ingredient) => {
    if (myBar.includes(ingredient)) {
      setMyBar((prevState) => prevState.filter((item) => item !== ingredient));
      console.log(ingredient + " has been REMOVED from myBar");
    } else {
      setMyBar((prevState) => [...prevState, ingredient]);
      console.log(ingredient + " has been ADDED to myBar");
    }
  };

  // Create the cards for each ingredient item that is in myBar
  const myBarList = ingredientCategories.map((category, index) => {
    if (
      ingredients[category].some((ingredient) => myBar.includes(ingredient))
    ) {
      return (
        <div key={index} className="mt-3">
          <h3>{category}</h3>
          <div className="row mx-auto">
            {ingredients[category].map((ingredient, index) => {
              if (myBar.includes(ingredient)) {
                return (
                  <div
                    key={index}
                    className="col-6 col-md-4 col-lg-3 px-2 my-1"
                  >
                    <Card className="p-2">{ingredient}</Card>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    }
  });

  // Render the cards for adding ingredient to myBar
  const renderIngredientList = ingredientCategories.map((category, index) => {
    return (
      <div key={index} className="mt-3">
        <h3>{category}</h3>
        <div className="row mx-auto">
          {ingredients[category].map((ingredient, index) => {
            return (
              <div className="col-6 col-md-4 col-lg-3 px-2 my-1" key={index}>
                <Card>
                  <Label className="pt-2 mx-3" check>
                    <Input
                      type="checkbox"
                      name={ingredient}
                      onChange={(e) => {
                        toggleIngredient(e.target.name);
                      }}
                      checked={myBar.includes(ingredient)}
                    />
                    {" " + ingredient}
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
    const lowerCaseMyBar = myBar.map((ingredient) => ingredient.toLowerCase());
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
      // console.log(cocktail.name);
      // console.log(trimmedIngredientList);
    });
    //console.log(craftableList);
    setCraftableList(craftableCocktailList);
  }

  // Displays cards for craftable cocktails
  // *if craftable list not empty, show cocktails, else say the list is empty
  const renderCraftableCocktails = craftableList.length ? (
    craftableList.map((cocktail) => {
      return (
        <div className="col-md-6 my-1" key={cocktail.id}>
          <Card style={{ minHeight: 60 }}>
            <Link to={`/directory/${cocktail.id}`}>
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
