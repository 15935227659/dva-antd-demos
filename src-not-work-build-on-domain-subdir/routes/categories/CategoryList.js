import React, { PropTypes } from 'react'
import { Table, Modal, Popconfirm } from 'antd'
import styles from './CategoryList.css'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'

const confirm = Modal.confirm

function List ({
  loading,
  dataSource,
  pagination,
  onPageChange,
  onDeleteItem,
  onEditItem,
  onAuthItem,
  isMotion,
  location
}) {

  const handleMenuClick = (record, e) => {
    if (e.key === '1') { // 编辑
      onEditItem(record)
    } else if (e.key === '2') { // 删除
      confirm({
        title: '你确定要删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    } else if (e.key === '3') { // 权限设置
      onAuthItem(record)
    }
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
