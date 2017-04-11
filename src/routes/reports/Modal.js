import React from 'react'
import {
  Form,
  Modal as AModal,
  Input,
  Select,
  Radio,
  Tabs,
  Button,
  Icon,
  Row,
  Col,
} from 'antd'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

import styles from './index.less'

const formItemLayout = {
  labelCol: {
    xs: { span: 26 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 26 },
    sm: { span: 22 },
  },
}

const formItemLayoutWithoutLabel = {
  wrapperCol: {
    xs: { span: 26, offset: 0 },
    sm: { span: 22, offset: 2 },
  }
}

let uuid = 0
let uuid2 = 0
const Modal = ({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
    getFieldsValue,
    setFieldsValue,
    getFieldError,
  },
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        AModal.error({
          title: '请检查你的配置信息',
        })
        return
      }

      const data = {
        ...getFieldsValue(),
        key: item.key,
      }

      if (data.quotes.length === 0) {
        AModal.error({
          title: '请进行指标信息的配置',
        })
        return
      }

      onOk(data)
    })
  }


  const removeDim = (dim) => {
    const dims = getFieldValue('dims')
    if (dims.length === 1) {
      return
    }

    setFieldsValue({
      dims: dims.filter(item => item !== dim)
    })
  }

  const addDim = () => {
    uuid++

    const dims = getFieldValue('dims')
    const nextDims = dims.concat(uuid)

    setFieldsValue({
      dims: nextDims,
    })
  }

  const removeQuote = (quote) => {
    const quotes = getFieldValue('quotes')
    if (quotes.length === 1) {
      return
    }

    setFieldsValue({
      quotes: quotes.filter(item => item !== quote)
    })
  }

  const addQuote = () => {
    uuid2++

    const quotes = getFieldValue('quotes')
    const nextQuotes = quotes.concat(uuid2)

    setFieldsValue({
      quotes: nextQuotes,
    })
  }

  const modalOpts = {
    title: `${type === 'create' ? '新建报表' : '修改报表'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    width: 1000,
  }


  getFieldDecorator('dims', { initialValue: [] })
  const dims = getFieldValue('dims')
  const tips = {
    name: '有意义的字符串，格式不限',
    alias: '唯一标志符, 用于标识维度',
    vtype: '枚举或数据表',
    value: '值类型为枚举时，请列举所有可能的值, 以英文分号分割多个值;值类型为数据表时，请指定具体的表名',
    inputtype: '控件显示类型：单选、多选等',
    group: '分组名称, 留空不分组',
    desc: '指标描述、定义、解释、公式等字符串',
    field: '指标对应的字段的名称或字段聚合查询字符串，例如pv, sum(pv)',
    datatype: '指标数值类型，例如：整数、浮点数、百分比等',
    precision: '小数或百分比的精度定义',
  }
  const formItems = dims.map((k, index) => {
    return (
      <tr key={`dim_${k}`}>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`dims-name-${k}`) || tips['name']}
          >
            {getFieldDecorator(`dims-name-${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: '请输入维度名称',
              }],
            })(
              <Input placeholder="维度名称" />
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`dims-alias-${k}`) || tips['alias']}
          >
            {getFieldDecorator(`dims-alias-${k}`, {
              rules: [{
                required: true,
                whitespace: true,
                message: '请输入唯一的维度标志符',
              }],
              validateTrigger: ['onChange', 'onBlur'],
            })(
              <Input placeholder="维度别名" />
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`dims-vtype-${k}`) || tips['vtype']}
          >
            {getFieldDecorator(`dims-vtype-${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: '请选择值类型',
              }],
              initialValue: 'enum',
            })(
              <Select>
                <Option value="enum">枚举</Option>
                <Option value="table">维度表</Option>
              </Select>
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`dims-value-${k}`) || tips['value']}
          >
            {getFieldDecorator(`dims-value-${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: '请根据值类型输入恰当的值',
              }],
            })(
              <Input placeholder="维度值" />
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`dims-inputtype-${k}`) || tips['inputtype']}
          >
            {getFieldDecorator(`dims-inputtype-${k}`, {
              initialValue: 'radio',
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: '请选择控件显示类型',
              }],
            })(
              <Select>
                <Option value="radio">单选</Option>
                <Option value="checkbox">多选</Option>
              </Select>
            )}
          </FormItem>
        </td>
        <td>
          <Button className={styles.del_btn}
              onClick={() => removeDim(k)}>
            <Icon
              type="close"
              disabled={dims.length === 1}
            />
            删除
          </Button>
        </td>
      </tr>
    )
  })


  getFieldDecorator('quotes', { initialValue: [] })
  const quotes = getFieldValue('quotes')
  const quoteItems = quotes.map((k, index) => {
    return (
      <tr key={`quote_${k}`}>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`quotes-name-${k}`) || tips['name']}
          >
            {getFieldDecorator(`quotes-name-${k}`, {
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
            help={getFieldError(`quotes-group-${k}`) || tips['group']}
          >
            {getFieldDecorator(`quotes-group-${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: false,
              }],
            })(
              <Input placeholder="分组名称" />
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`quotes-desc-${k}`) || tips['desc']}
          >
            {getFieldDecorator(`quotes-desc-${k}`, {
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
            help={getFieldError(`quotes-field-${k}`) || tips['field']}
          >
            {getFieldDecorator(`quotes-field-${k}`, {
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
            help={getFieldError(`quotes-type-${k}`) || tips['datatype']}
          >
            {getFieldDecorator(`quotes-type-${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: 'int',
              rules: [{
                required: true,
                whitespace: true,
                message: '请选择数值类型',
              }],
            })(
              <Select>
                <Option value="int">整数</Option>
                <Option value="double">浮点数</Option>
                <Option value="percentage">百分比</Option>
              </Select>
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
            help={getFieldError(`quotes-precision-${k}`) || tips['precision']}
          >
            {getFieldDecorator(`quotes-precision-${k}`, {
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
              disabled={quotes.length === 1}
            />
            删除
          </Button>
        </td>
      </tr>
    )
  })

  return (
    <AModal {...modalOpts}>
      <Form layout="horizontal">
        <Tabs type="card">
          <TabPane tab="基本信息" key="basic">
            <FormItem label="报表名称：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('report_name', {
                initialValue: item.report_name,
                rules: [
                  {
                    required: true,
                    message: '请输入报表名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="报表描述：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('report_desc', {
                initialValue: item.report_desc,
                rules: [
                  {
                    required: true,
                    message: '请输入报表描述',
                  },
                ],
              })(<Input type="textarea" rows={4} />)}
            </FormItem>
            <FormItem label="数据表名：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('report_table', {
                initialValue: item.report_table,
                rules: [
                  {
                    required: true,
                    message: '请输入数据表对应的表名',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="分表类型：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('table_type', {
                initialValue: 'month',
              })(
                <RadioGroup size="small">
                  <RadioButton value="day">按天分</RadioButton>
                  <RadioButton value="month">按月分</RadioButton>
                  <RadioButton value="year">按年分</RadioButton>
                  <RadioButton value="none">不分表</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </TabPane>
          <TabPane tab="维度信息" key="dims">
            <Row className={styles.new_btn}>
              <Button onClick={addDim}>
                <Icon type="plus" /> 新增一行
              </Button>
            </Row>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.w120}>维度名称</th>
                  <th className={styles.w100}>维度别名</th>
                  <th className={styles.w120}>值类型</th>
                  <th>维度值</th>
                  <th className={styles.w100}>控件类型</th>
                  <th className={styles.op}>操作</th>
                </tr>
              </thead>
              <tbody>
                {formItems}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6">
                    <div className={styles.opdesc}>
                      <strong>操作说明:</strong>
                      <ul>
                        <li>维度配置管理报表维度数据以及前端UI呈现。</li>
                        <li>维度名称选择有意义的中文词语，别名输入英文词语。别名需保证唯一性。</li>
                        <li>维度值可选择枚举所有值或指定一个保存维度值的数据表。枚举的时候需要列举维度的所有值，由系统自动为每个值生成索引，索引编号以1开始，逐个递增。数据表则指定具体的数据表名dbname.tablename。</li>
                        <li>控件类型用于控制前端展示的UI控件选择，比如，单选、多选等等。</li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </TabPane>
          <TabPane tab="指标信息" key="quotes">
            <Row className={styles.new_btn}>
              <Button onClick={addQuote}>
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
                {quoteItems}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="7">
                    <div className={styles.opdesc}>
                      <strong>操作说明:</strong>
                      <ul>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </TabPane>
        </Tabs>
      </Form>
    </AModal>
  )
}

export default Form.create()(Modal)
