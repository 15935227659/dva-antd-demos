<?php
namespace App\Http\Controllers;

use App\Models\SortFilters;

class SortFiltersController extends Controller
{
    use RestControllerTrait;
    const MODEL = 'App\Models\SortFilters';
    protected $validationRules = [];
}
