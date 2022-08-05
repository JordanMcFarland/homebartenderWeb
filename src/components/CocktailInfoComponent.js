import React, { useState } from "react";
import IngredientDirectory from "./IngredientDirectoryComponent";
import { useParams, useNavigate } from "react-router-dom";
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
  const [editedCocktail, setEditedCocktail] = useState({ ...cocktail });
  const [isOpenIngredients, setIsOpenIngredients] = useState(false);
  const navigate = useNavigate();

  const updateEditedCocktail = (e) => {
    const { name, value } = e.target;
    setEditedCocktail({ ...editedCocktail, [name]: value });
  };

  const toggleIngredient = (ingredient) => {
    // set this up to set the edited cocktail list
    // the edited cocktail is now providing the props for all the components if editing is true
    const newData = { ...editedCocktail };
    const upperCaseIngredients = newData.requiredIngredients.map((ingredient) =>
      ingredient.toUpperCase()
    );
    if (!upperCaseIngredients.includes(ingredient.toUpperCase())) {
      newData.requiredIngredients = [
        ...newData.requiredIngredients,
        ingredient,
      ];
      console.log(ingredient + " has been added to list");
    } else {
      newData.requiredIngredients = newData.requiredIngredients.filter(
        (item) => item.toUpperCase() !== ingredient.toUpperCase()
      );
    }
    setEditedCocktail(newData);
  };

  return (
    <div className={editing ? "col-12" : "col-lg-7 col-md-9 mx-auto"}>
      <Card
        style={
          editing
            ? { backgroundColor: "#262626" }
            : { backgroundColor: "#810D21" }
        }
      >
        <div className="row pt-2 px-1 mx-3">
          <CardTitle className="col-11">
            {editing ? (
              <>
                <Label htmlFor="name">Cocktail Name: </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editedCocktail.name}
                  onChange={(e) => {
                    updateEditedCocktail(e);
                  }}
                />
              </>
            ) : (
              cocktail.name
            )}
          </CardTitle>
          <div className="col-1">
            <ButtonDropdown
              isOpen={buttonDropdownIsOpen}
              toggle={() => toggleButtonDropDown(!buttonDropdownIsOpen)}
            >
              <DropdownToggle caret />
              <DropdownMenu>
                {editing ? (
                  <DropdownItem onClick={() => toggleEdit(false)}>
                    Cancel
                  </DropdownItem>
                ) : (
                  <>
                    <DropdownItem
                      onClick={() => props.toggleFavorite(cocktail)}
                    >
                      {props.favorites.some(
                        (favorite) =>
                          favorite._id.toString() === cocktail._id.toString()
                      )
                        ? "Unfavorite"
                        : "Favorite"}
                    </DropdownItem>
                    {cocktail.userId ? (
                      <>
                        <DropdownItem onClick={() => toggleEdit(true)}>
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => props.onDeleteCocktail(cocktail._id)}
                        >
                          Delete
                        </DropdownItem>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </div>
        <CardBody className="mx-3">
          <CardImg src={cocktail.image} width="30"></CardImg>
          <CardSubtitle className="mb-2 text-muted">
            {editing ? "" : "Ingredients:"}
          </CardSubtitle>
          {editing ? (
            <div>
              <Label>Required Ingredients:</Label>{" "}
              <Button
                className="my-auto py-0"
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
                  ingredientCategories={props.ingredientCategories}
                  toggleIngredient={toggleIngredient}
                  prefilledList={editedCocktail.requiredIngredients}
                />
              </Collapse>
            </div>
          ) : (
            <ul>
              {cocktail.requiredIngredients.map((ingredient, index) => {
                return (
                  <li key={index}>
                    {ingredient[0].toUpperCase() + ingredient.slice(1)}
                  </li>
                );
              })}
            </ul>
          )}
          {editing ? (
            <>
              <Label htmlFor="recipe">Recipe: </Label>
              <Input
                type="textarea"
                id="recipe"
                name="recipe"
                defaultValue={editedCocktail.recipe}
                rows="3"
                onChange={updateEditedCocktail}
              />
              <Button
                color="primary"
                onClick={() => {
                  props.onUpdateUserCocktail(
                    editedCocktail._id,
                    editedCocktail
                  );
                  toggleEdit(false);
                  navigate(`/mycocktails/${props._id}`);
                }}
                style={{
                  margin: "1rem",
                }}
              >
                Submit
              </Button>
            </>
          ) : (
            cocktail.recipe
          )}
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
              onDeleteCocktail={props.onDeleteCocktail}
              onUpdateUserCocktail={props.onUpdateUserCocktail}
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
