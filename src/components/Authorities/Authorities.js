import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Authorities.css';
import { PAGE_SIZE } from '../../constants';
import AuthorityModal from './AuthorityModal';

function Authorities({ dispatch, list: dataSource, loading, total, page: current }) {
  function deleteHandler(id) {
    dispatch({
      type: 'authorities/remove',
      payload: id,
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/authorities',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    dispatch({
      type: 'authorities/patch',
      payload: { id, values },
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'authorities/create',
      payload: values,
    });
  }

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menu_name',
      key: 'menu_name',
      render: text => <a href="">{text}</a>,
    },
    {
      title: '菜单URL',
      dataIndex: 'menu_url',
      key: 'menu_url',
    },
    {
      title: '一级分类',
      dataIndex: 'cate1_name',
      key: 'cate1_name',
    },
    {
      title: '二级分类',
      dataIndex: 'cate2_name',
      key: 'cate2_name',
    },
    {
      title: '权限用户',
      dataIndex: 'auth_users',
      key: 'auth_users',
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
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
  const { list, total, page } = state.authorities;
  return {
    loading: state.loading.models.authorities,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Authorities);
