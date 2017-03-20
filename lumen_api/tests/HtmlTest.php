<?php
function html($code, $id = '', $class = '')
{
    if($id !== '') $id = ' id="' . $id . '"';

    $class = ($class !== '') ? ' class="' . $class . '"' : '';

    $open = '<' . $code . $id . $class . '>';
    $close = '</' . $code . '>';


    return function ($inner = "") use ($open, $close) {
        return $open . $inner . $close;
    };
}


$tpl = html('div', 'test', 'test');
echo $tpl('hello world');
echo PHP_EOL;

echo $tpl('Your are here');
echo PHP_EOL;
