<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Report';
    protected $validationRules = [];

    const T_INT        = 1;  // 整数
    const T_DOUBLE     = 2;  // 浮点数
    const T_PERCENTAGE = 3;  // 百分数
    /**
     * @desc 获取指标数据
     */
    public function quotes(Request $request)
    {
        $m = self::MODEL;
        return $this->listResponse($m::search($request));
    }


    /**
     * @desc 获取元数据信息，包括维度和指标相关的基础信息
     */
    public function metas(Request $request)
    {
        $result = [
            'dims' => [
                'time' => [
                    'type' => 'day-range',
                    'has_compare' => true,
                    'has_shortcut' => true,
                    'start' => date('Y-m-d', strtotime('-14 day')),
                    'end' => date('Y-m-d', strtotime('-1 day')),
                    'compare' => false,
                    'compare_start' => '',
                    'compare_end' => '',
                ],
                'dim_type' => [
                    'name' => '终端',
                    'type' => 'single',
                    'list' => [
                        ['name' => 'PC', 'value' => 1],
                        ['name' => 'APP', 'value' => 2],
                        ['name' => 'M端', 'value' => 3],
                        ['name' => '微信', 'value' => 4],
                        ['name' => '手Q', 'value' => 5],
                    ],
                    'default' => 4,
                ],
                'gmv_type' => [
                    'name' => '订单状态',
                    'type' => 'single',
                    'list' => [
                        ['name' => '下单', 'value' => 1],
                        ['name' => '出库', 'value' => 2],
                        ['name' => '完成', 'value' => 3],
                    ],
                    'default' => 1,
                ],
                'dim_det' => [
                    'name' => '业务',
                    'type' => 'single',
                    'list' => [
                        ['name' => '搜索', 'value' => 1],
                        ['name' => '推荐', 'value' => 2],
                    ],
                    'default' => 1,
                ],
            ],
            'quotes' => [
                'list' => [
                    'count_all_u' => [
                        'name' => '全站用户',
                        'desc' => '全站用户',
                        'p_id' => 2,
                        'field' => 'count_all_u',
                        'sum_field' => 'count_all_u',
                        'data_type' => self::T_INT,
                        'precision' => 2,
                    ],
                    'gmv' => [
                        'name' => '产品GMV',
                        'desc' => '产品GMV',
                        'p_id' => 2,
                        'field' => 'gmv',
                        'sum_field' => 'gmv',
                        'data_type' => self::T_INT,
                        'precision' => 2,
                    ],
                    'active_u' => [
                        'name' => '活跃用户数',
                        'desc' => '活跃用户数',
                        'p_id' => 2,
                        'field' => 'active_u',
                        'sum_field' => 'active_u',
                        'data_type' => self::T_INT,
                        'precision' => 2,
                    ],
                    'count_line' => [
                        'name' => '订单行',
                        'desc' => '订单行',
                        'p_id' => 2,
                        'field' => 'count_line',
                        'sum_field' => 'count_line',
                        'data_type' => self::T_INT,
                        'precision' => 2,
                    ],
                    'PV' => [
                        'name' => 'PV量',
                        'desc' => 'PV量',
                        'p_id' => 2,
                        'field' => 'PV',
                        'sum_field' => 'PV',
                        'data_type' => self::T_INT,
                        'precision' => 2,
                    ],
                    'click_count' => [
                        'name' => '点击量',
                        'desc' => '点击量',
                        'p_id' => 2,
                        'field' => 'click_count',
                        'sum_field' => 'click_count',
                        'data_type' => self::T_INT,
                        'precision' => 2,
                    ],
                    'value_uv_all' => [
                        'name' => '全站用户价值',
                        'desc' => '全站用户价值',
                        'p_id' => 2,
                        'field' => 'value_uv_all',
                        'sum_field' => 'value_uv_all',
                        'data_type' => self::T_DOUBLE,
                        'precision' => 2,
                    ],
                    'value_uv' => [
                        'name' => '活跃用户UV价值',
                        'desc' => '活跃用户UV价值',
                        'p_id' => 2,
                        'field' => 'value_uv',
                        'sum_field' => 'value_uv',
                        'data_type' => self::T_DOUBLE,
                        'precision' => 2,
                    ],
                    'uv_change_rate' => [
                        'name' => '用户转化率',
                        'desc' => '用户转化率',
                        'p_id' => 2,
                        'field' => 'uv_change_rate',
                        'sum_field' => 'uv_change_rate',
                        'data_type' => self::T_PERCENTAGE,
                        'precision' => 2,
                    ],
                    'order_avg' => [
                        'name' => '下单客单价',
                        'desc' => '下单客单价',
                        'p_id' => 2,
                        'field' => 'order_avg',
                        'sum_field' => 'order_avg',
                        'data_type' => self::T_DOUBLE,
                        'precision' => 2,
                    ],
                    'pv_change_rate' => [
                        'name' => 'PV转化率',
                        'desc' => 'PV转化率',
                        'p_id' => 2,
                        'field' => 'pv_change_rate',
                        'sum_field' => 'pv_change_rate',
                        'data_type' => self::T_PERCENTAGE,
                        'precision' => 2,
                    ],
                    'pv_avg' => [
                        'name' => '人均PV',
                        'desc' => '人均PV',
                        'p_id' => 2,
                        'field' => 'pv_avg',
                        'sum_field' => 'pv_avg',
                        'data_type' => self::T_DOUBLE,
                        'precision' => 2,
                    ],
                    'ctr' => [
                        'name' => 'CTR',
                        'desc' => 'CTR(点击量/PV量)',
                        'p_id' => 2,
                        'field' => 'ctr',
                        'sum_field' => 'ctr',
                        'data_type' => self::T_DOUBLE,
                        'precision' => 2,
                    ],
                    'click_change_rate' => [
                        'name' => '点击转化率',
                        'desc' => '点击转化率',
                        'p_id' => 2,
                        'field' => 'click_change_rate',
                        'sum_field' => 'click_change_rate',
                        'data_type' => self::T_PERCENTAGE,
                        'precision' => 2,
                    ],
                    'return_rate_7' => [
                        'name' => '7日回访率',
                        'desc' => '7日回访率',
                        'p_id' => 2,
                        'field' => 'return_rate_7',
                        'sum_field' => 'return_rate_7',
                        'data_type' => self::T_PERCENTAGE,
                        'precision' => 2,
                    ],
                ],
                'selected' => ['count_all_u'],
                'types' => [
                    'int' => self::T_INT,
                    'double' => self::T_DOUBLE,
                    'percentage' => self::T_PERCENTAGE,
                ],
                'groups' => [
                    [ 'name' => '流量', 'value' => 1 ],
                    [ 'name' => '流水', 'value' => 2 ],
                    [ 'name' => '转化', 'value' => 3 ],
                    [ 'name' => '其他', 'value' => 4 ],
                ]
            ],
        ];
        $response = [
            'code' => 200,
            'status' => 'success',
            'data' => $result,
        ];
        return response()->json($response, $response['code']);
    }
}
