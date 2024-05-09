import React, { useEffect } from "react";
import { Form, Input, Button, Image } from "antd";
import { Container } from "./LoginPageCss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userSignIn } from "../../api/user.api";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const { response, err } = await userSignIn({ email, password });

      if (response) {
        const { token, role, storeId } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("storeId", storeId);
        toast.success("Logged in successfully!");
        navigate("/");
      } else if (err) {
        toast.error("Failed to log in. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <Image
      width={200}
      preview={false}
      src="https://res.cloudinary.com/dcc0yhyjq/image/upload/v1712695169/xakwryqc6r1gwhptqfzt.png"
      />
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ display: "block", width: "100%" }}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default LoginPage;
