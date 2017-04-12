import React, { Component } from 'react'
import {
  Row,
  Button,
  Icon,
  Form,
  Input,
  Select,
  Radio,
} from 'antd'

import styles from './index.less'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

class QuoteTable extends Component {
  constructor(props) {
    super(props)
    this.onAdd.bind(this)
  }

  onAdd() {

  }
  render() {
    const {
      onAdd,
      datas,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        getFieldError,
      },
    } = this.props
    const formItemLayoutWithoutLabel = {
      wrapperCol: {
        xs: { span: 26, offset: 0 },
        sm: { span: 22, offset: 2 },
      }
    }
    let formItems = []
    console.log(datas)
    if (datas) {
      let index = 0
      formItems = datas.map(group => {
        return group.child.map((child) => {
          index++
          return (
              <tr key={`quote_${index}`}>
                <td>
                  <FormItem formItemLayoutWithoutLabel
                  >
                    {getFieldDecorator(`quotes-name-${index}`, {
                      initialValue: child['name'] || '',
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '请输入指标名称',
                      }],
                    })(
                      <Input placeholder="指标名称" />
                    )}
                  </FormItem>
                </td>
                <td>
                  <FormItem formItemLayoutWithoutLabel
                  >
                    {getFieldDecorator(`quotes-group-${index}`, {
                      initialValue: group['name'] || 'default',
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '请输入分组名称',
                      }],
                    })(
                      <Input placeholder="分组名称" />
                    )}
                  </FormItem>
                </td>
                <td>
                  <FormItem formItemLayoutWithoutLabel
                  >
                    {getFieldDecorator(`quotes-desc-${index}`, {
                      initialValue: child['desc'] || '',
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '请输入指标描述',
                      }],
                    })(
                      <Input placeholder="指标描述" />
                    )}
                  </FormItem>
                </td>
                <td>
                  <FormItem formItemLayoutWithoutLabel
                  >
                    {getFieldDecorator(`quotes-field-${index}`, {
                      initialValue: child['value'] || '',
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '请输入指标对应字段名',
                      }],
                    })(
                      <Input placeholder="字段名称" />
                    )}
                  </FormItem>
                </td>
                <td>
                  <FormItem formItemLayoutWithoutLabel
                  >
                    {getFieldDecorator(`quotes-type-${index}`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      initialValue: (''+child['data_type']) || '1',
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '请选择数值类型',
                      }],
                    })(
                      <Select>
                        <Option value="1">整数</Option>
                        <Option value="2">浮点数</Option>
                        <Option value="3">百分比</Option>
                      </Select>
                    )}
                  </FormItem>
                </td>
                <td>
                  <FormItem formItemLayoutWithoutLabel
                  >
                    {getFieldDecorator(`quotes-precision-${index}`, {
                      initialValue: child['precision'] || 0,
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '请输入数值精度',
                      }],
                    })(
                      <Input placeholder="数值精度" />
                    )}
                  </FormItem>
                </td>
                <td>
                  <Button className={styles.del_btn}
                      onClick={() => removeQuote(k)}>
                    <Icon
                      type="close"
                    />
                    删除
                  </Button>
                </td>
              </tr>
            )
        })
      })
    }
    return (
      <div>
        <Row className={styles.new_btn}>
          <Button onClick={this.onAdd}>
            <Icon type="plus" /> 新增一行
          </Button>
        </Row>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.w100}>指标名称</th>
              <th className={styles.w120}>分组名称</th>
              <th>指标描述</th>
              <th className={styles.w100}>字段名称</th>
              <th className={styles.w100}>数值类型</th>
              <th className={styles.w80}>数值精度</th>
              <th className={styles.op}>操作</th>
            </tr>
          </thead>
          <tbody>
            {formItems}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="7">
                <div className={styles.opdesc}>
                  <strong>操作说明:</strong>
                  <ul>
                    <li>指标配置定义报表展示指标的元数据信息，包括指标数据如何获取，指标数据展示类型，小数点精度等。指标配置项目必须配置。</li>
                    <li>指标名称：采用汉语、英文单词、下划线等组合起来的字符串，表示指标含义的简短描述字符串。</li>
                    <li>分组名称：对大量指标进行的简单分类。使用简单词语， 如果不设置分组，输入default。分组名称相同的在报表展示时处于同一组中。</li>
                    <li>指标描述：指标含义、指标计算方式、计算口径等详细指标信息介绍。作为指标名称的详细解释， 给数据使用者一种明确定义。</li>
                    <li>字段名称：指标数据在展示时从具体数据源中取值的逻辑，一般使用对应表中的字段；有时候也使用一些SQL聚合语句，比如SUM(field1) as field1。</li>
                    <li>数值类型：指标数值在趋势图或数据表中展示时格式化的类型，目前系统支持的类型有：整数、小数和百分比。</li>
                    <li>数值精度：针对小数类型的指标，为了精确展示数据值，允许自定义每个指标(小数)的显示精度。</li>
                  </ul>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}

export default Form.create()(QuoteTable)
