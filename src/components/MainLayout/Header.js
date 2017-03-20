import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';

function Header({ location }) {
  return (
    <Menu
      selectedKeys={[location.pathname]}
      mode="horizontal"
      theme="dark"
    >
      <Menu.Item key="/">
        <Link to="/"><Icon type="home" />管理中心</Link>
      </Menu.Item>
      <Menu.Item key="/categories">
        <Link to="/categories"><Icon type="bars" />产品线管理</Link>
      </Menu.Item>
      <Menu.Item key="/menus">
        <Link to="/menus"><Icon type="bars" />菜单管理</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Header;

/*
      <Menu.Item key="/authorities">
        <Link to="/authorities"><Icon type="bars" />权限列表</Link>
      </Menu.Item>
*/
