<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class Quote extends Model
{
    use BaseModelTrait;
    protected $fillable = ['text', 'author', 'background', 'test'];

    public static function search(Request $request)
    {
        return static::all();
    }
}
