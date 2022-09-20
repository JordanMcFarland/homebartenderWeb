import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardImg,
  CardBody,
  CardSubtitle,
  CardTitle,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function RenderCocktail({ cocktail, ...props }) {
  const [buttonDropdownIsOpen, toggleButtonDropDown] = useState(false);

  return (
    <div className={"col-lg-7 col-md-9 mx-auto"}>
      <Card style={{ backgroundColor: "#810D21" }}>
        <div className="row pt-2 px-1 mx-3">
          <CardTitle className="col-11">{cocktail.name}</CardTitle>
          <div className="col-1">
            <ButtonDropdown
              isOpen={buttonDropdownIsOpen}
              toggle={() => toggleButtonDropDown(!buttonDropdownIsOpen)}
            >
              <DropdownToggle caret />
              <DropdownMenu>
                <DropdownItem onClick={() => props.toggleFavorite(cocktail)}>
                  {props.favorites.some(
                    (favorite) =>
                      favorite._id.toString() === cocktail._id.toString()
                  )
                    ? "Unfavorite"
                    : "Favorite"}
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </div>
        <CardBody className="mx-3">
          <CardImg src={cocktail.image} width="30"></CardImg>
          <CardSubtitle className="mb-2 text-muted">Ingredients:</CardSubtitle>
          <ul>
            {cocktail.requiredIngredients.map((ingredient, index) => {
              return (
                <li key={index}>
                  {ingredient[0].toUpperCase() + ingredient.slice(1)}
                </li>
              );
            })}
          </ul>
          {cocktail.recipe}
        </CardBody>
      </Card>
    </div>
  );
}

function CocktailInfo(props) {
  let { _id } = useParams();
  if (props.cocktails) {
    const cocktail = props.cocktails.filter((cocktail) => {
      return cocktail._id.toString() === _id;
    })[0];

    if (cocktail) {
      return (
        <div className="container py-3">
          <div className="row">
            <RenderCocktail
              cocktail={cocktail}
              toggleFavorite={props.toggleFavorite}
              favorites={props.favorites}
              ingredients={props.ingredients}
              ingredientCategories={props.ingredientCategories}
              _id={_id}
            />
          </div>
        </div>
      );
    }
  }
  return <div />;
}

export default CocktailInfo;
