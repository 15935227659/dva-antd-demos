<?php
$message = 'Hello';

// 没有 use
$example = function() {
    var_dump($message);
};

echo $example();

// 继承 $message
$example = function () use ($message) {
    var_dump($message);
};

echo $example();

// 继承变量值是在函数定义的时候，而不是函数被调用的时候
$message = 'World';
echo $example();


// 复位$message
$message = 'Hello';

// 引用继承
$example = function() use (&$message) {
    var_dump($message);
};

echo $example();

$message = 'World';
echo $example();

// 闭包还可以接受一般参数
$example = function($arg) use ($message) {
    var_dump($arg . ' ' . $message);
};

$example('Hello');
