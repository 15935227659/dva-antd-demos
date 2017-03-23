<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use App\Models\Category;

class MenuController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Menu';
    protected $validationRules = [];


    public function index(Request $request)
    {
        $m = self::MODEL;
        $menus = $m::search($request);
        $categories = Category::select()->get();

        $response = [
            'code' => 200,
            'status' => 'success',
            'data' => [
                'menus' => $menus,
                'categories' => $categories
            ],
        ];

        return response()->json($response, $response['code']);
    }
}
