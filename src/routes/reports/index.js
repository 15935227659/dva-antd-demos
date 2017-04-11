import React from 'react'
import { connect } from 'dva'


import Filter from './Filter'
import Modal from './Modal'

function Reports({
  location,
  dispatch,
  reports,
  loading,
}) {
  const {
    list,
    pagination,
    currentItem,
    modalVisible,
    modalType,
    isMotion,
  } = reports

  const { field, keyword } = location.query

  const filterProps = {
    onAdd() {
      dispatch({
        type: 'reports/showModal',
        payload: {
          modalType: 'create',
        }
      })
    },
    switchIsMotion() {
      dispatch({
        type: 'reports/switchIsMotion',
      })
    }
  }

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk(data) {
      dispatch({
        type: `reports/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'reports/hideModal',
      })
    },
  }

  return (
    <div>
      <Filter {...filterProps} />
      <div>报表列表</div>
      <Modal {...modalProps} />
    </div>
  )
}

export default connect(({ reports, loading }) => ({ reports, loading: loading.models.reports }))(Reports)
