import React from 'react';
import { Card, CardTitle, Label, Input } from 'reactstrap';

function RenderIngredientItem({ ingredient }) {
  return (
    <Card>
      <Label className='pt-2' check>
        <Input className='mx-3' type='checkbox' name={ingredient} />
        {' ' + ingredient}
      </Label>
    </Card>
  );
}

function IngredientDirectory({ ingredients }) {
  const directory = ingredients.map((ingredient, index) => {
    return (
      <div key={index} className="col-6 col-md-4 col-lg-3 my-1">
        <RenderIngredientItem ingredient={ingredient} />
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