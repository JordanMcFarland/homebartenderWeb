import React from "react";
import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

const FavoriteComponent = (props) => {
  const favoriteDirectory = props.favorites.map((cocktail, index) => {
    return (
      <div key={index} className="col-md-5 m-1">
        <Card style={{ minHeight: 60 }}>
          <Link
            to={
              cocktail.userCreated
                ? `/mycocktails/${cocktail.id}`
                : `/directory/${cocktail.id}`
            }
          >
            {cocktail.image ? (
              <CardImg src={cocktail.image} alt={cocktail.name} width="30" />
            ) : (
              <div />
            )}
            <CardImgOverlay>
              <CardTitle>{cocktail.name}</CardTitle>
            </CardImgOverlay>
          </Link>
        </Card>
      </div>
    );
  });

  if (props.favorites.length) {
    return (
      <div className="container">
        <div className="row">{favoriteDirectory}</div>
      </div>
    );
  } else return <div>You have no favorites</div>;
};

export default FavoriteComponent;
