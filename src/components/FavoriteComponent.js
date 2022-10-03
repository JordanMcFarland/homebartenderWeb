import React, { useEffect } from "react";
import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const FavoriteComponent = ({ onGetUserFavorites, ...props }) => {
  useEffect(() => {
    onGetUserFavorites();
  }, []);

  const favoriteDirectory = props.favorites.map((cocktail) => {
    if (cocktail && cocktail.name) {
      return (
        <div key={cocktail._id} className="col-md-5 m-1">
          <Card style={{ minHeight: 60 }}>
            {cocktail.userId && (
              <FontAwesomeIcon
                icon={faUser}
                style={{ position: "absolute", right: 8, top: 20 }}
              />
            )}
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
              <CardTitle
                style={{
                  marginTop: 16,
                  marginLeft: 8,
                  display: "inline-flex",
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
              >
                {cocktail.name}
              </CardTitle>
            </Link>
          </Card>
        </div>
      );
    } else return;
  });

  if (props.favorites.length) {
    return (
      <div className="container">
        <div className="row pt-3">{favoriteDirectory}</div>
      </div>
    );
  } else return <div>You have no favorites</div>;
};

export default FavoriteComponent;
