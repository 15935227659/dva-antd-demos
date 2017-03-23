import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

function Categories ({ location, dispatch, categories, loading }) {

  return (
    <div>Categories</div>
  )
}

Categories.propTypes = {
  menus: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}
export default connect(({ categories, loading }) => ({ categories, loading: loading.models.categories }))(Categories)
