import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { API } from "../components/api";


const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/users/register`,
        values
      );
      message.success("Registration Successfull");
      setLoading(false);
      navigate("/login");
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
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Sign Up</h1>
          <Form.Item label={<label className="custom-label">Name</label>} name="name">
            <Input />
          </Form.Item>
          <Form.Item label={<label className="custom-label">Email</label>} name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label={<label className="custom-label">Password</label>} name="password">
            <Input type="password" />
          </Form.Item>
          <div className="login">
            <Link className="text-white" to="/login">Already have an account? Click Here to Login</Link>
            <button className="btn btn-dark mt-3">Register</button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
