<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

trait BaseModelTrait
{
    public static function search(Request $request) {
        $ispub = $request->input('ispub', 0);
        $isdelete = $request->input('isdelete', 0);
        $isopen = $request->input('isopen', 1);
        return static::where('ispub', $ispub)
                    ->where('isdelete', $isdelete)
                    ->where('isopen', $isopen)
                    ->take(10)
                    ->get();
    }

    public static function bootBaseModelTrait()
    {
        static::updating(function(Model $item){
        });
    }
}
