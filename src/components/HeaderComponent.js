import React, { useState } from "react";
import {
  Nav,
  Navbar,
  NavbarToggler,
  Collapse,
  NavItem,
  Button,
} from "reactstrap";
import { useNavigate, NavLink } from "react-router-dom";

const Header = (props) => {
  const [isNavOpen, updateNavState] = useState(false);
  const navigate = useNavigate();

  const toggleNav = (isNavOpen) => {
    updateNavState((prevState) => (isNavOpen = !prevState));
  };

  return (
    <>
      <div className="bg-dark p-5" fluid="true">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h1 style={{ color: "#B70D29" }}>Home Bartender</h1>
            </div>
            <div className="col-2">
              {props.user ? "Hello, " + props.user.username : ""}
            </div>
            <Button
              className="col-1"
              onClick={
                props.user
                  ? () => props.onUserLogout()
                  : () => navigate("/login")
              }
            >
              {props.user ? "Logout" : "Login"}
            </Button>
          </div>
        </div>
      </div>
      <Navbar dark sticky="top" expand="md">
        <div className="container">
          <NavbarToggler onClick={toggleNav} />
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className="nav-link" to="/directory">
                  Cocktail List
                </NavLink>
              </NavItem>
              {props.user ? (
                <>
                  <NavItem>
                    <NavLink className="nav-link" to="/cocktailcreator">
                      Cocktail Creator
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to="/mycocktails">
                      My Cocktails
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to="/favorites">
                      My Favorites
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to="/mybar">
                      My Bar
                    </NavLink>
                  </NavItem>
                </>
              ) : (
                <></>
              )}
            </Nav>
          </Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
