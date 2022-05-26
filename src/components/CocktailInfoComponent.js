import React, { useState } from "react";
import IngredientDirectory from "./IngredientDirectoryComponent";
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
  Input,
  Label,
  Button,
  Collapse,
} from "reactstrap";

function RenderCocktail({ cocktail, ...props }) {
  const [buttonDropdownIsOpen, toggleButtonDropDown] = useState(false);
  const [editing, toggleEdit] = useState(false);
  const [editedCocktail, setEditedCocktail] = useState(cocktail);
  const [isOpenIngredients, setIsOpenIngredients] = useState(false);

  const toggleIngredient = () => {
    console.log("toggled");
  };

  if (!editing) {
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
                  <DropdownItem
                    onClick={() => props.toggleFavorite(cocktail.id)}
                  >
                    {props.favorites.includes(cocktail.id)
                      ? "Unfavorite"
                      : "Favorite"}
                  </DropdownItem>
                  <DropdownItem onClick={() => toggleEdit(true)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem onClick={() => props.deleteCocktail(cocktail)}>
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </div>
          <CardBody>
            <CardImg src={cocktail.image} width="30"></CardImg>
            <CardSubtitle className="mb-2 text-muted">
              Ingredients:
            </CardSubtitle>
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
  } else {
    return (
      <div className="col-lg-7 col-md-9 mx-auto">
        <Card>
          <div className="row pt-2 mx-3">
            <div className="col-8 offset-2">
              <CardTitle>
                <Label htmlFor="name">Cocktail Name: </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={cocktail.name}
                />
              </CardTitle>
            </div>
            <div className="col-1 offset-1">
              <ButtonDropdown
                isOpen={buttonDropdownIsOpen}
                toggle={() => toggleButtonDropDown(!buttonDropdownIsOpen)}
              >
                <DropdownToggle caret />
                <DropdownMenu>
                  <DropdownItem onClick={() => toggleEdit(false)}>
                    Cancel
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </div>
          <CardBody>
            <CardImg src={cocktail.image} width="30"></CardImg>
            <CardSubtitle className="mb-2 text-muted">
              Ingredients:
            </CardSubtitle>
            <div>
              <Label>Required Ingredients</Label>{" "}
              <Button
                color="secondary"
                onClick={() => setIsOpenIngredients(!isOpenIngredients)}
                style={{
                  marginBottom: "1rem",
                }}
              >
                Toggle Ingredients
              </Button>
              <Collapse isOpen={isOpenIngredients}>
                <IngredientDirectory
                  ingredients={props.ingredients}
                  toggleIngredient={toggleIngredient}
                  prefilledList={cocktail.requiredIngredients}
                />
              </Collapse>
            </div>
            <Label htmlFor="recipe">Recipe: </Label>
            <Input
              type="textarea"
              id="recipe"
              name="recipe"
              defaultValue={cocktail.recipe}
              rows="3"
            />
          </CardBody>
        </Card>
      </div>
    );
  }
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
            toggleFavorite={props.toggleFavorite}
            favorites={props.favorites}
            ingredients={props.ingredients}
          />
        </div>
      </div>
    );
  }
  return <div />;
}

export default CocktailInfo;
