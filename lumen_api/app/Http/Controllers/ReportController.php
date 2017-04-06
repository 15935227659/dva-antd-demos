<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Report';
    protected $validationRules = [];

    const T_INT = 1;  // 整数
    const T_DBL = 2;  // 浮点数
    const T_PCT = 3;  // 百分数
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
                'rcvr' => [
                    'name' => 'RCVR(订单行/请求数)',
                    'desc' => 'RCVR(订单行/请求数)',
                    'p_id' => 2,
                    'field' => 'rcvr',
                    'sum_field' => 'rcvr',
                    'data_type' => self::T_PCT,
                    'precision' => 2,
                    'chart_on' => false,
                    'table_on' => true,
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
