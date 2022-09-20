import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

function MyBarEditor({ user, ingredients, ingredientCategories }) {
  const [tempUserBar, setTempUserBar] = useState({ ...user.userBar });
  const [currentCategory, setCurrentCategory] = useState(
    ingredientCategories[0]
  );

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

  const renderIngredients = ingredients[currentCategory].map((ingredient) => {
    return <Card></Card>;
  });
}

export default MyBarEditor;
