<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class Authority  extends Model
{
    use BaseModelTrait;
    protected $fillable = ['p_id', 'menu_id', 'auth_users'];

    public static function search(Request $request)
    {
        $pagesize = $request->input('limit') ?? 20;

        $result = app('db')->table('authorities')
                    ->join('menus', 'menus.id', '=', 'authorities.menu_id')
                    ->join('categories', 'categories.cate2_id', '=', 'authorities.p_id')
                    ->select('authorities.*', 'menus.menu_name', 'menus.menu_url', 'categories.cate1_name', 'categories.cate2_name')
                    ->paginate($pagesize);
        return $result;
    }
}
