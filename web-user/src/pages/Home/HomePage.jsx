import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DropboxOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import Category from "../../components/Category";
import Store from "../../components/Store";
import Employee from "../../components/Employee";
import Product from "../../components/Product";
import Order from "../../components/Order";
import Dashboard from "../../components/Dashboard";

const { Content } = Layout;

const menuItems = [
  { key: "1", title: "Dashboard", icon: <DashboardOutlined />, role: "admin"  },
  { key: "2", title: "Stores", icon: <ShoppingCartOutlined />, role: "admin" },
  { key: "3", title: "Employees", icon: <UserOutlined />, role: "admin" },
  {
    key: "4",
    title: "Categories",
    icon: <AppstoreOutlined />,
    role: "employee",
  },
  { key: "5", title: "Products", icon: <DropboxOutlined />, role: "employee" },
  { key: "6", title: "Orders", icon: <ContainerOutlined />, role: "employee" },
];

const HomeMenu = ({ selectedKey, handleMenuClick, role, handleLogout }) => {
  const filteredMenuItems = menuItems.filter((item) => {
    return item.role === role || item.role === undefined;
  });

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      //defaultSelectedKeys={["1"]}
      selectedKeys={[selectedKey]}
      onClick={({ key }) => handleMenuClick(key)}
      responsive
    >

      {filteredMenuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.title}
        </Menu.Item>
      ))}
      <Menu.Item key="7" icon={<LogoutOutlined />} onClick={handleLogout} style={{color:"red"}}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

const HomePage = () => {
  const role = localStorage.getItem("role");
  const [selectedKey, setSelectedKey] = useState(role === "admin" ? "1" : "4");

  const handleMenuClick = (key) => {
    setSelectedKey(key);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <Dashboard />;
      case "2":
        return <Store />;
      case "3":
        return <Employee />;
      case "4":
        return <Category />;
      case "5":
        return <Product />;
      case "6":
        return <Order />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HomeMenu
        selectedKey={selectedKey}
        handleMenuClick={handleMenuClick}
        role={role}
        handleLogout={handleLogout}
      />
      <Layout>
        <Content style={{ padding: "20px", background: "#ccc" }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
