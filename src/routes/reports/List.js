import React, { PropTypes } from 'react'
import { Table, Modal, Popconfirm } from 'antd'
import styles from './List.css'
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
    }
  }

  const columns = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      width: 100,
      fixed: 'left',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '报表描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '维度信息',
      dataIndex: 'dims',
      key: 'dims',
      render: (text, record) => {
        let dims = JSON.parse(text)
        let dimItems = dims.map((dim, index) => {
          return (
            <p key={'dim' + index}>
              <span>名称：{dim.name}</span>
              <span> | 别名：{dim.alias}</span>
              <span> | 值类型: {dim.vtype}</span>
              <span> | 值：{dim.value}</span>
              <span> | 控件类型：{dim.inputtype}</span>
            </p>
          )
        })
        // return <a>查看详细信息</a>
        return dimItems
      }
    },
    {
      title: '指标信息',
      dataIndex: 'quotes',
      key: 'quotes',
      render: (text) => {
        return <a>查看详细信息</a>
      }
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
