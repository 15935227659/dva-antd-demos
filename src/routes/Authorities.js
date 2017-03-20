import React from 'react';
import { connect } from 'dva';
import styles from './Authorities.css';

import MenusComponent from '../components/Authorities/Authorities';
import MainLayout from '../components/MainLayout/MainLayout';

function Authorities({ location }) {
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

export default connect(mapStateToProps)(Authorities);
