<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class Menu extends Model
{
    use BaseModelTrait;
    protected $fillable = ['p_id', 'menu_name', 'menu_url', 'data_source', 'data_owner', 'form_owner', 'sort_order'];

    public static function search(Request $request)
    {
        $pagesize = $request->input('limit') ?? 10;
        $field = $request->input('field');
        $keyword = $request->input('keyword');

        // security check here


        $result = app('db')->table('menus')
                    ->leftJoin('authorities', 'menus.id', '=', 'authorities.menu_id')
                    ->select('menus.*', 'authorities.auth_users');
        if($field && $keyword) {
            $result =  $result->where('menus.' . $field, 'like', '%' . $keyword . '%');
        }
        $result = $result->paginate($pagesize);

        return $result;
    }
}
