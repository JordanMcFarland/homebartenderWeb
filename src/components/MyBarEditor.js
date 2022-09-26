import React, { useEffect, useState } from "react";
import { Button, Card, Input, Label } from "reactstrap";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";

function MyBarEditor({
  user,
  ingredients,
  ingredientCategories,
  onUpdateUserBar,
}) {
  const [tempUserBar, setTempUserBar] = useState({ ...user.userBar });
  const [currentCategory, setCurrentCategory] = useState(
    ingredientCategories[0]
  );
  const [categoryOptions, setCategoryOptions] = useState(
    ingredientCategories.map((category) => ({
      value: category,
      label: category,
    }))
  );
  const navigate = useNavigate();

  function ingredientChecked(ingredientId) {
    if (tempUserBar[currentCategory]) {
      return tempUserBar[currentCategory].some(
        (ing) => ing._id === ingredientId
      );
    } else return false;
  }

  function updateCurrentCategory(option) {
    setCurrentCategory(option);
  }

  function toggleIngredient(ingredient) {
    let updatedIngredientCategoryArray = [];
    if (!tempUserBar[currentCategory]) {
      tempUserBar[currentCategory] = [];
    }

    if (
      tempUserBar[currentCategory].some((ing) => ing._id === ingredient._id)
    ) {
      updatedIngredientCategoryArray = tempUserBar[currentCategory].filter(
        (ing) => ing._id !== ingredient._id
      );
    } else {
      updatedIngredientCategoryArray = [
        ...tempUserBar[currentCategory],
        ingredient,
      ];
    }
    setTempUserBar({
      ...tempUserBar,
      [currentCategory]: updatedIngredientCategoryArray,
    });
  }

  async function handleSubmit() {
    try {
      await onUpdateUserBar(tempUserBar);
      navigate("/mybar");
    } catch (err) {
      alert(err);
    }
  }

  const renderIngredients = ingredients[currentCategory].map((ingredient) => {
    return (
      <div
        key={ingredient._id}
        className="col-sm-6 col-md-4 col-lg-3"
        style={{ padding: 4 }}
      >
        <Card
          key={ingredient._id}
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 8,
            alignItems: "center",
          }}
        >
          <Input
            type="checkbox"
            style={{ marginRight: 8, marginTop: 0 }}
            name={ingredient.name}
            id={ingredient._id}
            checked={ingredientChecked(ingredient._id)}
            onChange={() => toggleIngredient(ingredient)}
          />
          <Label style={{ marginBottom: 0 }} htmlFor={ingredient._id}>
            {ingredient.name}
          </Label>
        </Card>
      </div>
    );
  });

  return (
    <div className="container mt-3">
      <div className="row">
        <Label
          className="col-3 col-sm-2 col-lg-1 align-self-center"
          htmlFor="ingredientCategory"
        >
          Category:{" "}
        </Label>
        <ReactSelect
          defaultValue={categoryOptions[0]}
          options={categoryOptions}
          id="ingredientCategory"
          name="ingredientCategory"
          className="col-9 col-md-6 col-lg-4"
          styles={dropdownStyles}
          onChange={(selectedItem) => updateCurrentCategory(selectedItem.value)}
        />
      </div>
      <div className="row mt-3">{renderIngredients}</div>
      <div className="row">
        <div className="col" style={{ padding: 4 }}>
          <Button style={{ float: "right" }} onClick={() => handleSubmit()}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

const dropdownStyles = {
  menu: (provided, state) => ({
    ...provided,
    color: "black",
  }),
};

export default MyBarEditor;
