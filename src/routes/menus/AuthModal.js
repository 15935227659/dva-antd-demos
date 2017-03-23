import React, { PropTypes } from 'react'
import { Form, Input, Modal } from 'antd'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  visible,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }
}) => {
  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    title: '权限设置',
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="菜单名称：" hasFeedback {...formItemLayout}>
          <span>{item.menu_name} {item.menu_url}</span>
          {
            getFieldDecorator('menu_id', {
              initialValue: item.id,
            })(<Input type="hidden" />)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="用户列表"
        >
          {
            getFieldDecorator('auth_users', {
              initialValue: item.auth_users,
            })(<Input type="textarea" rows="4" placeholder="请输入erp,多个erp使用英文逗号分割" />)
          }
        </FormItem>
        { /* 保持FormItem中单个控件 */
          getFieldDecorator('type', {
            initialValue: 'menu',
          })(<Input type="hidden" />)
        }
        {
          getFieldDecorator('p_id', {
            initialValue: item.p_id,
          })(<Input type="hidden" />)
        }
      </Form>
    </Modal>
  )
}
modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
