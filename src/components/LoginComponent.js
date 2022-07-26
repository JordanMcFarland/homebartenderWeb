import React, { useState } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

const LoginComponent = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });

  const updateUserInfo = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    console.log(userInfo);
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-md-6 col-lg-5 mx-auto">
          <Form onSubmit={handleSubmit}>
            <h5>Login</h5>
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
                <Button className="mx-3" color="primary">
                  Create Account
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
