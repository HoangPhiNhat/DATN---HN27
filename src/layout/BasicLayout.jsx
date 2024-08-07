import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const items = [
    // {
    //   // key: "/admin/users",
    //   icon: <PieChartOutlined />,
    //   label: <Link to="/admin/users">Dashboard</Link>,
    // },
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Products",
      children: [
        {
          key: "/admin/products",
          label: <Link to="/admin/products">Product List</Link>,
        },
        {
          key: "/admin/products/add",
          label: <Link to="/admin/products/add">Add Product</Link>,
        },
      ],
    },
    {
      key: "/admin/categories",
      icon: <VideoCameraOutlined />,
      label: <Link to="/admin/categories">Categories</Link>,
    },
    {
      key: "/admin/users",
      icon: <UploadOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
  ];

  const handleBreakpoint = (broken) => {
    setIsMobile(broken);
    setCollapsed(broken);
  };

  // Tìm keys của tất cả các menu con đang được mở
  const findOpenKeys = (items) => {
    const openKeys = [];
    const findKeys = (items) => {
      items.forEach((item) => {
        if (item.children) {
          const foundChild = item.children.find(
            (child) => child.key === location.pathname
          );
          if (foundChild) {
            openKeys.push(item.key);
          }
          findKeys(item.children);
        }
      });
    };
    findKeys(items);
    return openKeys;
  };

  return (
    <Layout>
      <Sider
      className="min-h-[100vh]"
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        onBreakpoint={handleBreakpoint}
        theme="dark"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={findOpenKeys(items)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            className="h-full"
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
