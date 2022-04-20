import React, { useState } from 'react';
import { Nav, Navbar, NavbarToggler, Collapse, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isNavOpen, updateNavState] = useState(false);

  const toggleNav = (isNavOpen) => {
    updateNavState((prevState) => isNavOpen = !prevState);
  }

  return(
    <>
      <div className='bg-light p-5 rounded-lg m-3' fluid>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <h1>Cocktails!</h1>
            </div>
          </div>
        </div>
      </div>
      <Navbar dark sticky='top' expand='md'>
        <div className='container'>
          <NavbarToggler onClick={toggleNav} />
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className='nav-link' to='/directory'>
                  Cocktail List
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className='nav-link' to='/ingredientdirectory'>
                  Ingredient List
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </div>
      </Navbar>
    </>
  );
}

export default Header;