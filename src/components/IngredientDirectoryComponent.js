import React from "react";
import { Card, Label, Input } from "reactstrap";

function RenderIngredientItem({ ingredient, toggleIngredient, isChecked }) {
  return (
    <Card>
      <Label className="pt-2" check>
        <Input
          className="mx-3"
          type="checkbox"
          name={ingredient.name}
          onChange={(e) => {
            toggleIngredient(e.target.name);
          }}
          checked={isChecked}
        />
        {" " + ingredient.name}
      </Label>
    </Card>
  );
}

function IngredientDirectory(props) {
  const directory = props.ingredientCategories.map((category, index) => {
    return (
      <div key={index} className="mt-3">
        <h3>{category}</h3>
        <div className="row mx-auto">
          {props.ingredients[category].map((ingredient, index) => {
            return (
              <div
                key={index}
                className="col-12 col-sm-6 col-lg-4 col-xl-3 p-1"
              >
                <RenderIngredientItem
                  ingredient={ingredient}
                  toggleIngredient={props.toggleIngredient}
                  prefilledList={props.prefilledList}
                  isChecked={props?.prefilledList?.includes(ingredient.name)}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div className="container pt-3">
      <div className="row">{directory}</div>
    </div>
  );
}

export default IngredientDirectory;
