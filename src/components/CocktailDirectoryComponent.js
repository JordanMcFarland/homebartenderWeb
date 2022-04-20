import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardImgOverlay, CardTitle } from 'reactstrap';

function RenderDirectoryItem({ cocktail }) {
  return (
    <Card>
      <Link to={`/directory/${cocktail.id}`}>
        <CardImg src={cocktail.image} alt={cocktail.name} width="30"></CardImg>
        <CardImgOverlay>
          <CardTitle>{cocktail.name}</CardTitle>
        </CardImgOverlay>
      </Link>
    </Card>
  );
}

function CocktailDirectory(props) {
  const directory = props.cocktails.map(cocktail => {
    return (
      <div key={cocktail.id} className="col-md-5 m-1">
        <RenderDirectoryItem cocktail={cocktail} />
      </div>
    )
  });


  return (
    <div className="container">
      <div className="row">
        {directory}
      </div>
    </div>
  );
}

export default CocktailDirectory;