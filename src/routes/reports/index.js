import React from 'react'
import { connect } from 'dva'


import Filter from './Filter'
import Modal from './Modal'
import List from './List'

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

  // 列表属性
  const listProps = {
    dataSource: list,
    loading,
    pagination,
    location,
    isMotion,
    onPageChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          limit: page.pageSize,
        }
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'reports/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'reports/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        }
      })
    },
    onCancel() {
      dispatch({
        type: 'menus/hideModal'
      })
    }
  }


  return (
    <div>
      <Filter {...filterProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
    </div>
  )
}

export default connect(({ reports, loading }) => ({ reports, loading: loading.models.reports }))(Reports)
