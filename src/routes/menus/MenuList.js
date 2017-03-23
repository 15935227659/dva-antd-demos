import React, { PropTypes } from 'react'
import { Table, Modal, Popconfirm } from 'antd'
import styles from './MenuList.css'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'

const confirm = Modal.confirm

function List ({
  loading,
  dataSource,
  categories,
  pagination,
  onPageChange,
  onDeleteItem,
  onEditItem,
  isMotion,
  location
}) {

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '你确定要删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menu_name',
      key: 'menu_name',
      width: 80,
    },
    {
      title: '菜单URL',
      dataIndex: 'menu_url',
      key: 'menu_url',
    },
    {
      title: '所属分类',
      dataIndex: 'p_id',
      key: 'p_id',
      render: (text) => <span>{categories[text] ? categories[text]['cate_name'] : '未设置'}</span>
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
      render: (text, record) => {
        return <DropOption
          onMenuClick={e => handleMenuClick(record, e)} 
          menuOptions={[
            { key: '1', name: '编辑' },
            { key: '2', name: '删除' },
            { key: '3', name: '权限' },
          ]}
        />
      },
    },
  ];

  const getBodyWrapperProps = {
    page: location.query.page,
    current: pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onPageChange}
        pagination={pagination}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
