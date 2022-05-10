import React, { useState, useEffect } from 'react';
import { Card, Label, Input } from 'reactstrap';

function RenderIngredientItem({ ingredient, updateIngredientList, removeIngredient }) {
  const handleChange = (e) => {
    const checked = e.target.checked;
    console.log(checked)
    if (checked) {updateIngredientList(ingredient);}
    if (!checked) {removeIngredient(ingredient);}
  }

  return (
    <Card>
      <Label className='pt-2' check>
        <Input className='mx-3' type='checkbox' name={ingredient}
        onChange={handleChange}
        />
        {' ' + ingredient}
      </Label>
    </Card>
  );
}

function IngredientDirectory({ ingredients, ...props }) {

  const directory = ingredients.map((ingredient, index) => {
    return (
      <div key={index} className="col-6 col-md-4 col-lg-3 my-1">
        <RenderIngredientItem ingredient={ingredient} updateIngredientList={props.updateIngredientList} removeIngredient={props.removeIngredient} />
      </div>
    )
  });


  return (
    <div className="container pt-3">
      <div className="row">
        {directory}
      </div>
    </div>
  );
}

export default IngredientDirectory;