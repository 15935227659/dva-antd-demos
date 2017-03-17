<?php
namespace App\Http\Controllers;

use App\Models\Quote;

class QuoteController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\Quote';
    protected $validationRules = [];
}
