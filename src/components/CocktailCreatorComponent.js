import React, { useState } from "react";
import IngredientDirectory from "./IngredientDirectoryComponent";
import { Form, FormGroup, Button, Collapse, Label, Input } from "reactstrap";
import { postCocktail, getUserCocktails } from "../helpers/homebartenderServer";
import { useNavigate } from "react-router-dom";

function CocktailCreator({ ingredients, ingredientCategories, ...props }) {
  const [isOpenIngredients, setIsOpenIngredients] = useState(false);
  const [newCocktail, setNewCocktail] = useState({
    name: "",
    requiredIngredients: [],
    recipe: "",
    image: "",
  });
  const navigate = useNavigate();

  const toggleIngredients = () => setIsOpenIngredients(!isOpenIngredients);

  const updateNewCocktail = (e) => {
    const { name, value } = e.target;
    setNewCocktail({ ...newCocktail, [name]: value });
  };

  const toggleIngredient = (ingredient) => {
    const newData = { ...newCocktail };
    if (!newCocktail.requiredIngredients) newCocktail.requiredIngredients = [];
    if (!newCocktail.requiredIngredients.includes(ingredient)) {
      newData.requiredIngredients = [
        ...newData.requiredIngredients,
        ingredient,
      ];
      console.log(ingredient + " has been added to list");
    } else {
      newData.requiredIngredients = newData.requiredIngredients.filter(
        (item) => item !== ingredient
      );
    }
    setNewCocktail(newData);
  };

  const commitCocktail = async (e) => {
    e.preventDefault();
    try {
      console.log(newCocktail);
      const response = await postCocktail(newCocktail);
      if (response) {
        alert(newCocktail.name + " has been added to the cocktail list.");
        updateUserCocktails();
      } else {
        const err = new Error(
          "Could not add your cocktail. Make sure name, ingredient, and recipe fields are filled."
        );
        alert(err);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserCocktails = async () => {
    const newUserCocktails = await getUserCocktails();
    const sortedUserCocktails = newUserCocktails.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    props.onGetUserCocktails(sortedUserCocktails);
  };

  const getImage = (e) => {
    console.log(e.target.files[0].name);
    let img = e.target.files[0];
    setNewCocktail({ ...newCocktail, image: URL.createObjectURL(img) });
  };

  return (
    <div className="container pt-3">
      <div className="row">
        <div className="col-12">
          <h2>Create Your Own Cocktail</h2>
          <hr />
        </div>
        <div className="col-md-10">
          <Form onSubmit={commitCocktail}>
            <FormGroup>
              <Label htmlFor="cocktailName">Cocktail Name: </Label>
              <Input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Cocktail Name"
                value={newCocktail.name}
                onChange={updateNewCocktail}
              />
            </FormGroup>
            <FormGroup row>
              <div className="col">
                <Label>Required Ingredient:</Label>{" "}
                <Button
                  className="my-auto py-0"
                  color="secondary"
                  onClick={toggleIngredients}
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  Toggle Ingredient List
                </Button>
                <Collapse isOpen={isOpenIngredients}>
                  <IngredientDirectory
                    ingredients={ingredients}
                    toggleIngredient={toggleIngredient}
                    ingredientCategories={ingredientCategories}
                  />
                </Collapse>
              </div>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="recipe">Recipe: </Label>
              <Input
                type="text"
                id="recipe"
                name="recipe"
                className="form-control"
                placeholder="Recipe"
                value={newCocktail.recipe}
                onChange={updateNewCocktail}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="fileUpload">Upload Image</Label>
              <Input
                type="file"
                id="fileUpload"
                name="fileUpload"
                className="form-control"
                onChange={getImage}
              />
            </FormGroup>
            <FormGroup row>
              <div className="col">
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CocktailCreator;
