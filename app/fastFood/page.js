'use client'
import React, { useState } from 'react';
import Maxsulot from "./maxsulot/page"
import Savdo from "./savdo/page";
import Bizhaqimizda from "./Bizhaqimizda"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const FastFood = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (key) => {
    setSelectedKey(key);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
        >
          <Menu.Item key="1" icon={<UserOutlined />} onClick={() => handleMenuClick('1')}>
            Biz haqimizda
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />} onClick={() => handleMenuClick('2')}>
            Maxsulot
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />} onClick={() => handleMenuClick('3')}>
            Savdo
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selectedKey === '1' && <div><Bizhaqimizda/> </div>}
          {selectedKey === '2' && <div><Maxsulot/> </div>}
          {selectedKey === '3' && <div><Savdo/></div>}
        </Content>
      </Layout>
    </Layout>
  );
};

export default FastFood;