import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import { Form, FormGroup, Button, Label, Input, Card } from "reactstrap";

function UserCocktailEditor({
  ingredients,
  ingredientCategories,
  uncategorizedIngredients,
  ...props
}) {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [editingCocktailInfo, setEditingCocktailInfo] = useState({
    name: "",
    requiredIngredients: [],
    recipe: "",
    image: "",
  });
  const [tempIngredients, setTempIngredients] = useState([]);
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
      setEditingCocktailInfo({
        ...editingCocktailInfo,
        requiredIngredients: trimmedIngredients,
      });
    };

    saveIngredients();
  }, [tempIngredients]);

  useEffect(() => {
    function populateCocktailInfo() {
      let counter = 0;
      const cocktail = props.userCocktails?.filter(
        (cocktail) => cocktail._id === _id
      )[0];

      // Get cocktail info and populate editing cocktail state
      if (cocktail) {
        const { name, requiredIngredients, recipe, image } = cocktail;
        setEditingCocktailInfo({ name, requiredIngredients, recipe, image });

        // get ingredients and give them each an index, update tempingredients state
        const indexedIngredients = cocktail.requiredIngredients.map(
          (ingredient) => {
            const ingredientWithId = { ...ingredient, _id: counter };
            counter++;
            return ingredientWithId;
          }
        );

        setNextIngredientId(counter);
        setTempIngredients(indexedIngredients);
      }
    }
    populateCocktailInfo();
  }, []);

  const updateEditingCocktailInfo = (e) => {
    const { name, value } = e.target;
    setEditingCocktailInfo({ ...editingCocktailInfo, [name]: value });
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

  const updateUserCocktail = async (e) => {
    e.preventDefault();
    try {
      await props.onUpdateUserCocktail(_id, editingCocktailInfo);
      navigate("/mycocktails");
    } catch (err) {
      alert(err);
    }
  };

  const deleteUserCocktail = async (_id) => {
    try {
      await props.onDeleteUserCocktail(_id);
      navigate("/mycocktails");
    } catch (err) {
      alert(err);
    }
  };

  const getImage = (e) => {
    console.log(e.target.files[0].name);
    let img = e.target.files[0];
    setEditingCocktailInfo({
      ...editingCocktailInfo,
      image: URL.createObjectURL(img),
    });
  };

  const renderIngredientContainers = tempIngredients.map((ingredient) => (
    <IngredientContainer
      key={ingredient._id}
      deleteIngredient={deleteIngredient}
      ingredient={ingredient}
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
          <Form onSubmit={updateUserCocktail}>
            <FormGroup>
              <Label htmlFor="cocktailName">Cocktail Name: </Label>
              <Input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Cocktail Name"
                value={editingCocktailInfo.name}
                onChange={updateEditingCocktailInfo}
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
                value={editingCocktailInfo.recipe}
                onChange={updateEditingCocktailInfo}
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
                <Button
                  style={{ float: "right" }}
                  type="submit"
                  color="primary"
                >
                  Save Changes
                </Button>
                <Button
                  style={{ float: "right", marginRight: 16 }}
                  type="button"
                  color="secondary"
                  onClick={() => deleteUserCocktail(_id)}
                >
                  Delete Cocktail
                </Button>
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
  ingredient,
  ingredientId,
  tempIngredients,
  setTempIngredients,
  uncategorizedIngredients,
}) {
  const [ingredientInfo, setIngredientInfo] = useState({
    name: ingredient.name ? ingredient.name : "",
    amount: ingredient.amount ? ingredient.amount : "",
    unit: ingredient.unit ? ingredient.unit : "",
    type: ingredient.type ? ingredient.type : "Core Ingredient",
    custom: ingredient.custom ? ingredient.custom : false,
  });
  const [units, setUnits] = useState([
    { value: "oz", label: "oz" },
    { value: "tsp", label: "tsp" },
    { value: "tbs", label: "tbs" },
    { value: "dash", label: "dash" },
    { value: "dashes", label: "dashes" },
  ]);
  const [ingredientOptions, setIngredientOptions] = useState(
    uncategorizedIngredients.map((ing) => {
      return { value: ing, label: ing };
    })
  );

  useEffect(() => {
    updateTempIngredients();
  }, [ingredientInfo]);

  const updateTempIngredients = () => {
    const index = tempIngredients.findIndex((ing) => ing._id === ingredientId);
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
              defaultInputValue={ingredientInfo.name}
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
              defaultInputValue={ingredientInfo.unit}
              styles={dropdownStyles}
            />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Label htmlFor={"custom" + ingredientId}>Custom</Label>
          <Input
            checked={ingredientInfo.custom}
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

export default UserCocktailEditor;
