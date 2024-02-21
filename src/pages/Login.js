import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { API } from "../components/api";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API}/users/login`,
        values
      );
      setLoading(false);
      message.success("Login successfull");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("something went wrong");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="register-page ">
        {loading && <Spinner />}
        <Form  layout="vertical" onFinish={submitHandler}>
          <h1>Login Form</h1>

          <Form.Item label={<label className="custom-label">Email</label>} name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label={<label className="custom-label">Password</label>} name="password">
            <Input type="password" />
          </Form.Item>
          <div className="login">
            <Link className="text-white" to="/register">Not a User? Click Here to Regsiter</Link>
            <button className="btn btn-dark mt-3">Login</button>
          </div>
          <div className="test-container">
            <h6> Test Credentials:</h6>
            <span className="test-content">Email: test@gmail.com</span>
            <span className="test-content">Password: test123</span>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
