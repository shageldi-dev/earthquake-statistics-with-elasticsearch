import React, { useState } from "react";
import {
  AimOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Typography } from "antd";
import useToken from "../hooks/useTheme";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { toggleTheme } from "../features/themeSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const { Title } = Typography;

const MainLayout: React.FC = () => {
  const { token } = useToken();
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const handleToggle = () => {
    dispatch(toggleTheme());
  };
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onSelect={(e) => navigate(e.key)}
          defaultSelectedKeys={["/"]}
          items={[
            {
              key: "/",
              icon: <PieChartOutlined />,
              label: "Dashboard",
            },
            {
              key: "/places",
              icon: <AimOutlined />,
              label: "Places",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: token.colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "22px",
            maxWidth: "100%",
          }}
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

          <Title title="App title" level={4}>
            Statistics
          </Title>

          <div style={{ display: "flex", alignItems: "center" }}>
            <DarkModeSwitch
              style={{}}
              checked={currentTheme === "dark"}
              onChange={handleToggle}
              size={25}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: token.colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
