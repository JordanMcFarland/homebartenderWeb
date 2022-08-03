import React, { useState } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { postUserToAirTable } from "../helpers/airtable";
import { loginUser } from "../helpers/homebartenderServer";

const LoginComponent = (props) => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [createUser, setCreateUser] = useState(false);

  const updateUserInfo = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const postUser = (e) => {
    console.log(userInfo);
    postUserToAirTable(userInfo);
    e.preventDefault();
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    const userData = await loginUser(userInfo);
    if (userData) {
      props.onUserLogin(userData);
    } else {
      alert("Login failed.");
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
              <Input type="checkbox" name="remember" id="remember" />
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
                  onClick={() => setCreateUser(!createUser)}
                >
                  {createUser ? "Go to Login" : "Create Account"}
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
