<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSortFiltersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sort_filters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('keyword')->comment('关键词');
            $table->tinyInteger('isopen')->comment('是否打开');
            $table->integer('platform')->default(15)->comment('生效平台 QQ=1 WECHAT=2 APP=4 WEB=8 H5=16, 默认前四个之和');
            $table->dateTime('starttime')->comment('生效开始时间');
            $table->dateTime('endtime')->comment('生效结束时间');
            $table->tinyInteger('ispub')->default(0)->comment('是否已发布');
            $table->tinyInteger('isdelete')->default(0)->comment('是否已删除');
            $table->string('optuser', 64)->comment('操作用户');
            $table->dateTime('createtime')->default('1970-01-01 00:08:00')->comment('创建时间');
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
        Schema::drop('sort_filters');
    }
}
