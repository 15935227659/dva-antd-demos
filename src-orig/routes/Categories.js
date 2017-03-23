import React from 'react';
import { connect } from 'dva';
import styles from './Categories.css';

import CategoriesComponent from '../components/Categories/Categories';
import MainLayout from '../components/MainLayout/MainLayout';

function Categories({ location }) {
  return (
    <MainLayout location={location}>
      <div className={styles.normal}>
        <CategoriesComponent />
      </div>
    </MainLayout>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Categories);
