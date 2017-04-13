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
    curQuotes,
    curDims,
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
          currentItem: {},
          curQuotes: [],
          curDims: [],
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
    item: currentItem,
    type: modalType,
    curQuotes,
    curDims,
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
          curQuotes: JSON.parse(item.quotes),
          curDims: JSON.parse(item.dims),
        }
      })
    },
    onCancel() {
      dispatch({
        type: 'menus/hideModal'
      })
    },
  }

  /**
   * 这里需要使用一个Gen函数来处理，否则在编辑和新增的时候，Modal里边的form控件值不会随state同步
   */
  const ModalGen = () => <Modal {...modalProps} />
  return (
    <div>
      <Filter {...filterProps} />
      <List {...listProps} />
      <ModalGen />
    </div>
  )
}

export default connect(({ reports, loading }) => ({ reports, loading: loading.models.reports }))(Reports)
