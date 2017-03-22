import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from './MenuModal.css';

const FormItem = Form.Item;
const Option = Select.Option;

class MenuEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  /**
   * @desc 还有bug, 先暂存
   */
  lt100Int = (rule, value, callback) => {
    console.log(value);
    const form = this.props.form;
    if (value && (typeof +value === 'number')) {
      callback();
      return;
    } else {
      callback('请输入1～99之间的整数');
    }
  };

  render() {
    const { children } = this.props;
    const { categories } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { p_id, menu_name, menu_url, data_source, data_owner, form_owner, sort_order } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const cateOptions = [];
    for(var category in categories) {
      cateOptions.push(
        <Option key={category}>
          {categories[category]['cate1_name'] + ' - ' + categories[category]['cate2_name']}
        </Option>
      );
    }

    let defCate = '';
    if(p_id) {
      defCate = categories[p_id]['cate1_name'] + ' - ' + categories[p_id]['cate2_name'];
    }
    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="编辑菜单"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form layout="horizontal" onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="菜单名称"
            >
              {
                getFieldDecorator('menu_name', {
                  initialValue: menu_name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="菜单URL"
            >
              {
                getFieldDecorator('menu_url', {
                  initialValue: menu_url,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属分类"
            >
              {
                getFieldDecorator('p_id', {
                  initialValue: defCate,
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
                  initialValue: data_source,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数据提供者"
            >
              {
                getFieldDecorator('data_owner', {
                  initialValue: data_owner,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="报表所有者"
            >
              {
                getFieldDecorator('form_owner', {
                  initialValue: form_owner,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="排序编号"
            >
              {
                getFieldDecorator('sort_order', {
                  initialValue: sort_order,
                })(<Input />)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(MenuEditModal);
