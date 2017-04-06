<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class Report extends Model
{
    use BaseModelTrait;

    public static function search(Request $request)
    {

        $result = [];
        $name = $request->input('name') ?? 'basic';

        $end = $request->input('end') ?? date('Y-m-d', strtotime('-1 day'));
        $start = $request->input('start') ?? date('Y-m-d', strtotime('-15 day'));
        $terminal = $request->input('dim_type') ?? 4; // 默认微信
        $orderStatus = $request->input('gmv_type') ?? 1; // 下单
        $bizzType = $request->input('dim_det') ?? 1; // 搜索业务
        $orderType = 1;
        $result = app('db')->connection('reports')->table('app_rec_general')
                  ->where('dim_det', '=', $bizzType)
                  ->where('gmv_type', '=', $orderStatus)
                  ->where('dim_type', '=', $terminal)
                  ->where('order_type', '=', $orderType)
                  ->whereBetween('dt', [$start, $end])
                  ->orderBy('dt', 'DESC')
                  ->get();
        return $result;
    }
}
