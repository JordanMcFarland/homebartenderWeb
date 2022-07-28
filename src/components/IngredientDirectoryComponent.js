import React, { useState, useEffect } from "react";
import { Card, Label, Input } from "reactstrap";

function RenderIngredientItem({ ingredient, toggleIngredient, isChecked }) {
  return (
    <Card className="col-6 col-md-4 col-lg-3 my-1">
      <Label className="pt-2" check>
        <Input
          className="mx-3"
          type="checkbox"
          name={ingredient}
          onChange={(e) => {
            toggleIngredient(e.target.name);
          }}
          checked={isChecked}
        />
        {" " + ingredient}
      </Label>
    </Card>
  );
}

function IngredientDirectory(props) {
  const directory = props.ingredientCategories.map((category, index) => {
    return (
      <div key={index}>
        <h4>{category}</h4>
        {props.ingredients[category].map((ingredient, index) => {
          return (
            <div key={index}>
              <RenderIngredientItem
                ingredient={ingredient}
                toggleIngredient={props.toggleIngredient}
                prefilledList={props.prefilledList}
                isChecked={props?.prefilledList?.includes(ingredient)}
                index={index}
              />
            </div>
          );
        })}
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
