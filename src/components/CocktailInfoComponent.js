import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardImg, CardBody, CardSubtitle, CardTitle } from 'reactstrap';

function RenderCocktail({ cocktail }) {
  return (
    <div className="col-md-5 m-1">
      <Card>
        <CardTitle className="mx-auto mt-2">{cocktail.name}</CardTitle>
        <CardBody>
        <CardImg src={cocktail.image} width="30"></CardImg>
          <CardSubtitle className="mb-2 text-muted">Ingredients:</CardSubtitle>
          <ul>
            {cocktail.requiredIngredients.map((ingredient, index) => {
              return <li key={index}>{ingredient[0].toUpperCase() + ingredient.slice(1)}</li>
            })}
          </ul>
          {cocktail.recipe}
        </CardBody>
      </Card>
    </div>
  );
}

function CocktailInfo(props) {
  let { id } = useParams();
    //console.log(id);
  if (props.cocktails) {
    const cocktail = props.cocktails[id];

    //console.log(props.cocktail);
    return (
      <div className="container">
        <div className="row">
          <RenderCocktail cocktail={cocktail} />
        </div>
      </div>
    );
  }
  return <div />
}

export default CocktailInfo;