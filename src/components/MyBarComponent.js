import React, { useState } from "react";
import { Card, Label, Button, Input } from "reactstrap";

function MyBarComponent({ ingredients, cocktails, myBar, setMyBar }) {
  const [displayCraftable, toggleDisplayCraftable] = useState(false);
  const [editingMyBar, toggleEditMyBar] = useState(false);

  const toggleIngredient = (ingredient) => {
    if (myBar.includes(ingredient)) {
      setMyBar((prevState) => prevState.filter((item) => item !== ingredient));
      console.log(ingredient + " has been REMOVED from myBar");
    } else {
      setMyBar((prevState) => [...prevState, ingredient]);
      console.log(ingredient + " has been ADDED to myBar");
    }
  };

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

  const renderIngredientList = ingredients.map((ingredient, index) => {
    return (
      <div key={index} className="col-2 my-1">
        <Card>
          <Label className="pt-2 mx-auto" check>
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
  });

  function getCraftableList() {
    const craftableList = [];
    const lowerCaseMyBar = myBar.map((ingredient) => ingredient.toLowerCase());
    cocktails.forEach((cocktail) => {
      let ingredientCounter = 0;
      let lowerCaseIngredientList = cocktail.requiredIngredients.map(
        (ingredient) => ingredient.toLowerCase()
      );
      lowerCaseIngredientList.forEach((ingredient) => {
        lowerCaseMyBar.forEach((item) => {
          if (ingredient.includes(item)) {
            ingredientCounter++; //counts twice sometimes - ex. gin and london dry gin
            console.log(ingredientCounter + " - " + item + " counted");
          }
        });
      });
      if (
        ingredientCounter >= cocktail.requiredIngredients.length &&
        !craftableList.includes(cocktail)
      ) {
        craftableList.push(cocktail);
      }
      console.log(cocktail.name + " - " + cocktail.requiredIngredients.length);
      console.log("Counter Total: " + ingredientCounter);
    });
    console.log(craftableList);
    return craftableList;
  }

  //const renderCraftableCocktails = console.log(getCraftableList());

  return (
    <div className="container">
      <div className="row">
        <Button
          className="col m-1"
          color="primary"
          onClick={() => toggleDisplayCraftable(!displayCraftable)}
        >
          {displayCraftable ? "Back to My Bar" : "What can I make?"}
        </Button>
        <Button onClick={getCraftableList}></Button>
        <Button
          className="col m-1"
          onClick={() => toggleEditMyBar(!editingMyBar)}
        >
          {editingMyBar ? "Submit" : "Edit My Bar"}
        </Button>
      </div>
      <div className="row">
        {editingMyBar ? (
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
