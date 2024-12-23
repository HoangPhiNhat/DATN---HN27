import {
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SnippetsOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../resources/images/logo.png";
import ShipperProfile from "./_components/ShipperProfile";
const { Header, Sider, Content } = Layout;

const ShipperLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const items = [
    {
      key: "/shipper/shipping",
      icon: <TruckOutlined />,
      label: <Link to="/shipper/shipping">Đơn hàng đang giao</Link>,
    },
    {
      key: "/shipper/shippending",
      icon: <SnippetsOutlined />,
      label: <Link to="/shipper/shippending">Đơn hàng đợi giao</Link>,
    },
    {
      key: "/shipper/history",
      icon: <HistoryOutlined />,
      label: <Link to="/shipper/history">Lịch sử giao hàng</Link>,
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
        theme="light"
      >
        <div className="px-5 py-3">
          <img src={logo} alt="" />
        </div>
        <Menu
          theme="light"
          mode="vertical"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={findOpenKeys(items)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer }}
          className="flex justify-between pl-0 "
        >
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
          <ShipperProfile />
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

export default ShipperLayout;
