<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Cutf8Py;

class ReportController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Report';
    protected $validationRules = [];

    const T_INT        = 1;  // 整数
    const T_DOUBLE     = 2;  // 浮点数
    const T_PERCENTAGE = 3;  // 百分数

    public function store(Request $request)
    {
        $m = self::MODEL;

        $rDims = $request->input('dims') ?? [];
        $rQuotes = $request->input('quotes') ?? [];

        $dims = [];
        $quotes = [];

        if(sizeof($rQuotes)) {
            foreach($rQuotes as $index) {
                $group = $request->input('quotes-group-' . $index);
                $qItem = [
                    'name' => $request->input('quotes-name-' . $index),
                    'desc' => $request->input('quotes-desc-' . $index),
                    'field' => $request->input('quotes-field-' . $index),
                    'data_type' => $request->input('quotes-type-' . $index),
                    'group' => $group,
                    'deftrend' => !!$request->input('quotes-deftrend-' . $index),
                    'precision' => $request->input('quotes-precision-' . $index),
                ];

                $quotes[] = $qItem;
            }
        }

        if(sizeof($rDims)) {
            foreach($rDims as $dIndex) {
                $alias = $request->input('dims-alias-' . $dIndex);
                $dims[] = [
                    'alias' => $alias,
                    'name' => $request->input('dims-name-' . $dIndex),
                    'value' => $request->input('dims-value-' . $dIndex),
                    'vtype' => $request->input('dims-vtype-' . $dIndex),
                    'default' => $request->input('dims-default-' . $dIndex),
                    'inputtype' => $request->input('dims-inputtype-' . $dIndex),
                ];
            }
        }

        $record = [
            'name' => $request->input('name'),
            'alias' => $request->input('alias'),
            'description' => $request->input('description'),
            'creator' => $request->input('username') ?? '',
            'group_id' => $request->input('group_id') ?? 0,
            'db_id' => $request->input('db_id') ?? 1,
            'table_name' => $request->input('table_name') ?? '',
            'table_type' => $request->input('table_type') ?? 'none',
            'dims' => json_encode($dims),
            'quotes' => json_encode($quotes),
        ];

        $data = $m::create($record);
        return $this->createdResponse($data);
    }

    /**
     * @desc 更新保存
     */
    public function update($id, Request $request)
    {
        $m = self::MODEL;
        if(!$data = $m::find($id))
        {
            return $this->notFoundResponse();
        }

        $rDims = $request->input('dims') ?? [];
        $rQuotes = $request->input('quotes') ?? [];

        $dims = [];
        $quotes = [];

        if(sizeof($rQuotes)) {
            foreach($rQuotes as $index) {
                $group = $request->input('quotes-group-' . $index);
                $qItem = [
                    'name' => $request->input('quotes-name-' . $index),
                    'desc' => $request->input('quotes-desc-' . $index),
                    'field' => $request->input('quotes-field-' . $index),
                    'data_type' => $request->input('quotes-type-' . $index),
                    'group' => $group,
                    'deftrend' => !!$request->input('quotes-deftrend-' . $index),
                    'precision' => $request->input('quotes-precision-' . $index),
                ];

                $quotes[] = $qItem;
            }
        }

        if(sizeof($rDims)) {
            foreach($rDims as $dIndex) {
                $alias = $request->input('dims-alias-' . $dIndex);

                $dims[] = [
                    'alias' => $alias,
                    'name' => $request->input('dims-name-' . $dIndex),
                    'value' => $request->input('dims-value-' . $dIndex),
                    'vtype' => $request->input('dims-vtype-' . $dIndex),
                    'default' => $request->input('dims-default-' . $dIndex),
                    'inputtype' => $request->input('dims-inputtype-' . $dIndex),
                ];
            }
        }

        $record = [
            'name' => $request->input('name'),
            'alias' => $request->input('alias'),
            'description' => $request->input('description'),
            'group_id' => $request->input('group_id') ?? 0,
            'db_id' => $request->input('db_id') ?? 1,
            'table_name' => $request->input('table_name') ?? '',
            'table_type' => $request->input('table_type') ?? 'none',
            'dims' => json_encode($dims),
            'quotes' => json_encode($quotes),
        ];

        $data->fill($record);
        $data->save();
        return $this->showResponse($data);
    }

    /**
     * @desc 获取指标数据
     */
    public function quotes(Request $request)
    {
        $m = self::MODEL;
        $path = $request->input('path');
        if($path === '') {
            return $this->clientErrorResponse([]);
        }

        $reportInfo = $this->reportInfo($path);
        return $this->listResponse($m::datas($request, $reportInfo));
    }

    public function reportInfo($path) {
        $m = self::MODEL;
        return $m::info($path);
    }

    private function _getDims($configDims) {
        $dims = [
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
        ];

        if(sizeof($configDims)) {
            foreach($configDims as $dim) {
                if($dim['vtype'] === 'enum') {
                    $values = explode(',', $dim['value']);
                    $list = [];
                    foreach($values as $key => $value) {
                        $list[] = [
                            'name' => $value,
                            'value' => $key + 1,
                        ];
                    }
                }
                $default = array_search($dim['default'], $values);
                if($default === false) {
                    $default = 1; // 使用第一个值
                } else {
                    $default = $default + 1;
                }
                $dims[$dim['alias']] = [
                    'name' => $dim['name'],
                    'type' => $dim['inputtype'],
                    'list' => $list,
                    'default' => $default,
                ];
            }
        }

        return $dims;
    }


    private function _getQuotes($configQuotes) {
        $quotes = [];
        $selected = [];
        if(sizeof($configQuotes)) {
            foreach($configQuotes as $quote) {
                $groupName = $quote['group'];
                $groupPy = Cutf8Py::encodeGBK($groupName, 'all');
                $quote['value'] = $quote['field'];
                $quotes[$groupPy][] = $quote;
                if ($quote['deftrend']) {
                    $selected[] = $quote['value'];
                }
            }
        }

        $list = [];
        foreach($quotes as $group => $qs) {
            $list[] = [
                'name' => $qs[0]['group'],
                'desc' => $qs[0]['group'],
                'value' => $group,
                'child' => $qs,
            ];
        }

        return [
            'list' => $list,
            'selected' => $selected,
            'types' => [
                'int' => self::T_INT,
                'double' => self::T_DOUBLE,
                'percentage' => self::T_PERCENTAGE,
            ],
        ];
    }

    /**
     * @desc 获取元数据信息，包括维度和指标相关的基础信息
     */
    public function metas(Request $request)
    {
        $path = $request->input('path');
        if($path === '') {
            return $this->clientErrorResponse([]);
        }

        $reportInfo = $this->reportInfo($path);
        $configDims = json_decode($reportInfo->dims, true);
        $configQuotes = json_decode($reportInfo->quotes, true);
        $dims = $this->_getDims($configDims);
        $quotes = $this->_getQuotes($configQuotes);
        $result = [
            'info' => $reportInfo,
            'dims' => $dims,
            'quotes' => $quotes,
        ];
        $response = [
            'code' => 200,
            'status' => 'success',
            'data' => $result,
        ];
        return response()->json($response, $response['code']);
    }
}
