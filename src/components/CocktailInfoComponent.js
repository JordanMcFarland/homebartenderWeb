import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardImg, CardBody, CardSubtitle, CardTitle, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function RenderCocktail({ cocktail }) {
  const [buttonDropdownIsOpen, toggleButtonDropDown] = useState(false);

  return (
    <div className="col-lg-7 col-md-9 mx-auto">
      <Card>
        <div className="row pt-2 mx-3">
          <div className="col-8 offset-2">
            <CardTitle className="d-flex justify-content-center">{cocktail.name}</CardTitle>
          </div>
          <div className="col-1 offset-1">
            <ButtonDropdown isOpen={buttonDropdownIsOpen} toggle={() => toggleButtonDropDown(!buttonDropdownIsOpen)}>
              <DropdownToggle caret />
              <DropdownMenu>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </div>
        <CardBody>
        <CardImg src={cocktail.image} width="30"></CardImg>
          <CardSubtitle className="mb-2 text-muted">Ingredients:</CardSubtitle>
          <ul>
            {cocktail.requiredIngredients.map((ingredient, index) => {
              return <li key={index}>{ingredient[0].toUpperCase() + ingredient.slice(1)}</li>
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
    //console.log(id);
  if (props.cocktails) {
    const cocktail = props.cocktails[id];

    //console.log(props.cocktail);
    return (
      <div className="container py-3">
        <div className="row">
          <RenderCocktail cocktail={cocktail} />
        </div>
      </div>
    );
  }
  return <div />
}

export default CocktailInfo;