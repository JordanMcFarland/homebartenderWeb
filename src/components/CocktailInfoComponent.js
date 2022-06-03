import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (editedCocktail) {
      console.log("Ingredients: ", editedCocktail.requiredIngredients);
    }
  }, [editedCocktail?.requiredIngredients]);

  useEffect(() => {
    console.log("Original Cocktail: ", cocktail);
  }, [cocktail]);

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

  // if (!editing) {
  return (
    <div className="col-lg-7 col-md-9 mx-auto">
      <Card>
        <div className="row pt-2 mx-3">
          <div className="col-8 offset-2">
            <CardTitle className="d-flex justify-content-center">
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
                      console.log(cocktail.name);
                    }}
                  />
                </>
              ) : (
                cocktail.name
              )}
            </CardTitle>
          </div>
          <div className="col-1 offset-1">
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
                      {props.favorites.includes(cocktail)
                        ? "Unfavorite"
                        : "Favorite"}
                    </DropdownItem>
                    {cocktail.userCreated ? (
                      <>
                        <DropdownItem onClick={() => toggleEdit(true)}>
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => props.deleteCocktail(cocktail)}
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
        <CardBody>
          <CardImg src={cocktail.image} width="30"></CardImg>
          <CardSubtitle className="mb-2 text-muted">Ingredients:</CardSubtitle>
          {editing ? (
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
                  props.commitEditedCocktail(editedCocktail);
                  toggleEdit(false);
                  navigate(`/mycocktails/${props.id}`);
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
  // } else {
  //   return (
  //     <div className="col-lg-7 col-md-9 mx-auto">
  //       <Card>
  //         <div className="row pt-2 mx-3">
  //           <div className="col-8 offset-2">
  //             <CardTitle>
  //               <Label htmlFor="name">Cocktail Name: </Label>
  //               <Input
  //                 type="text"
  //                 id="name"
  //                 name="name"
  //                 defaultValue={editedCocktail.name}
  //                 onChange={updateEditedCocktail}
  //               />
  //             </CardTitle>
  //           </div>
  //           <div className="col-1 offset-1">
  //             <ButtonDropdown
  //               isOpen={buttonDropdownIsOpen}
  //               toggle={() => toggleButtonDropDown(!buttonDropdownIsOpen)}
  //             >
  //               <DropdownToggle caret />
  //               <DropdownMenu>
  //                 <DropdownItem onClick={() => toggleEdit(false)}>
  //                   Cancel
  //                 </DropdownItem>
  //               </DropdownMenu>
  //             </ButtonDropdown>
  //           </div>
  //         </div>
  //         <CardBody>
  //           <CardImg src={editedCocktail.image} width="30"></CardImg>
  //           <CardSubtitle className="mb-2 text-muted">
  //             Ingredients:
  //           </CardSubtitle>
  //           <div>
  //             <Label>Required Ingredients</Label>{" "}
  //             <Button
  //               color="secondary"
  //               onClick={() => setIsOpenIngredients(!isOpenIngredients)}
  //               style={{
  //                 marginBottom: "1rem",
  //               }}
  //             >
  //               Toggle Ingredients
  //             </Button>
  //             <Collapse isOpen={isOpenIngredients}>
  //               <IngredientDirectory
  //                 ingredients={props.ingredients}
  //                 toggleIngredient={toggleIngredient}
  //                 prefilledList={editedCocktail.requiredIngredients}
  //               />
  //             </Collapse>
  //           </div>
  //           <Label htmlFor="recipe">Recipe: </Label>
  //           <Input
  //             type="textarea"
  //             id="recipe"
  //             name="recipe"
  //             defaultValue={editedCocktail.recipe}
  //             rows="3"
  //             onChange={updateEditedCocktail}
  //           />
  //           <Button
  //             color="primary"
  //             onClick={() => {
  //               props.commitEditedCocktail(editedCocktail);
  //               toggleEdit(false);
  //               navigate(`/directory/${props.id}`);
  //             }}
  //             style={{
  //               margin: "1rem",
  //             }}
  //           >
  //             Submit
  //           </Button>
  //         </CardBody>
  //       </Card>
  //     </div>
  //   );
  // }
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
            commitEditedCocktail={props.commitEditedCocktail}
            id={id}
          />
        </div>
      </div>
    );
  }
  return <div />;
}

export default CocktailInfo;
