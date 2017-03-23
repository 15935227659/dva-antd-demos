<?php
namespace App\Http\Controllers;

use App\Models\Authority;
use Illuminate\Http\Request;

class AuthorityController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Authority';
    protected $validationRules = [];

    /**
     * @desc 保存权限
     */
    public function store(Request $request)
    {
        $authType = $request->input('type');
        $pid = $request->input('p_id');
        $authUsers = $request->input('auth_users');
        if ($authType !== 'cate' && $authType !== 'menu') {
            return $this->clientErrorResponse(['error' => '参数错误']);
        }

        $m = self::MODEL;
        if ($authType === 'cate') {
            if ($m::where('p_id', '=', $pid)->count()) { // 已经存在, 先删除
                $m::where('p_id', '=', $pid)->delete();
            }

            $data = $m::create(['p_id' => $pid, 'auth_users' => $authUsers, 'menu_id' => -1]);
        } else {
            $menuId = $request->input('menu_id');
            if($menuId !== '-1') {
                if ($m::where('menu_id', '=', $menuId)->count()) { // 已经存在, 先删除
                    $m::where('menu_id', '=', $menuId)->delete();
                }

                $data = $m::create(['menu_id' => $menuId, 'p_id' => $pid, 'auth_users' => $authUsers]);
            } else {
                return $this->clientErrorResponse(['error' => '参数错误']);
            }
        }
        return $this->createdResponse($data);
    }
}
