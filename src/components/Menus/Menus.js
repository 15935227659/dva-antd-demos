import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Menus.css';
import { PAGE_SIZE } from '../../constants';
import MenuModal from './MenuModal';
import AuthModal from './AuthModal';

function Menus({ dispatch, list: dataSource, loading, total, page: current, categories }) {
  function deleteHandler(id) {
    dispatch({
      type: 'menus/remove',
      payload: id,
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/menus',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    dispatch({
      type: 'menus/patch',
      payload: { id, values },
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'menus/create',
      payload: values,
    });
  }

  function authHandler(values) {
    dispatch({
      type: 'menus/auth',
      payload: values,
    });
  }

  const cateMaps = {};
  categories.map(function(category) {
    cateMaps[category.cate2_id] = category;
  });

  dataSource.map(function(menu) {
    const cate = cateMaps[menu.p_id];
    menu['cate_name'] = cate['cate1_name'] + '-' + cate['cate2_name'];
  });
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menu_name',
      key: 'menu_name',
    },
    {
      title: '菜单URL',
      dataIndex: 'menu_url',
      key: 'menu_url',
    },
    {
      title: '所属分类',
      dataIndex: 'cate_name',
      key: 'cate_name',
    },
    {
      title: '数据源',
      dataIndex: 'data_source',
      key: 'data_source',
    },
    {
      title: '数据源负责人',
      dataIndex: 'data_owner',
      key: 'data_owner',
    },
    {
      title: '报表负责人',
      dataIndex: 'form_owner',
      key: 'form_owner',
    },
    {
      title: '排序编号',
      dataIndex: 'sort_order',
      key: 'sort_order',
    },
    {
      title: '权限用户列表',
      dataIndex: 'auth_users',
      key: 'auth_users',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation}>
          <MenuModal record={record} categories={cateMaps} onOk={editHandler.bind(null, record.id)}>
            <a>编辑</a>
          </MenuModal>
          <Popconfirm title="确认删除?" onConfirm={deleteHandler.bind(null, record.id)}>
            <a href="">删除</a>
          </Popconfirm>
          <AuthModal record={record} onOk={authHandler}>
            <a>设置权限</a>
          </AuthModal>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <div className={styles.create}>
          <MenuModal record={{}} categories={cateMaps} onOk={createHandler}>
            <Button type="primary">新建菜单</Button>
          </MenuModal>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          pagination={false}
        />
        <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}
        />
      </div>
    </div>
  );

}

function mapStateToProps(state) {
  const { list, total, page, categories } = state.menus;
  return {
    loading: state.loading.models.menus,
    list,
    categories,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Menus);
