<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Category';
    protected $validationRules = [];

    public function login(Request $request) {
        $username = $request->input('username');
        $password = $request->input('password');

        $response = [
            'code' => 200,
            'status' => 'success',
        ];
        if ($username == 'qiaoguoqiang' && $password == '123456') {
            $response['data'] = [ 'username' => $username ];
            return response()->json($response, $response['code']);
        }
        $response['status'] = 'failed';
        return response()->json($response, $response['code']);
    }

    public function logout(Request $request) {
        return $this->showResponse($request->all());
    }


    public function info(Request $request) {
        $response = [
            'code' => 200,
            'status' => 'success',
        ];
        if (0) {
            return response()->json($response, $response['code']);
        }
        $response['status'] = 'failed';
        return response()->json($response, $response['code']);

    }
}
