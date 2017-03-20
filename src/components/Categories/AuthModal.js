import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class AuthEditModal extends Component {

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

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { id, cate2_id, cate2_name, cate1_name, auth_users } = this.props.record;
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
          title="权限设置"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="分类名称"
            >
              <span>{cate1_name} - {cate2_name}</span>
              {
                getFieldDecorator('p_id', {
                  initialValue: cate2_id,
                })(<Input type="hidden" />)
              }
              {
                getFieldDecorator('type', {
                  initialValue: 'cate',
                })(<Input type="hidden" />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户列表"
            >
              {
                getFieldDecorator('auth_users', {
                  initialValue: auth_users,
                })(<Input type="textarea" rows="4" placeholder="请输入erp,多个erp使用英文逗号分割" />)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AuthEditModal);
