import React, { useState, useEffect } from 'react';
import IngredientDirectory from './IngredientDirectoryComponent';
import { Form, FormGroup, Button, Collapse, Label, Input } from 'reactstrap';

// Why doesn't the ingredient list update properly?

function CocktailCreator({ ingredients, addCocktail, cocktails }) {
  const [isOpenIngredients, setIsOpenIngredients] = useState(false);
  const [newCocktail, setNewCocktail] = useState({ id: null, name: '', requiredIngredients: [], recipe: '' });
  //const [ingredientList, setIngredientList] = useState([]);

  useEffect(() => {
    console.log(newCocktail);
  }, [newCocktail]);

  const toggleIngredients = () => setIsOpenIngredients(!isOpenIngredients);

  const updateNewCocktail = (e) => {
    console.log('cocktail updated');
    const { name, value } = e.target;
    setNewCocktail({...newCocktail, [name]: value})
  }

  const toggleIngredient = (ingredient) => {
    const newData = {...newCocktail};
    if (!newCocktail.requiredIngredients.includes(ingredient)) {
      newData.requiredIngredients = [...newData.requiredIngredients, ingredient]
      console.log(ingredient + ' has been added to list');
    } else {
      newData.requiredIngredients = newData.requiredIngredients.filter((item) => item !== ingredient)
    }
    setNewCocktail(newData);
  }
    // can these two functions be combined?
  // const removeIngredient = (unwantedIngredient) => {
  //   if (ingredientList.includes(unwantedIngredient)) {
  //     setIngredientList(ingredientList.filter((ingredient) => ingredient !== unwantedIngredient));
  //     setNewCocktail({...newCocktail, requiredIngredients: ingredientList});
  //     console.log(unwantedIngredient + ' has been removed from list');
  //   }
  // }

  const commitCocktail = (e) => {
    newCocktail.id = cocktails.length; //there has to be a better way to do this
    addCocktail(newCocktail);
    e.preventDefault();
  }

  return (
    <div className="container pt-3">
      <div className="row">
        <div className="col-12">
          <h2>Create Your Own Cocktail</h2>
          <hr />
        </div>
        <div className="col-md-10">
          <Form onSubmit={commitCocktail}>
            <FormGroup>
              <Label htmlFor="cocktailName">Cocktail Name: </Label>
              <Input type="text" id="name" name="name" className="form-control" placeholder="Cocktail Name"
                value={newCocktail.name}
                onChange={updateNewCocktail}
              />
            </FormGroup>
            <FormGroup row>
              <div className="col">
              <Label>Required Ingredients</Label>{' '}
                <Button
                  color="secondary"
                  onClick={toggleIngredients}
                  style={{
                    marginBottom: '1rem'
                  }}>
                  Toggle Ingredients
                </Button>
                <Collapse isOpen={isOpenIngredients}>
                  <IngredientDirectory ingredients={ingredients} toggleIngredient={toggleIngredient} />
                </Collapse>
              </div>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="recipe">Recipe: </Label>
              <Input type="text" id="recipe" name="recipe" className="form-control" placeholder="Recipe"
                value={newCocktail.recipe}
                onChange={updateNewCocktail}
              />
            </FormGroup>
            <FormGroup row>
              <div className="col">
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CocktailCreator;