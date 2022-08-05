import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { loginUser, createUserAccount } from "../helpers/homebartenderServer";

const LoginComponent = (props) => {
  const [userInfo, setUserInfo] = useState(
    !localStorage.getItem("creds")
      ? {
          username: "",
          password: "",
        }
      : JSON.parse(localStorage.getItem("creds"))
  );
  const [createUser, setCreateUser] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("creds") ? true : false
  );

  useEffect(() => {
    if (!createUser && localStorage.getItem("creds")) {
      setUserInfo(JSON.parse(localStorage.getItem("creds")));
    } else setUserInfo({ username: "", password: "" });
  }, [createUser]);

  const updateUserInfo = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    rememberMe
      ? localStorage.setItem("creds", JSON.stringify(userInfo))
      : localStorage.removeItem("creds");
    const userData = await loginUser(userInfo);
    if (userData) {
      props.onUserLogin(userData);
    } else {
      alert("Login failed.");
    }
  };

  const setCreateUserState = () => {
    setCreateUser(!createUser);
  };

  // Want better error handling for this!!!
  // Should tell user specifically why their request didn't go through
  const postUser = async (e) => {
    e.preventDefault();
    const response = await createUserAccount(userInfo);
    if (!response) {
      alert("Something went wrong.");
    } else if (response.success) {
      if (rememberMe) {
        localStorage.setItem("creds", JSON.stringify(userInfo));
      }
      setCreateUser(false);
      alert(
        "Your account has been created. You can now login from the login form."
      );
    }
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-md-6 col-lg-5 mx-auto">
          <Form onSubmit={createUser ? postUser : handleUserLogin}>
            <h5>{createUser ? "Create Account" : "Login"}</h5>
            <FormGroup>
              <Label htmlFor="username">Username: </Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={userInfo.username}
                className="form-control"
                onChange={updateUserInfo}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password: </Label>
              <Input
                type="text"
                id="password"
                name="password"
                value={userInfo.password}
                className="form-control"
                onChange={updateUserInfo}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="checkbox"
                name="remember"
                id="remember"
                onChange={() => setRememberMe(!rememberMe)}
                checked={rememberMe}
              />
              <Label htmlFor="remember" className="px-2">
                Remember me
              </Label>
            </FormGroup>
            <FormGroup row>
              <div className="col">
                <Button type="submit" color="primary">
                  Submit
                </Button>
                <Button
                  className="mx-3"
                  color="primary"
                  onClick={() => setCreateUserState()}
                >
                  {createUser ? "Go to Login" : "New User?"}
                </Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
