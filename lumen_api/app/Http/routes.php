<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

/**
 * @desc restful api function
 * @param $path
 * @param $controller
 * @param $base
 * @param $suffix
 * @return void
 */
function rest($api, $path, $controller = '', $base = 'App\\Http\\Controllers\\', $suffix = 'Controller') {
    // 控制器名字默认使用路径的首字母大写形式 ?驼峰?
    if($controller == '') {
        $controller = ucfirst(basename($path));
    }

    $ctrlName = $base . $controller .$suffix;
    $api->get($path,            $ctrlName . '@index');
    $api->get($path.'/{id}',    $ctrlName . '@show');
    $api->post($path,           $ctrlName . '@store');
    $api->put($path.'/{id}',    $ctrlName . '@update');
    $api->patch($path.'/{id}',    $ctrlName . '@update');
    $api->delete($path.'/{id}', $ctrlName . '@destroy');
}

$app->get('/', 'ExampleController@index');
$app->get('/version', function() use ($app) {
    return $app->version();
});

$api = $app['api.router'];
// 注意api版本号是通过header的Accept传递的
$api->version('v1', function ($api) {
    rest($api, 'quote');
    rest($api, 'category');
    rest($api, 'menu');
    rest($api, 'authority');

    $api->post('login', 'App\\Http\\Controllers\\UserController@login');
    $api->post('logout', 'App\\Http\\Controllers\\UserController@logout');
    $api->get('userInfo', 'App\\Http\\Controllers\\UserController@info');
    $api->get('reportData', 'App\\Http\\Controllers\\ReportController@quotes');
    $api->get('reportMeta', 'App\\Http\\Controllers\\ReportController@metas');
});
