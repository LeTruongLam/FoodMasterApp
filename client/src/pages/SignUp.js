import React from "react";
import { Layout, Button, Row, Col, Typography, Form, Input } from "antd";
import { useData } from "../context/AppContext";

const { Title } = Typography;
const { Content } = Layout;

const SignUp = () => {
  const { handleRegister } = useData();

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin" style={{ minHeight: "100vh" }}>
          <Row justify="space-around">
            <Col style={{ marginTop: "50px" }}>
              <Title className="mb-15">FoodMaster</Title>

              <Form layout="vertical" className="row-col">
                <Form.Item
                  className="username"
                  label="Tên hiển thị"
                  name="fullname"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên của bạn",
                    },
                  ]}
                >
                  <Input placeholder="Full name" />
                </Form.Item>

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
                  <Input
                    type="password"
                    placeholder="Password"
                    style={{ fontWeight: 400, color: "black" }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    onClick={() =>
                      handleRegister(
                        document.getElementById("email").value,
                        document.getElementById("password").value,
                        document.getElementById("fullname").value
                      )
                    }
                  >
                    Đăng Ký
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  Bạn đã có tài khoản?{" "}
                  <a href="/dang-nhap" className="text-dark font-bold">
                    Đăng nhập
                  </a>
                </p>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default SignUp;
