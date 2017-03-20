<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class SortFilters extends Model
{
    /**
     * @desc 通用方法trait
     */
    use BaseModelTrait;

    protected $fillable = ['keyword', 'isopen', 'optuser', 'starttime', 'endtime', 'createtime', 'ispub', 'isdelete', 'platform'];

}
