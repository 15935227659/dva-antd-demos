<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

trait BaseModelTrait
{
    public static function search(Request $request) {
        return static::take(10)
                    ->get();
    }

    public static function bootBaseModelTrait()
    {
        static::updating(function(Model $item){
        });
    }
}
