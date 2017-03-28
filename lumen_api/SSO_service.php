<?php
class CI_SSO_service {
    // SOAP相关的属性
    private static $wsdl = 'http://erp1.360buy.com/hrmservice/DeptWebService.asmx?wsdl';
    private static $proxy_host = '10.198.15.170';
    private static $proxy_port = 80;
    private static $sso_url = 'http://ssa.jd.com/sso/verify';

    // cookie中存储用户信息的key
    private static $cookie_key_des = 'SSO_Ticket';

    // des 加密密匙
    private static $crypt_key_des = 'D3B5B85B';

    // 在session中存储用户信息的key值
    private static $session_key_ticket = 'D3B5B85B-35F3-48D9-83ED-CDAF536EE7B9';

    // name field name ;
    private static $field_name = 'user';

    // password field name
    private static $field_pass = 'password';


    public static function login() {
        $result = array('code' => 0, 'msg' => 'success');
        // 已经登录则直接返回
        if(self::login_check()) {
            return $result;
        }
        //没有session和cookie则进行验证
        $CI = & get_instance();
        $ticket = new Ticket();

        $verify = self::verify();

        if($verify['code'] == 0) {
            $ticket->login_name = $verify['data']['username'];
            $ticket->email = $verify['data']['email'];
            //登录成功设置cookie与session登录态
            self::login_success($ticket, $verify['data']['userId']);
            return $result;
        }

        return array(
            'code' => 1,
            'msg' => '登录失败，请重试',
        );
    }

    public static function logout() {
        $CI = & get_instance();
        $CI->load->library('session');
        $CI->load->helper('cookie');


        //清除session
        $CI->session->set_userdata(self::$session_key_ticket, '');

        //删除cookie
        delete_cookie(self::$cookie_key_des);

        header("location: /");
    }

    /**
     * 登录成功后在Session存入Ticket对象，在Cookie存入加密用户信息
     *
     * @access private
     * @param Object $ticket
     * @param string $str_ticket
     * @return
     */
    private static function login_success($ticket, $id="")
    {
        $encrypt_ticket = self::des_encrypt($ticket);

        $CI = & get_instance();
        //保存当前登录用户信息至Session中
        $CI->load->library('session');
        $ticket = $CI->session->set_userdata(self::$session_key_ticket, $encrypt_ticket);

        $_SESSION['id'] = $id;
        //保存当前登录用户信息至Cookie中

        $cookie = array(
            'name' => self::$cookie_key_des,
            'value' => $encrypt_ticket,
            'expire' => 3600 * 24 * 365,
            'domain' => '',
            'path' => '/',
            'prefix' => '',
            'secure' => FALSE
        );
        $CI->input->set_cookie($cookie);
    }

    /**
     * 登录态检查，判断当前用户是否已经登录
     *
     * @access public
     * @param
     * @return
     */
    public static function login_check()
    {
        $ticket = self::get_cache_ticket();

        if ($ticket) {
            return true;
        }
        return false;
    }

    /**
     * 获取当前缓存中存储的加密用户信息对象(session & cookie)
     *
     * @access public
     * @param
     * @return
     */
    public static function get_cache_ticket()
    {
        $ticket = self::get_cookie_ticket();

        if (!$ticket) {
            $ticket = self::get_session_ticket();

        }

        return $ticket;
    }

    /**
     * 获取并解密Cookie存储的用户登录信息
     *
     * @access public
     * @param
     * @return Object
     */
    public static function get_cookie_ticket()
    {
        $CI = & get_instance();
        //$CI->load->library('cryptography');
        $CI->load->library('encrypt');
        $cookie_value_des = $CI->input->cookie(self::$cookie_key_des);

        //$user_info = Cryptography::des_decrypt($cookie_value_des, self::$crypt_key_des);
        $user_info = $CI->encrypt->decode($cookie_value_des);

        if ($user_info) {
            $tick = new Ticket();
            $user_info = explode(',', $user_info);
            $tick->login_name = $user_info[0];
            $tick->email = isset($user_info[1]) ? $user_info[1] : '';
            return $tick;
        }
        return false;
    }

    /**
     * 获取session中存储的用户信息
     *
     * @access public
     * @param
     * @return Object
     */
    public static function get_session_ticket()
    {
        $CI = & get_instance();
        $CI->load->library('session');
        //$CI->load->library('Cryptography');
        $CI->load->library('encrypt');
        $session_value_des = $CI->session->userdata(self::$session_key_ticket);
        //$user_info = Cryptography::des_decrypt($session_value_des, self::$crypt_key_des);
        $user_info = $CI->encrypt->decode($session_value_des);
        if ($user_info) {
            $tick = new Ticket();
            $user_info = explode(',', $user_info);
            $tick->login_name = $user_info[0];
            $tick->email = isset($user_info[1]) ? $user_info[1] : '';
            return $tick;
        }
        return false;
    }

    public static function sso_curl($url, $username, $password) {
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

    public static function verify() {
        $CI = & get_instance();

        $username = $CI->input->post(self::$field_name);
        $password = $CI->input->post(self::$field_pass);

        $result = array();
        if(ENVIRONMENT == 'jddev' || ENVIRONMENT == 'development') {
            $result = array(
                'code' => 0,
                'data' => array(
                    'username' => $username,
                    'email' => $username . '@jd.com',
                    'mobile' => '13232323232',
                    'fullname' => 'xxxx',
                    'userId' => 992349,
                ),
                'msg' => 'success'
            );
        } else {
            $data = self::sso_curl(self::$sso_url, $username, $password);
            if($data['REQ_CODE'] === 1) { // success
                $result['code'] = 0;
                $result['data'] = $data['REQ_DATA'];
                $result['msg'] = $data['REQ_MSG'];
            } else {
                $result['code'] = $data['REQ_CODE'] ? $data['REQ_CODE'] : '9990'; // 0 转换为其他值
                $result['msg'] = $data['REQ_MSG'];
            }
        }
        return $result;
    }

    /**
     * @desc 验证登录用户及密码
     */
    public static function verify_old() {
        $CI = & get_instance();

        $name = $CI->input->post(self::$field_name);
        $password = $CI->input->post(self::$field_pass);

        try{
            if(ENVIRONMENT == 'jddev') {
                return array(
                    'ret' => true,
                    'VerifyResult' => array(
                        'Id' => $name,
                        'Name' => $name,
                        'Email' => $name . '@jd.com',
                    ),
                );
            } else {
                $CI = & get_instance();
                $main_domain = $CI->config->item('main_domain');
                if($main_domain == 'jd.com') {
                    $soap = new SoapClient(self::$wsdl);
                } else {
                    $soap = new SoapClient(self::$wsdl, array('proxy_host'=>self::$proxy_host, 'proxy_port'=>self::$proxy_port));
                }
                $ret = $soap->Verify(array('name'=>$name, 'password'=>$password));

                $CI->load->helper('file');
                $login_log = date('Y-m-d H:i:s') . "\t" . $name . "\t" . serialize($ret) . "\n";
                write_file(dirname(APPPATH) . '/logs/' .basename(APPPATH). '_login-log.txt', $login_log, 'a+');
                $ret = (self::object_to_array($ret));

                if(!empty($ret['VerifyResult'])){
                    self::update_staff_info($ret['VerifyResult']);
                    //合法账号
                    return array('ret'=>true, 'VerifyResult'=>$ret['VerifyResult']);
                } else {
                    //非法账号
                    return array('ret'=>false, 'VerifyResult'=>array(), 'msg' => '非法账号');
                }
            }
        }catch(SoapFault $e){
            return array('ret' => false, 'msg' => $e->getMessage());
        }catch(Exception $e){
            return array('ret' => false, 'msg' => $e->getMessage());
        }
    }

    public function update_staff_info($info) {
        if(ENVIRONMENT == 'jddev') return;
        $CI = & get_instance();
        $staff = array(
            'employee_no' => isset($info['Id']) ? $info['Id'] : '',
            'erp_name' => isset($info['Name']) ? $info['Name'] : '',
            'alias_name' => isset($info['AliasName']) ? $info['AliasName'] : '',
            'city_id' => isset($info['CityId']) ? $info['CityId'] : '',
            'dept_name' => isset($info['Dept']) && isset($info['Dept']['Name']) ? $info['Dept']['Name'] : '',
            'dept_desc' => isset($info['Dept']) && isset($info['Dept']['Name']) ? $info['Dept']['Description'] : '',
            'dept_id' => isset($info['Dept']) && isset($info['Dept']['Id']) ? $info['Dept']['Id'] : '',
            'dept_pid' => isset($info['Dept']) && isset($info['Dept']['ParentId']) ? $info['Dept']['ParentId'] : '',
            'dept_type' => isset($info['Dept']) && isset($info['Dept']['Type']) ? $info['Dept']['Type'] : '',
            'employee_email' => isset($info['Email']) ? $info['Email'] : '',
            'phone' => isset($info['Phone']) ? $info['Phone'] : '',
            'position_id' => isset($info['PositionId']) ? $info['PositionId'] : '',
            'organization_id' => isset($info['OrganizationId']) ? $info['OrganizationId'] : '',
            'real_name' => isset($info['RealName']) ? $info['RealName'] : '',
        );
        $CI->load->database();
        $query = $CI->db->query('SELECT id FROM staff WHERE erp_name = "' . (isset($info['Name']) ? $info['Name'] : '') . '"');
        if($query->num_rows) {
            $id = $query->row_array();
            $id = $id['id'];
            $CI->db->update('staff', $staff, 'id = ' . (int) $id);
        } else {
            $CI->db->insert('staff', $staff);
        }
    }

    /**
     * @desc 对象转数组
     * @return array
     */
    public static function object_to_array($obj) {
        $arr = is_object($obj)? get_object_vars($obj) :$obj;
        foreach ($arr as $key => $val){
            $val=(is_array($val)) || is_object($val) ? self::object_to_array($val) :$val;
            $arr[$key] = $val;
        }
        return $arr;
    }

    /**
     * 对用户认证对象进行DES加密
     *
     * @access private
     * @param Object $ticket
     * @return string
     *
     */
    private static function des_encrypt($ticket)
    {
        $user_info = '%s,%s';
        $loginName = $ticket->login_name;
        $email = $ticket->email;
        $userInfo = sprintf($user_info,$loginName, $email);
        $CI = & get_instance();
        //$CI->load->library("Cryptography");
        $CI->load->library("encrypt");
        //return Cryptography::des($userInfo, self::$crypt_key_des);
        return $CI->encrypt->encode($userInfo);
    }
}

//用户认证对象，用于保存当前用户信息
class Ticket
{
    function __construct()
    {
    }
    public $login_name;
    public $email;
}
