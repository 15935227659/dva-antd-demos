import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import MainLayout from '../components/MainLayout/MainLayout';
import styles from './IndexPage.css';
import Login from './Login';

function App ({ children, location, dispatch, app, loading }) {
  const { login, loginButtonLoading } = app;
  const loginProps = {
    loading,
    loginButtonLoading,
    onOk(data) {
      dispatch({ type: 'app/login', payload: data })
    }
  };
  return (
    <div>{login ?
      <MainLayout location={location}>
        <div>Home Page</div>
      </MainLayout>
    : <div className={styles.spin}><Spin tip="加载用户信息..." spinning={loading} size="large"><Login {...loginProps} /></Spin></div>
    }</div>
  );
}

function mapStateToProps({app, loading}) {
  return {
    app,
    loading: loading.models.app
  };
}
//    : <div className={styles.spin}><Spin tip="加载用户信息..." spinning={loading} size="large"><Login {...loginProps} /></Spin></div>

export default connect(mapStateToProps)(App)
