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
  categories,
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
    title: `${type === 'create' ? '新建菜单' : '修改菜单'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  const cateOptions = [];
  for(var category in categories) {
    cateOptions.push(
      <Option key={category}>
        {categories[category]['cate1_name'] + ' - ' + categories[category]['cate2_name']}
      </Option>
    );
  }

  let defCate = '';
  if(item.p_id) {
    defCate = categories[item.p_id]['cate_name'];
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="菜单名称：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('menu_name', {
            initialValue: item.menu_name,
            rules: [
              {
                required: true,
                message: '请输入菜单名称',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="菜单URL：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('menu_url', {
            initialValue: item.menu_url,
            rules: [
              {
                required: true,
                message: '请输入菜单URL',
              },
            ],
          })(<Input />)}
        </FormItem>
            <FormItem hasFeedback
              {...formItemLayout}
              label="所属分类:"
            >
              {
                getFieldDecorator('p_id', {
                  initialValue: defCate,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: '请选择产品线',
                    },
                  ],
                })(
                  <Select placeholder="请选择产品线">
                    {cateOptions}
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数据源"
            >
              {
                getFieldDecorator('data_source', {
                  initialValue: item.data_source,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数据提供者"
            >
              {
                getFieldDecorator('data_owner', {
                  initialValue: item.data_owner,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="报表所有者"
            >
              {
                getFieldDecorator('form_owner', {
                  initialValue: item.form_owner,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="排序编号"
            >
              {
                getFieldDecorator('sort_order', {
                  initialValue: item.sort_order,
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
  categories: PropTypes.object,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
