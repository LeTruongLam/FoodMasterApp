

import { useState, useEffect } from "react";

import {
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Button,
  List,
  Typography,
  Tag,
} from "antd";


import { NavLink,  useHistory } from "react-router-dom";
import { useData } from "../../context/AppContext";


const bell = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14L5 9H15L10 14Z" fill="#111827" />
    </svg>
  </svg>,
];



const profile = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
      fill="#111827"
    ></path>
  </svg>,
];

function Header({
  name,
  subName,
}) {
  const { Title, Text } = Typography;

  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");

  useEffect(() => window.scrollTo(0, 0));

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  const namePage = (input) => {
    if (input === "di-cho") return "Đi chợ"
    if (input === "nau-an") return "Nấu ăn"
    if (input === "kho") return "Kho"
    if (input === "cong-thuc") return "Công thức nấu ăn"
    if (input === "mon-do") return "Cài đặt món đồ"
    if (input === "quan-tri") return "Quản trị tài khoản"
    else return ""
  }

  const { user, setUser } = useData()
  const history = useHistory()

  const handleLogout = () => {
    setUser({
      username: "",
      role: 0
    })
    history.push("/dang-nhap")
  }

  const data = [
    {
      title: "",
      description: <Button style={{ width: "100%", backgroundColor: "red", color: "white" }} onClick={handleLogout} >Đăng xuất</Button>,
    }
  ];

  const menu = (
    <List
      min-width="50%"
      className="header-notifications-dropdown "
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">Quản lý đồ ăn</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
              {namePage(name)}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            >
              {namePage(subName)}
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              href="#pablo"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {bell}
            </a>
          </Dropdown>
          <div className="btn-sign-in">
            {profile}
            <span>{user && user[0]?.name}</span>
          </div>

          {user && user[0]?.role === 1 &&
            <Tag color="green" >Admin</Tag>
          }
          {user && user[0]?.role === 0 &&
            <Tag color="orange" >Người dùng</Tag>
          }
        </Col>
      </Row>
    </>
  );
}

export default Header;
