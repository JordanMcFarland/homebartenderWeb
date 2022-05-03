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
  const [searchBy, setSearchBy] = useState("byName");
  const [cockTailDirectory, setCocktailDirectory] = useState(props.cocktails);

  useEffect(() => {
    searchByName();
    //console.log(cockTailDirectory);
    console.log(searchBy);
  }, [searchTerm])

  const directory = cockTailDirectory.map(cocktail => {
    return (
      <div key={cocktail.id} className="col-md-5 m-1">
        <RenderDirectoryItem cocktail={cocktail} />
      </div>
    )
  });

  const searchByName = () => {
    const filteredCocktails = props.cocktails.filter(cocktail => {
      if (searchBy === "byName") {
        return cocktail.name.toUpperCase().includes(searchTerm.toUpperCase());
      }
      if (searchBy === "byIngredients") {
        return cocktail.requiredIngredients.map(ingredient => ingredient.toUpperCase()).includes(searchTerm.toUpperCase());
      }
    });
    setCocktailDirectory(filteredCocktails);
  }

  return (
    <div className="container py-3">
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" />
      {' '}
      <select id="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
        <option value="byName">By Name</option>
        <option value="byIngredients">By Ingredients</option>
      </select>
      {/*<Button onClick={searchByName}>Search</Button> */}
      <div className="row">
        {directory}
      </div>
    </div>
  );
}

export default CocktailDirectory;