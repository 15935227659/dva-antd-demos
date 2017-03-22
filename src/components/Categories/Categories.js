import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Categories.css';
import { PAGE_SIZE } from '../../constants';
import CategoryModal from './CategoryModal';
import AuthModal from './AuthModal';

function Categories({ dispatch, list: dataSource, loading, total, page: current }) {
  function deleteHandler(id) {
    dispatch({
      type: 'categories/remove',
      payload: id,
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/categories',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    dispatch({
      type: 'categories/patch',
      payload: { id, values },
    });
  }

  function authHandler(values) {
    dispatch({
      type: 'categories/auth',
      payload: values,
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'categories/create',
      payload: values,
    });
  }

  const columns = [
    {
      title: '一级分类',
      dataIndex: 'cate1_name',
      key: 'cate1_name',
    },
    {
      title: '一级分类ID',
      dataIndex: 'cate1_id',
      key: 'cate1_id',
    },
    {
      title: '二级分类',
      dataIndex: 'cate2_name',
      key: 'cate2_name',
    },
    {
      title: '二级分类ID',
      dataIndex: 'cate2_id',
      key: 'cate2_id',
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
          <CategoryModal record={record} onOk={editHandler.bind(null, record.id)}>
            <a>编辑</a>
          </CategoryModal>
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
          <CategoryModal record={{}} onOk={createHandler}>
            <Button type="primary">新建分类</Button>
          </CategoryModal>
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
  const { list, total, page } = state.categories;
  return {
    loading: state.loading.models.categories,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Categories);
