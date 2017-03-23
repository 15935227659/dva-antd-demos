<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class Category extends Model
{
    use BaseModelTrait;
    protected $fillable = ['cate1_id', 'cate1_name', 'cate2_id', 'cate2_name', 'sort_order', 'icon_name'];

    public static function search(Request $request)
    {
        $pagesize = $request->input('limit') ?? 20;
        $result = app('db')->table('categories')
                    ->leftJoin('authorities', 'categories.cate2_id', '=', 'authorities.p_id')
                    ->select('categories.*', 'authorities.auth_users')
                    ->paginate($pagesize);

        return $result;
    }
}
