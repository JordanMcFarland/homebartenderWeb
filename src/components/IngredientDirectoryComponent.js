import React, { useState, useEffect } from "react";
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
  const directory = props.ingredients.map((ingredient, index) => {
    return (
      <div key={index} className="col-6 col-md-4 col-lg-3 my-1">
        <RenderIngredientItem
          ingredient={ingredient}
          toggleIngredient={props.toggleIngredient}
          prefilledList={props.prefilledList}
          isChecked={props?.prefilledList?.includes(ingredient)}
        />
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
