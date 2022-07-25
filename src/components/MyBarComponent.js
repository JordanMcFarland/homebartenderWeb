import React, { useState } from "react";
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

function MyBarComponent({ ingredients, cocktails, myBar, setMyBar }) {
  const [displayCraftable, toggleDisplayCraftable] = useState(false);
  const [editingMyBar, toggleEditMyBar] = useState(false);
  const [craftableCocktailList, setCraftableList] = useState([]);
  const [sortedMyBarIngredients, setSortedMyBarIngredients] = useState([]);

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
  const myBarList = myBar.map((ingredient, index) => {
    return (
      <div key={index} className="col-2 my-1">
        <Card style={{ width: 100 }}>
          <Label className="pt-2 mx-auto" check>
            {" " + ingredient}
          </Label>
        </Card>
      </div>
    );
  });

  // Render the cards for adding ingredient to myBar
  const renderIngredientList = ingredients.map((ingredientType, index) => {
    return (
      <div key={index} className="mt-4">
        <h3>{ingredientType.name}</h3>
        <div className="row">
          {ingredientType.ingredients.map((ingredient, index) => {
            return (
              <div className="col-4 mt-1" key={index}>
                <Card>
                  <Label className="pt-2 mx-3" check>
                    <Input
                      type="checkbox"
                      name={ingredient.name}
                      onChange={(e) => toggleIngredient(e.target.name)}
                      checked={myBar.includes(ingredient.name)}
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
    const craftableList = [];
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
        craftableList.push(cocktail);
      }
      // console.log(cocktail.name);
      // console.log(trimmedIngredientList);
    });
    //console.log(craftableList);
    setCraftableList(craftableList);
  }

  // Displays cards for craftable cocktails
  // *if craftable list not empty, show cocktails, else say the list is empty
  const renderCraftableCocktails = craftableCocktailList.length ? (
    craftableCocktailList.map((cocktail) => {
      return (
        <div className="col-6" key={cocktail.id}>
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
    <div className="col">You have no ingredients in your bar</div>
  );

  return (
    <div className="container">
      <div className="row">
        <Button
          className="col m-1"
          color="primary"
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
              onClick={() => toggleEditMyBar(!editingMyBar)}
              color="warning"
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
