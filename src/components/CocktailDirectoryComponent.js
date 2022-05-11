import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardImgOverlay, CardTitle, Button } from 'reactstrap';

function RenderDirectoryItem({ cocktail }) {
  return (
    <Card>
      <Link to={`/directory/${cocktail.id}`}>
        <CardImg src={cocktail.image} alt={cocktail.name} width="30"></CardImg>
        <CardImgOverlay>
          <CardTitle>{cocktail.name}</CardTitle>
        </CardImgOverlay>
      </Link>
    </Card>
  );
}

function CocktailDirectory(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('byName');
  const [cocktailDirectory, setCocktailDirectory] = useState(props.cocktails);

  useEffect(() => {
    if (searchBy === 'byName') {
      searchByName();
    } else {
      searchByIngredients();
    }
    //console.log(cockTailDirectory);
    // console.log(searchBy);
  }, [searchTerm]);

  const directory = cocktailDirectory.map(cocktail => {
    return (
      <div key={cocktail.id} className="col-md-5 m-1">
        <RenderDirectoryItem cocktail={cocktail} />
      </div>
    );
  });

  const searchByName = () => {
    const filteredCocktails = props.cocktails.filter(cocktail => {
      if (searchBy === 'byName') {
        return cocktail.name.toUpperCase().includes(searchTerm.toUpperCase());
      }
      if (searchBy === 'byIngredients') {
        return cocktail.requiredIngredients.some(ingredient =>
          ingredient.toUpperCase().includes(searchTerm.toUpperCase())
        );
      }
    });
    setCocktailDirectory(filteredCocktails);
  };

  const searchByIngredients = () => {
    // Split words by comma (we will eliminate extra whitespace later)
    const newSearchTerms = searchTerm.split(',');

    //empty array to store filtered cocktails
    const filteredCocktails = [];

    props.cocktails.forEach(cocktail => {
      // Destructure ingredients out of cocktail object for code readability
      const { requiredIngredients } = cocktail;

      // Boolean value to indicate whether or not the cocktail includes all required ingredients
      let hasIngredients = true;

      newSearchTerms.forEach(searchTerm => {
        // Convert search term to upper case and remove whitespace at beginning and end
        const term = searchTerm.toUpperCase().trim();
        // Check each search term to see if there is a cocktail ingredient that contains it
        if (!requiredIngredients.some(ingredient => ingredient.toUpperCase().includes(term))) {
          // If not, set the boolean to false to flag that this cocktail should not go in the list
          hasIngredients = false;
        }
      });
      // Check whether or not all ingredients are included and whether or not the cocktail is already on the list
      if (
        hasIngredients &&
        !filteredCocktails.some(item => item.id === cocktail.id)
      ) {
        // If so, pass this into our empty array
        filteredCocktails.push(cocktail);
      }
    });

    // Finally, set state with the array of cocktails
    setCocktailDirectory(filteredCocktails);

    // return newSearchTerms.forEach(term => {
    //   const item = cocktail.requiredIngredients.filter(ingredient => ingredient.toUpperCase().includes(term.toUpperCase()));
    //   console.log('item;', item);
    // })

    // return cocktail.requiredIngredients.some(ingredient => newSearchTerms.some(searchTerm => {
    //   return searchTerm.toUpperCase().includes(ingredient.toUpperCase());
    // }));
  };

  return (
    <div className="container py-3">
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search"
      />{' '}
      <select id="searchBy" onChange={e => setSearchBy(e.target.value)}>
        <option value="byName">By Name</option>
        <option value="byIngredients">By Ingredients</option>
      </select>
      {/*<Button onClick={searchByName}>Search</Button> */}
      <div className="row">{directory}</div>
    </div>
  );
}

export default CocktailDirectory;
