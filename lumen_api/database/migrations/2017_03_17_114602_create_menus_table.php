<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMenusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('p_id')->comment('二级业务分类id');
            $table->string('menu_name')->comment('菜单名称');
            $table->string('menu_url')->comment('菜单URI');
            $table->string('data_source')->comment('数据源,维度等信息，后续再扩展该字段');
            $table->string('data_owner')->comment('数据源负责人');
            $table->string('form_owner')->comment('报表负责人');
            $table->string('sort_order')->comment('排序编号');
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
        Schema::drop('menus');
    }
}
