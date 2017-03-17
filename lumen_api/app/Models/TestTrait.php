<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

trait TestTrait
{
    public static function bootTestTrait()
    {
        static::updating(function(Model $item) {
            $item->test = 23;
        });
    }
}
