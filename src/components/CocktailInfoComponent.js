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
    <div className="col-lg-7 col-md-9 mx-auto">
      <Card>
        <div className="row pt-2 mx-3">
          <div className="col-8 offset-2">
            <CardTitle className="d-flex justify-content-center">
              {cocktail.name}
            </CardTitle>
          </div>
          <div className="col-1 offset-1">
            <ButtonDropdown
              isOpen={buttonDropdownIsOpen}
              toggle={() => toggleButtonDropDown(!buttonDropdownIsOpen)}
            >
              <DropdownToggle caret />
              <DropdownMenu>
                <DropdownItem onClick={() => props.addFavorite(cocktail.id)}>
                  Favorite
                </DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem onClick={() => props.deleteCocktail(cocktail)}>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </div>
        <CardBody>
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
  let { id } = useParams();

  if (props.cocktails) {
    const cocktail = props.cocktails.filter(
      (cocktail) => cocktail.id === Number(id)
    )[0];

    return (
      <div className="container py-3">
        <div className="row">
          <RenderCocktail
            cocktail={cocktail}
            deleteCocktail={props.deleteCocktail}
            addFavorite={props.addFavorite}
          />
        </div>
      </div>
    );
  }
  return <div />;
}

export default CocktailInfo;
