<?php
namespace App\Http\Controllers;

use App\Models\Quote;

class CategoryController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Category';
    protected $validationRules = [];
}
