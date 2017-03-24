import React, { PropTypes } from 'react'
import { connect } from 'dva'

function Users({ location, dispatch, users, loading }) {
  return (
    <div>Users</div>
  )
}

export default connect(({ users, loading }) => ({ users, loading: loading.models.users }))(Users)
