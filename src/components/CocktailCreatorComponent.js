import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import {
  Form,
  FormGroup,
  Button,
  Collapse,
  Label,
  Input,
  Card,
} from "reactstrap";
import { postCocktail } from "../helpers/homebartenderServer";

function CocktailCreator({
  ingredients,
  ingredientCategories,
  uncategorizedIngredients,
  ...props
}) {
  const [newCocktail, setNewCocktail] = useState({
    name: "",
    requiredIngredients: [],
    recipe: "",
    image: "",
  });
  const [tempIngredients, setTempIngredients] = useState([{ _id: 0 }]);
  const [nextIngredientId, setNextIngredientId] = useState(1);

  useEffect(() => {
    const saveIngredients = () => {
      const trimmedIngredients = [];
      tempIngredients.forEach((ingredient) => {
        const trimmedIngredient = {
          name: ingredient.name,
          unit: ingredient.unit,
          amount: ingredient.amount,
          custom: ingredient.custom,
          type: ingredient.type,
        };
        trimmedIngredients.push(trimmedIngredient);
      });
      setNewCocktail({
        ...newCocktail,
        requiredIngredients: trimmedIngredients,
      });
    };

    saveIngredients();
  }, [tempIngredients]);

  const updateNewCocktail = (e) => {
    const { name, value } = e.target;
    setNewCocktail({ ...newCocktail, [name]: value });
  };

  const addIngredient = () => {
    setTempIngredients([...tempIngredients, { _id: nextIngredientId }]);
    setNextIngredientId(nextIngredientId + 1);
  };

  const deleteIngredient = (_id) => {
    const newTempIngredientsArr = tempIngredients.filter(
      (ingredient) => ingredient._id !== _id
    );
    setTempIngredients(newTempIngredientsArr);
  };

  const commitCocktail = async (e) => {
    e.preventDefault();
    try {
      const response = await postCocktail(newCocktail);
      if (response) {
        alert(newCocktail.name + " has been added to the cocktail list.");
        props.onGetUserCocktails();
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

  const getImage = (e) => {
    console.log(e.target.files[0].name);
    let img = e.target.files[0];
    setNewCocktail({ ...newCocktail, image: URL.createObjectURL(img) });
  };

  const renderIngredientContainers = tempIngredients.map((ingredient) => (
    <IngredientContainer
      key={ingredient._id}
      deleteIngredient={deleteIngredient}
      ingredientId={ingredient._id}
      tempIngredients={tempIngredients}
      setTempIngredients={setTempIngredients}
      uncategorizedIngredients={uncategorizedIngredients}
    />
  ));

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
            <p>Ingredients:</p>
            {renderIngredientContainers}
            <Button type="button" onClick={() => addIngredient()}>
              Add Ingredient
            </Button>
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
                <button
                  type="button"
                  onClick={() => console.log(tempIngredients)}
                >
                  Ingredients
                </button>
                <button type="button" onClick={() => console.log(newCocktail)}>
                  Cocktail
                </button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}

function IngredientContainer({
  deleteIngredient,
  ingredientId,
  tempIngredients,
  setTempIngredients,
  uncategorizedIngredients,
}) {
  const [ingredientInfo, setIngredientInfo] = useState({
    name: "",
    amount: "",
    unit: "",
    type: "Core Ingredient",
    custom: false,
  });
  const [units, setUnits] = useState([
    { value: "oz", label: "oz" },
    { value: "tsp", label: "tsp" },
    { value: "tbs", label: "tbs" },
    { value: "dash", label: "dash" },
    { value: "dashes", label: "dashes" },
  ]);
  const [ingredientOptions, setIngredientOptions] = useState(
    uncategorizedIngredients.map((ingredient) => {
      return { value: ingredient, label: ingredient };
    })
  );

  useEffect(() => {
    updateTempIngredients();
  }, [ingredientInfo]);

  const updateTempIngredients = () => {
    const index = tempIngredients.findIndex(
      (ingredient) => ingredient._id === ingredientId
    );
    const arr = [...tempIngredients];
    arr[index] = { ...arr[index], ...ingredientInfo };
    setTempIngredients(arr);
  };

  const updateIngredientInfo = (key, value) => {
    setIngredientInfo({ ...ingredientInfo, [key]: value });
  };

  return (
    <Card style={{ margin: 16, padding: 16 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "50%", marginRight: 16 }}>
          <Label htmlFor={"ingName" + ingredientId}>Ingredient Name:</Label>
          {ingredientInfo.custom ? (
            <Input
              name={"ingName" + ingredientId}
              id={"ingName" + ingredientId}
              style={{}}
              value={ingredientInfo.name}
              onChange={(e) => updateIngredientInfo("name", e.target.value)}
            />
          ) : (
            <ReactSelect
              name={"ingName" + ingredientId}
              id={"ingName" + ingredientId}
              options={ingredientOptions}
              styles={dropdownStyles}
              defaultValue={ingredientInfo.name}
              onChange={(name) => updateIngredientInfo("name", name.value)}
            />
          )}
        </div>
        <div style={{ width: "45%" }}>
          <Label htmlFor={"amount" + ingredientId}>Amount:</Label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Input
              name={"amount" + ingredientId}
              id={"amount" + ingredientId}
              value={ingredientInfo.amount}
              style={{ width: "25%", marginRight: 8 }}
              onChange={(e) => {
                updateIngredientInfo("amount", e.target.value);
              }}
            />
            <ReactSelect
              options={units}
              onChange={(selectedItem) =>
                updateIngredientInfo("unit", selectedItem.value)
              }
              styles={dropdownStyles}
            />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Label htmlFor={"custom" + ingredientId}>Custom</Label>
          <Input
            className="mx-3"
            type="checkbox"
            name={"custom" + ingredientId}
            id={"custom" + ingredientId}
            onChange={(e) => {
              updateIngredientInfo("custom", !ingredientInfo.custom);
            }}
          />
        </div>
      </div>
      <p style={{ marginTop: 16, marginBottom: 8 }}>Type:</p>
      <div>
        <Input
          style={{ marginRight: 4 }}
          name={"coreIngredient" + ingredientId}
          id={"coreIngredient" + ingredientId}
          type="radio"
          value="coreIngredient"
          checked={ingredientInfo.type === "Core Ingredient"}
          onChange={() => updateIngredientInfo("type", "Core Ingredient")}
        />
        <Label
          htmlFor={"coreIngredient" + ingredientId}
          style={{ marginRight: 16 }}
        >
          Core Ingredient
        </Label>
        <Input
          style={{ marginRight: 4 }}
          name={"garnish" + ingredientId}
          id={"garnish" + ingredientId}
          type="radio"
          value="garnish"
          checked={ingredientInfo.type === "Garnish"}
          onChange={() => updateIngredientInfo("type", "Garnish")}
        />
        <Label htmlFor={"garnish" + ingredientId}>Garnish</Label>
        <Button
          onClick={() => deleteIngredient(ingredientId)}
          style={{ float: "right", marginTop: 0 }}
        >
          Delete Ingredient
        </Button>
      </div>
    </Card>
  );
}

const dropdownStyles = {
  menu: (provided, state) => ({
    ...provided,
    color: "black",
  }),
};

export default CocktailCreator;
