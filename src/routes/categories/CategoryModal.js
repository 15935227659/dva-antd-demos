import React, { PropTypes } from 'react'
import { Form, Input, InputNumber, Radio, Modal, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

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
  type,
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
    title: `${type === 'create' ? '新建分类' : '修改分类'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="一级分类ID：" hasFeedback {...formItemLayout}>
          {
            getFieldDecorator('cate1_id', {
              rules: [
                {
                  required: true,
                  message: '请输入一级分类ID',
                },
              ],
              initialValue: item.cate1_id,
            })(<Input />)
          }
        </FormItem>
        <FormItem hasFeedback
          {...formItemLayout}
          label="一级分类名称："
        >
          {
            getFieldDecorator('cate1_name', {
              rules: [
                {
                  required: true,
                  message: '请输入一级分类名称',
                },
              ],
              initialValue: item.cate1_name,
            })(<Input />)
          }
        </FormItem>
        <FormItem hasFeedback
          {...formItemLayout}
          label="二级分类ID："
        >
          {
            getFieldDecorator('cate2_id', {
              rules: [
                {
                  required: true,
                  message: '请输入二级分类ID',
                },
              ],
              initialValue: item.cate2_id,
            })(<Input />)
          }
        </FormItem>
        <FormItem hasFeedback
          {...formItemLayout}
          label="二级分类名称："
        >
          {
            getFieldDecorator('cate2_name', {
              rules: [
                {
                  required: true,
                  message: '请输入二级分类名称',
                },
              ],
              initialValue: item.cate2_name,
            })(<Input />)
          }
        </FormItem>
        <FormItem hasFeedback
          {...formItemLayout}
          label="排序："
        >
          {
            getFieldDecorator('sort_order', {
              rules: [
                {
                  required: true,
                  message: '请输入排序编号',
                },
              ],
              initialValue: item.sort_order,
            })(<Input />)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="菜单icon："
        >
          {
            getFieldDecorator('icon_name', {
              initialValue: item.icon_name,
            })(<Input />)
          }
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
