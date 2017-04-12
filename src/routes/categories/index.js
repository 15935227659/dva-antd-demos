import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

import CategoryList from './CategoryList'
import CategoryModal from './CategoryModal'
import AuthModal from './AuthModal'

function Categories ({ location, dispatch, categories, loading }) {
  const {
    list,
    pagination,
    currentItem,
    modalVisible,
    authVisible,
    modalType,
    isMotion
  } = categories

  // 新建、编辑弹窗属性
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk(data) { // 成功提交表单
      dispatch({
        type: `categories/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'categories/hideModal'
      })
    }
  }

  const authModalProps = {
    item: currentItem,
    visible: authVisible,
    onOk(data) { // 成功提交表单
      dispatch({
        type: `categories/auth`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'categories/hideAuth'
      })
    }
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
        type: 'categories/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'categories/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        }
      })
    },
    onAuthItem (item) { // 授权
      dispatch({
        type: 'categories/showAuth',
        payload: {
          currentItem: item,
        }
      })
    },
    onCancel() {
      dispatch({
        type: 'categories/hideModal'
      })
    }
  }

  const ModalGen = () => <CategoryModal {...modalProps} />
  return (
    <div className="content-inner">
      <CategoryList {...listProps} />
      <AuthModal {...authModalProps} />
      <ModalGen />
    </div>
  )
}

Categories.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}
export default connect(({ categories, loading }) => ({ categories, loading: loading.models.categories }))(Categories)
