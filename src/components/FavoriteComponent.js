import React, { useEffect } from "react";
import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

const FavoriteComponent = (props) => {
  useEffect(() => {
    props.onGetUserFavorites();
  }, []);

  const favoriteDirectory = props.favorites.map((cocktail) => {
    if (cocktail && cocktail.name) {
      return (
        <div key={cocktail._id} className="col-md-5 m-1">
          <Card style={{ minHeight: 60 }}>
            <Link
              to={
                cocktail.userId
                  ? `/mycocktails/${cocktail._id}`
                  : `/directory/${cocktail._id}`
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
    } else return <div key={cocktail._id} />;
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
