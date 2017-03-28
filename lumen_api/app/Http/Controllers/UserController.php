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

        $env = app()->environment();

        if (!$this->isAdmin($username)) {
            // 非管理员不允许登陆
            $response = [
                'code' => 200,
                'data' => [
                    'msg' => '非管理员，禁止登陆',
                    'status' => 99,
                ],
            ];
        } else if ($env === 'local') {
            $response = [
                'code' => 200,
                'data' => [
                    'status' => 0,
                    'msg' => '登陆成功',
                    'data' => [
                        'username' => $username,
                        'email' => $username . '@jd.com',
                        'mobile' => '13232323232',
                        'fullname' => 'xxxx',
                        'userId' => 992349,
                    ]
                ]
            ];
        } else {
            $url = env('APP_SSO_URL');
            $result = $this->ssoCurl($url, $username, $password);
            if ($result['REQ_CODE'] == 1) {
                $response = [
                    'code' => 200,
                    'data' => [
                        'status' => 0,
                        'msg' => $result['REQ_MSG'],
                        'data' => $result['REQ_DATA']
                    ],
                ];
            } else {
                $response = [
                    'code' => 200,
                    'data' => [
                        'status' => 1,
                        'msg' => '登陆验证失败'
                    ],
                ];
            }
        }
        return response()->json($response, $response['code']);
    }
    public function isAdmin($username) {
        $adminList = env('APP_ADMIN_LIST');
        $adminList = explode(',', $adminList);

        if(in_array($username, $adminList)) {
            return true;
        }

        return false;
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

    /**
     * @desc HTTP方式的登陆验证
     */
    protected function ssoCurl($url, $username, $password) {
        $password = md5($password);
        $url = $url . '?username=' . $username . '&password=' . $password;
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

            $return = curl_exec($ch);
            curl_close($ch);
            $result = json_decode($return, true);
        } catch (Exception $e) { // 异常
            $result = array(
                'REQ_CODE' => 9999,
                'REQ_DATA' => array(),
                'REQ_FLAG' => 1,
                'REQ_MSG' => $e->getMessage()
            );
        }
        return $result;
    }
}
