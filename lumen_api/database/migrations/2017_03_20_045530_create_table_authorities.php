<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAuthorities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('authorities', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('menu_id')->comment('菜单ID, -1并指定二级分类ID表示分类下面报表都有权限');
            $table->integer('p_id')->comment('二级分类ID');
            $table->text('auth_users')->comment('授权用户列表');
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
        Schema::drop('authorities');
    }
}
