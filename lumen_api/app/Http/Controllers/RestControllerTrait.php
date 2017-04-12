<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

/**
 * @desc Restful Controller Trait
 */
trait RestControllerTrait
{
    /**
     * @desc 列表信息
     */
    public function index(Request $request)
    {
        $m = self::MODEL;
        return $this->listResponse($m::search($request));
    }

    /**
     * @desc 详情信息
     */
    public function show($id)
    {
        $m = self::MODEL;
        if($data = $m::find($id))
        {
            return $this->showResponse($data);
        }
        return $this->notFoundResponse();
    }

    /**
     * @desc 新增保存
     */
    public function store(Request $request)
    {
        $m = self::MODEL;
        try
        {
            $v = \Validator::make($request->all(), $this->validationRules);
            if($v->fails())
            {
                throw new \Exception("ValidationException");
            }

            $data = $m::create($request->all());
            return $this->createdResponse($data);
        }catch(\Exception $ex)
        {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * @desc 更新保存
     */
    public function update($id, Request $request)
    {
        $m = self::MODEL;
        if(!$data = $m::find($id))
        {
            return $this->notFoundResponse();
        }
        try
        {
            $v = \Validator::make($request->all(), $this->validationRules);
            if($v->fails())
            {
                throw new \Exception("ValidationException");
            }

            $data->fill($request->all());
            $data->save();
            return $this->showResponse($data);
        }catch(\Exception $ex)
        {
            //$data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * @desc 删除
     */
    public function destroy($id, Request $request)
    {
        $m = self::MODEL;
        if(!$data = $m::find($id))
        {
            return $this->notFoundResponse();
        }
        $data->delete();
        return $this->deletedResponse();
    }

    /**
     * @desc 创建响应
     */
    protected function createdResponse($data)
    {
        $response = [
            'code' => 201,
            'status' => 'success',
            'data' => $data
        ];
        return response()->json($response, $response['code']);
    }

    /**
     */
    protected function showResponse($data)
    {
        $response = [
            'code' => 200,
            'status' => 'success',
            'data' => $data
        ];
        return response()->json($response, $response['code']);
    }

    protected function listResponse($data)
    {
        $response = [
            'code' => 200,
            'status' => 'success',
            'data' => $data
        ];
        return response()->json($response, $response['code']);
    }

    protected function notFoundResponse()
    {
        $response = [
            'code' => 404,
            'status' => 'error',
            'data' => 'Resource Not Found',
            'message' => 'Not Found'
        ];
        return response()->json($response, $response['code']);
    }

    /**
     * @desc 删除响应
     * 本来应该使用204响应码，无响应内容，但fetch的delete貌似处理不了
     */
    protected function deletedResponse()
    {
        $response = [
        'code' => 204, // 204 无返回?
            'status' => 'success',
            'data' => [],
            'message' => 'Resource deleted'
        ];
        return response()->json($response, $response['code']);
    }

    protected function clientErrorResponse($data)
    {
        $response = [
            'code' => 422,
            'status' => 'error',
            'data' => $data,
            'message' => 'Unprocessable entity'
        ];
        return response()->json($response, $response['code']);
    }
}
