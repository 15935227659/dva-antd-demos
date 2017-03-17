<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCategories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cate1_id')->comment('一级业务分类id');
            $table->string('cate1_name')->comment('一级业务分类名称');
            $table->unsignedInteger('cate2_id')->comment('二级业务分类id');
            $table->string('cate2_name')->comment('二级业务分类名称');
            $table->unsignedInteger('sort_order')->comment('排序编号');
            $table->string('icon_name')->comment('图标名称，图片名');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('categories');
    }
}
