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


    public function store(Request $request)
    {
        $m = self::MODEL;
        print_r($request->all());exit();
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
                    [
                        'name' => '基本',
                        'desc' => '',
                        'value' => 'basic',
                        'child' => [
                            [
                                'name' => '全站用户',
                                'desc' => '全站用户',
                                'value' => 'count_all_u',
                                'data_type' => self::T_INT,
                            ], [
                                'name' => '产品GMV',
                                'desc' => '产品GMV',
                                'value' => 'gmv',
                                'data_type' => self::T_INT,
                            ], [
                                'name' => '活跃用户数',
                                'desc' => '活跃用户数',
                                'value' => 'active_u',
                                'data_type' => self::T_INT,
                            ], [
                                'name' => '订单行',
                                'desc' => '订单行',
                                'value' => 'count_line',
                                'data_type' => self::T_INT,
                            ], [
                                'name' => 'PV量',
                                'desc' => 'PV量',
                                'value' => 'PV',
                                'data_type' => self::T_INT,
                            ], [
                                'name' => '点击量',
                                'desc' => '点击量',
                                'value' => 'click_count',
                                'data_type' => self::T_INT,
                            ],
                        ]
                    ], [
                        'name' => '转化',
                        'desc' => '',
                        'value' => 'rate',
                        'child' => [
                            [
                                'name' => '全站用户价值',
                                'desc' => '全站用户价值',
                                'value' => 'value_uv_all',
                                'data_type' => self::T_DOUBLE,
                            ], [
                                'name' => '活跃用户UV价值',
                                'desc' => '活跃用户UV价值',
                                'value' => 'value_uv',
                                'data_type' => self::T_DOUBLE,
                            ], [
                                'name' => '用户转化率',
                                'desc' => '用户转化率',
                                'value' => 'uv_change_rate',
                                'data_type' => self::T_PERCENTAGE,
                            ], [
                                'name' => '下单客单价',
                                'desc' => '下单客单价',
                                'value' => 'order_avg',
                                'data_type' => self::T_DOUBLE,
                            ], [
                                'name' => 'PV转化率',
                                'desc' => 'PV转化率',
                                'value' => 'pv_change_rate',
                                'data_type' => self::T_PERCENTAGE,
                            ], [
                                'name' => '点击转化率',
                                'desc' => '点击转化率',
                                'value' => 'click_change_rate',
                                'data_type' => self::T_PERCENTAGE,
                            ],
                        ],
                    ], [
                        'name' => '其他',
                        'desc' => '',
                        'value' => 'other',
                        'child' => [
                            [
                                'name' => '7日回访率',
                                'desc' => '7日回访率',
                                'value' => 'return_rate_7',
                                'data_type' => self::T_PERCENTAGE,
                            ], [
                                'name' => '人均PV',
                                'desc' => '人均PV',
                                'value' => 'pv_avg',
                                'data_type' => self::T_DOUBLE,
                            ], [
                                'name' => 'CTR',
                                'desc' => 'CTR(点击量/PV量)',
                                'value' => 'ctr',
                                'data_type' => self::T_PERCENTAGE,
                            ],
                        ],
                    ],
                ],
                'selected' => ['count_all_u'],
                'types' => [
                    'int' => self::T_INT,
                    'double' => self::T_DOUBLE,
                    'percentage' => self::T_PERCENTAGE,
                ],
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
