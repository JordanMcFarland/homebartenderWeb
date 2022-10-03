import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [favorite, setFavorite] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isFavorite = props.user.userFavorites.some(
      (favorite) => favorite._id.toString() === cocktail._id.toString()
    );

    setFavorite(isFavorite);
  }, [props.user.userFavorites]);

  const deleteUserCocktail = async (_id) => {
    try {
      await props.onDeleteUserCocktail(_id);
      navigate("/mycocktails");
    } catch (err) {
      alert(err);
    }
  };

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
                <DropdownItem
                  onClick={() => navigate(`/cocktaileditor/${cocktail._id}`)}
                >
                  Edit
                </DropdownItem>
                <DropdownItem onClick={() => deleteUserCocktail(cocktail._id)}>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </div>
        <div
          className="row"
          style={{ marginTop: 8, flexDirection: "row-reverse" }}
        >
          <FontAwesomeIcon
            className="col-1"
            icon={favorite ? faHeart : emptyHeart}
            fontSize={24}
            onClick={() => props.toggleFavorite(cocktail)}
          />
        </div>
        <CardBody className="mx-3">
          <CardImg src={cocktail.image} width="30"></CardImg>
          <CardSubtitle className="mb-2 text-muted">Ingredients:</CardSubtitle>
          <ul>
            {cocktail.requiredIngredients.map((ingredient, index) => {
              const ingredientString =
                `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`.replace(
                  /  +/g,
                  " "
                );
              return <li key={index}>{ingredientString}</li>;
            })}
          </ul>
          {cocktail.recipe}
        </CardBody>
      </Card>
    </div>
  );
}

function MyCocktailInfo(props) {
  let { _id } = useParams();
  if (props.userCocktails) {
    const cocktail = props.userCocktails.filter((cocktail) => {
      return cocktail._id.toString() === _id;
    })[0];

    if (cocktail) {
      return (
        <div className="container py-3">
          <div className="row">
            <RenderCocktail
              cocktail={cocktail}
              onDeleteUserCocktail={props.onDeleteUserCocktail}
              onUpdateUserCocktail={props.onUpdateUserCocktail}
              toggleFavorite={props.toggleFavorite}
              favorites={props.favorites}
              ingredients={props.ingredients}
              ingredientCategories={props.ingredientCategories}
              _id={_id}
              user={props.user}
            />
          </div>
        </div>
      );
    }
  }
  return <div />;
}

export default MyCocktailInfo;
