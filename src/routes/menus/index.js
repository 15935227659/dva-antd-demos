import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

import MenuList from './MenuList'
import MenuFilter from './MenuFilter'
import MenuModal from './MenuModal'

function Menus ({ location, dispatch, menus, loading }) {
  const {
    list,
    pagination,
    currentItem,
    modalVisible,
    modalType,
    categories,
    isMotion
  } = menus

  const { field, keyword } = location.query

  // 预处理分类映射，方便弹层和列表中使用
  const cateMaps = {}
  categories.map(function(category) {
    cateMaps[category.cate2_id] = category;
    cateMaps[category.cate2_id]['cate_name'] = category['cate1_name'] + ' - ' + category['cate2_name'];
  });

  /**
   * 容器组建向下传递属性, 在容器组建中准备好下层子组建所需的属性
   */

  // 新建、编辑弹窗属性
  const menuModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    categories: cateMaps,
    visible: modalVisible,
    onOk(data) { // 成功提交表单
      dispatch({
        type: `menus/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'menus/hideModal'
      })
    }
  }

  // 列表属性
  const menuListProps = {
    dataSource: list,
    loading,
    pagination,
    categories: cateMaps,
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
        type: 'menus/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'menus/showModal',
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

  // 过滤区域属性
  const menuFilterProps = {
    field,
    keyword,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(
        routerRedux.push({
          pathname: '/menus',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })
      ): dispatch(
        routerRedux.push({
          pathname: '/menus'
        })
      )
    },
    onAdd () {
      dispatch({
        type: 'menus/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'menus/switchIsMotion' })
    },
  }

  const MenuModalGen = () =>
    <MenuModal {...menuModalProps} />

  return (
    <div className="content-inner">
      <MenuFilter {...menuFilterProps} />
      <MenuList {...menuListProps} />
      <MenuModalGen />
    </div>
  )
}

Menus.propTypes = {
  menus: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

/*function mapStateToProps(state) {
  return {
    menus: state.menus,
    loading: state.loading.models.menus
  }
}
export default connect(mapStateToProps)(Menus)
// eq to the following line
*/
export default connect(({ menus, loading }) => ({ menus, loading: loading.models.menus }))(Menus)
