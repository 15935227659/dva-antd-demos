import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import styles from './CategoryModal.css';

const FormItem = Form.Item;

class CategoryEditModal extends Component {

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
    const { getFieldDecorator } = this.props.form;
    const { cate1_id, cate1_name, cate2_id, cate2_name, sort_order, icon_name } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="编辑分类"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form layout="horizontal" onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="一级分类ID"
            >
              {
                getFieldDecorator('cate1_id', {
                  initialValue: cate1_id,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="一级分类名称"
            >
              {
                getFieldDecorator('cate1_name', {
                  initialValue: cate1_name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="二级分类ID"
            >
              {
                getFieldDecorator('cate2_id', {
                  initialValue: cate2_id,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="二级分类名称"
            >
              {
                getFieldDecorator('cate2_name', {
                  initialValue: cate2_name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="排序"
            >
              {
                getFieldDecorator('sort_order', {
                  initialValue: sort_order,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="菜单icon"
            >
              {
                getFieldDecorator('icon_name', {
                  initialValue: icon_name,
                })(<Input />)
              }
            </FormItem>

          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CategoryEditModal);
