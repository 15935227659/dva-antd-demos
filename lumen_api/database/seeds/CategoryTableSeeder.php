<?php
use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoryTableSeeder extends Seeder
{
    public function run()
    {
        Category::create([
            'cate1_id' =>  1,
            'cate1_name' => '搜索与大数据部',
            'cate2_id' => 101,
            'cate2_name' => '搜索',
            'sort_order' => 1,
            'icon_name' => 'circle'
        ]);
        Category::create([
            'cate1_id' =>  1,
            'cate1_name' => '搜索与大数据部',
            'cate2_id' => 102,
            'cate2_name' => '推荐',
            'sort_order' => 2,
            'icon_name' => 'circle'
        ]);
        Category::create([
            'cate1_id' =>  1,
            'cate1_name' => '搜索与大数据部',
            'cate2_id' => 103,
            'cate2_name' => '下拉',
            'sort_order' => 3,
            'icon_name' => 'circle'
        ]);
        Category::create([
            'cate1_id' =>  1,
            'cate1_name' => '搜索与大数据部',
            'cate2_id' => 104,
            'cate2_name' => '暗文',
            'sort_order' => 4,
            'icon_name' => 'circle'
        ]);
    }
}
