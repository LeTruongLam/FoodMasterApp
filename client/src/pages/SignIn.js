import React, { Component } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  Alert,
  message,
} from "antd";
import { useData } from "../context/AppContext";
import { BACK_END_URL } from "../context/const";
function onChange(checked) {
  console.log(`switch to ${checked}`);
}
const { Title } = Typography;
const { Header, Footer, Content } = Layout;



const SignIn = () => {
  const history = useHistory();

  const { handleLogin, setUser } = useData()

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin" style={{ minHeight: "100vh" }}>
          <Row justify="space-around">
            <Col style={{ marginTop: "50px" }}>
              <Title className="mb-15" >FoodMaster</Title>
           
              <Form
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Tài khoản"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập email của bạn",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập password của bạn",
                    },
                  ]}
                >
                  <Input type="password" placeholder="Password" style={{ fontWeight: 400, color: "black" }} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    onClick={() => handleLogin(
                      document.getElementById('email').value,
                      document.getElementById('password').value,
                    )}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              <p className="font-semibold text-muted">
                  Bạn chưa có tài khoản?{" "}
                  <a href="/dang-ky" className="text-dark font-bold">
                    Đăng ký
                  </a>
                </p> 
              </Form>
            </Col>
          
          </Row>
        </Content>
      </Layout>
    </>
  );
}

export default SignIn
