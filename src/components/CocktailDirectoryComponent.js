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
  const [cockTailDirectory, setCocktailDirectory] = useState(props.cocktails);

  useEffect(() => {
    searchByName();
    console.log(cockTailDirectory);
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
      return cocktail.name.toUpperCase().includes(searchTerm.toUpperCase());
    });
    setCocktailDirectory(filteredCocktails);
  }

  return (
    <div className="container py-3">
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" />
      {/*<Button onClick={searchByName}>Search</Button> */}
      <div className="row">
        {directory}
      </div>
    </div>
  );
}

export default CocktailDirectory;