import React, { useState } from "react";
import {
  Nav,
  Navbar,
  NavbarToggler,
  Collapse,
  NavItem,
  Button,
} from "reactstrap";
import { useNavigate, NavLink, Link } from "react-router-dom";

const Header = (props) => {
  const [isNavOpen, updateNavState] = useState(false);
  const navigate = useNavigate();

  const toggleNav = (isNavOpen) => {
    updateNavState((prevState) => (isNavOpen = !prevState));
  };

  return (
    <>
      <div className="bg-dark p-2 pt-3 p-sm-5" fluid="true">
        <div className="container">
          <div className="row">
            <div className="col-8 col-xl-9">
              <Link style={{ textDecoration: "none" }} to="/directory">
                <h1 style={{ color: "#B70D29" }}>Home Bartender</h1>
              </Link>
            </div>
            {props.user ? (
              <div
                style={{ marginLeft: "auto", textAlign: "right" }}
                className="col-4 col-sm-4 col-md-4 col-lg-3"
              >
                {"Hello, " + props.user.username}
              </div>
            ) : (
              <Button
                style={{ marginLeft: "auto" }}
                className="col-4 col-sm-3 col-md-2 col-lg-1"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
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
            {props.user ? (
              <button id="logoutButton" onClick={() => props.onUserLogout()}>
                Logout
              </button>
            ) : (
              <></>
            )}
          </Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
