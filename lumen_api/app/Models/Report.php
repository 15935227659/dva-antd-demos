<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class Report extends Model
{
    use BaseModelTrait;
    protected $fillable = [
        'name', 'alias', 'description', 'creator',
        'group_id', 'db_id', 'table_name',
        'table_type', 'dims', 'quotes',
    ];

    public static function search(Request $request)
    {

        $result = [];
        $name = $request->input('name') ?? 'basic';

        $end = $request->input('end') ?? date('Y-m-d', strtotime('-1 day'));
        $start = $request->input('start') ?? date('Y-m-d', strtotime('-15 day'));

        $days = ceil((strtotime($end) - strtotime($start)) % 86400);

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

        $newRes = [];
        foreach($result as $row) {
            $row->key = strtotime($row->dt);
            $newRes[$row->dt] = $row;
        }
        $result = array();

        for($et = strtotime($end), $st = strtotime($start); $et >= $st; $et = $et - 86400) {
            $theDay = date('Y-m-d', $et);
            if(!isset($newRes[$theDay])) {
                $row = new \stdClass();
                $row->dt = $theDay;
                $row->key = $et;
                $result[] = $row;
            } else {
                $result[] = $newRes[$theDay];
            }
        }
        return $result;
    }
}
