import React from 'react'
import {
  Form,
  Modal as AModal,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Radio,
  Tabs,
  Button,
  Icon,
  Row,
  Col,
} from 'antd'
import _ from 'lodash'

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

/**
 * @desc 挖坑记录
 * 1. 新增报表开发的时候，一切都顺利，其中维度、指标计数器能正常工作，新增删除行也都ok
 * 2. 编辑实现的时候，需要考虑初始化的行数据(维度，指标), 而从父容器传过来的属性(state中的), 计数器始终保持和state中的元素数相同。新增出现问题
 * 3. 那么不使用计数器，全state管理，新增，删除等功能都ok, 唯一的问题就是点击新增和删除的时候会更新state, 继而更新UI, 编辑页面闪烁(state变化了嘛， 同步到UI)
 * 4. 绕回来，只能使用计数器。关键是怎么给计数器赋值以及递增。这里使用一个简单的技巧：
 * 计数器只能增加，不能减少。 为了保证初始化的维度、指标数据的下标保持一致。在增、删过程中，不会让顺序错乱。
 * 那么情况就变成: 新增的时候index必然是0， 而编辑的时候要根据初始化的数据行来确定，但不能直接通过数据行的length来， 这样就出现2中的问题。
 * 这里采用从form字段dims, quotes中元素的数量来确定这个初始化值。注意是初始化值， 只执行一次。这里粗暴的判断，是0的话就用元素个数来初始化。(貌似暂时没有什么问题)
 *
 * 另外，本想将两个动态form框抽象成单独的组件，暂时鉴于form验证和获取值的问题，暂时没有找到更好的办法。
 */
let dimIndex = 0
let quoteIndex = 0
const Modal = ({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  curQuotes,
  curDims,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
    getFieldsValue,
    setFieldsValue,
    getFieldError,
  },
}) => {
  let dimKeys = _.range(0, curDims.length)
  let quoteKeys = _.range(0, curQuotes.length)

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

  const addDim = () => {
    const keys = getFieldValue('dims')
    /**
     * index的初始化值为0，对于编辑的情况，初始化值需要为项目条目数
     *
     * 一旦初始化，保持递增状态
     */
    if(dimIndex === 0) {
      dimIndex = keys.length
    }
    const nextKeys = keys.concat(dimIndex)
    setFieldsValue({
      dims: nextKeys,
    })

    dimIndex++
  }
  const removeDim = (k) => {
    const keys = getFieldValue('dims')
    if(dimIndex === 0) {
      dimIndex = keys.length
    }

    setFieldsValue({
      dims: keys.filter(key => key !== k)
    })
  }

  const addQuote = (k) => {
    const keys = getFieldValue('quotes')
    /**
     * index的初始化值为0，对于编辑的情况，初始化值需要为项目条目数
     *
     * 一旦初始化，保持递增状态
     */
    if(quoteIndex === 0) {
      quoteIndex = keys.length
    }
    const nextKeys = keys.concat(quoteIndex)
    setFieldsValue({
      quotes: nextKeys,
    })

    quoteIndex++
  }
  const removeQuote = (k) => {
    const keys = getFieldValue('quotes')
    if(quoteIndex === 0) {
      quoteIndex = keys.length
    }

    setFieldsValue({
      quotes: keys.filter(key => key !== k)
    })
  }

  // 获取dim的初始化值
  const iDim = (k, field, def) => {
    if(typeof def === 'undefined') def = ''
    return curDims[k] ? curDims[k][field] : def
  }

  // 获取quote的初始化值
  const iQuote = (k, field, def) => {
    if(typeof def === 'undefined') def = ''
    return curQuotes[k] ? curQuotes[k][field] : def
  }

  const modalOpts = {
    title: `${type === 'create' ? '新建报表' : '修改报表'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    width: 1000,
  }

  getFieldDecorator('dims', { initialValue: dimKeys })
  dimKeys = getFieldValue('dims')
  const formItems = dimKeys.map((k) => {
    return (
      <tr key={`dim_${k}`}>
        <td>
          <FormItem formItemLayoutWithoutLabel
          >
            {getFieldDecorator(`dims-name-${k}`, {
              initialValue: iDim(k, 'name'),
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
          >
            {getFieldDecorator(`dims-alias-${k}`, {
              initialValue: iDim(k, 'alias'),
              rules: [{
                required: true,
                whitespace: true,
                message: '请输入维度字段名',
              }],
              validateTrigger: ['onChange', 'onBlur'],
            })(
              <Input placeholder="字段名" />
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
          >
            {getFieldDecorator(`dims-vtype-${k}`, {
              initialValue: iDim(k, 'vtype', 'enum'),
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
          >
            {getFieldDecorator(`dims-value-${k}`, {
              initialValue: iDim(k, 'value'),
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
          >
            {getFieldDecorator(`dims-default-${k}`, {
              initialValue: iDim(k, 'default'),
              rules: [{
                required: true,
                whitespace: true,
                message: '请输入维度默认值',
              }],
              validateTrigger: ['onChange', 'onBlur'],
            })(
              <Input placeholder="默认值" />
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
          >
            {getFieldDecorator(`dims-inputtype-${k}`, {
              initialValue: iDim(k, 'inputtype', 'radio'),
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
            />
            删除
          </Button>
        </td>
      </tr>
    )
  })


  getFieldDecorator('quotes', { initialValue: quoteKeys })
  quoteKeys = getFieldValue('quotes')
  let quoteItems = quoteKeys.map((k) => {
    return (
      <tr key={`quote_${k}`}>
        <td>
          <FormItem formItemLayoutWithoutLabel
          >
            {getFieldDecorator(`quotes-name-${k}`, {
              initialValue: iQuote(k, 'name'),
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
            {getFieldDecorator(`quotes-group-${k}`, {
              initialValue: iQuote(k, 'group', 'default'),
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
            {getFieldDecorator(`quotes-desc-${k}`, {
              initialValue: iQuote(k, 'desc'),
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
            {getFieldDecorator(`quotes-field-${k}`, {
              initialValue: iQuote(k, 'field'),
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
            {getFieldDecorator(`quotes-type-${k}`, {
              initialValue: iQuote(k, 'data_type', 'int'),
              validateTrigger: ['onChange', 'onBlur'],
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
          >
            {getFieldDecorator(`quotes-precision-${k}`, {
              initialValue: iQuote(k, 'precision', '0'),
              validateTrigger: ['onChange', 'onBlur',],
              rules: [{
                required: true,
                type: 'number',
                message: '请输入数值精度',
              }],
            })(
              <InputNumber placeholder="数值精度" min={0} max={9} />
            )}
          </FormItem>
        </td>
        <td>
          <FormItem formItemLayoutWithoutLabel
          >
            {getFieldDecorator(`quotes-deftrend-${k}`, {
              valuePropName: 'checked',
              initialValue: iQuote(k, 'deftrend'),
            })(
              <Checkbox />
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

  return (
    <AModal {...modalOpts}>
      <Form layout="horizontal">
        <Tabs type="card">
          <TabPane tab="基本信息" key="basic">
            <FormItem label="报表名称：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name || '',
                rules: [
                  {
                    required: true,
                    message: '请输入报表名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="报表别名：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('alias', {
                initialValue: item.alias || '',
                rules: [
                  {
                    required: true,
                    message: '请输入报表别名',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="报表描述：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: true,
                    message: '请输入报表描述',
                  },
                ],
              })(<Input type="textarea" rows={4} />)}
            </FormItem>
            <FormItem label="数据表名：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('table_name', {
                initialValue: item.table_name,
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
                initialValue: item.table_type || 'none',
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
                  <th className={styles.w100}>字段名</th>
                  <th className={styles.w120}>值类型</th>
                  <th>维度值</th>
                  <th className={styles.w100}>默认值</th>
                  <th className={styles.w100}>控件类型</th>
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
                        <li>维度信息定义报表展示的过滤区域的UI呈现以及这些过滤区域的初始化数据的来源。</li>
                        <li>维度名称：过滤控件的中文或英文可读性强的名称。</li>
                        <li>字段名：对应数据表中维度字段的名称。</li>
                        <li>值类型：维度控件都有初始值，它们的值可以通过枚举或特定数据表两种方式来指定。</li>
                        <li>维度值： 对于维度值比较少的，采用穷举的方式列出，维度值使用英文逗号分割开。系统会自动对这些值进行索引，编号以1开始，逐个递增。使用特定维度表指定维度初始化值的，该字段选择“数据表”类型，然后在维度值字段输入维度表的名称。(eg: some_db.some_dim_name)</li>
                        <li>默认值：该值为报表展示时默认选中的维度值。每个维度都需要指定一个默认值。</li>
                        <li>控件类型：该字段用于控制报表展示维度过滤控件时选择单选模式还是多选模式。</li>
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
                  <th className={styles.w80}>默认曲线</th>
                  <th className={styles.op}>操作</th>
                </tr>
              </thead>
              <tbody>
                {quoteItems}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="8">
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
                        <li>默认曲线：对于趋势图而言，这里可以定制默认显示指标趋势线。</li>
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
