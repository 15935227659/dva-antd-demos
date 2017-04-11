<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->comment('报表名称');
            $table->string('alias')->comment('报表别名');
            $table->string('description')->comment('报表描述');
            $table->integer('group_id')->comment('报表分组ID');
            $table->string('creator')->comment('报表创建者ERP');
            $table->string('db_id')->comment('报表数据库编号')->default(1);
            $table->string('table_name')->comment('报表数据表');
            $table->enum('table_type', ['day', 'month', 'year', 'none'])->comment('数据表分表类型')->default('none');
            $table->text('dims')->comment('维度信息');
            $table->longText('quotes')->comment('指标信息');
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
        Schema::drop('reports');
    }
}
