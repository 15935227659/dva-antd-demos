import React from 'react';
import { connect } from 'dva';
import styles from './Menus.css';

import MenusComponent from '../components/Menus/Menus';
import MainLayout from '../components/MainLayout/MainLayout';

function Menus({ location }) {
  return (
    <MainLayout location={location}>
      <div className={styles.normal}>
        <MenusComponent />
      </div>
    </MainLayout>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Menus);
