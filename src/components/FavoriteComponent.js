import React from "react";
import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

const FavoriteComponent = (props) => {
  const favoriteDirectory = props.cocktails
    .filter((cocktail) => props.favorites.includes(cocktail.id))
    .map((cocktail) => {
      return (
        <div key={cocktail.id} className="col-md-5 m-1">
          <Card>
            <Link to={`/directory/${cocktail.id}`}>
              <CardImg
                src={cocktail.image}
                alt={cocktail.name}
                width="30"
              ></CardImg>
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
