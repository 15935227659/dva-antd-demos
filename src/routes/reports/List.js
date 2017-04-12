import React, { PropTypes } from 'react'
import { Table, Modal, Popconfirm, Button } from 'antd'
import styles from './List.less'
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
  onDetail,
  showQuoteDetail,
  showDimDetail,
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
        let datas = JSON.parse(text)
        let trItems = datas.map((data, index) => {
          return (
            <tr key={'dim' + index}>
              <td>{index + 1}</td>
              <td>{data.name}</td>
              <td>{data.alias}</td>
              <td>{data.vtype}</td>
              <td>{data.value}</td>
              <td>{data.inputtype}</td>
            </tr>
          )
        })
        return (
          <div>
            <a onClick={() => Modal.info({
              content: (
                <table className={styles.normaltable}>
                  <thead>
                    <tr>
                      <th>编号</th>
                      <th>名称</th>
                      <th>别名</th>
                      <th>值类型</th>
                      <th>值</th>
                      <th>控件类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trItems}
                  </tbody>
                </table>
              ),
              title: '维度配置详细信息',
              width: 800,
              okText: '关闭',
            })} name="dims">查看详细信息</a>
          </div>
        )

      }
    },
    {
      title: '指标信息',
      dataIndex: 'quotes',
      key: 'quotes',
      render: (text) => {
        let datas = JSON.parse(text)
        let trItems = datas.map((data, index) => {
          return (
            <tr key={'quote' + index}>
              <td>{index + 1}</td>
              <td>{data.name}</td>
              <td>{data.group}</td>
              <td>{data.desc}</td>
              <td>{data.field}</td>
              <td>{data.data_type}</td>
              <td>{data.precision}</td>
            </tr>
          )
        })
        return (
          <div>
            <a onClick={() => Modal.info({
              content: (
                <table className={styles.normaltable}>
                  <thead>
                    <tr>
                      <th>编号</th>
                      <th>名称</th>
                      <th>组名</th>
                      <th>描述</th>
                      <th>字段</th>
                      <th>数值类型</th>
                      <th>数值精度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trItems}
                  </tbody>
                </table>
              ),
              title: '指标配置详细信息',
              width: 800,
              okText: '关闭',
            })} name="quotes">查看详细信息</a>
          </div>
        )
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <DropOption
          onMenuClick={e => {
            return handleMenuClick(record, e)
          }}
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
