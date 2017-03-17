<?php
$fib = function($n) use (&$fib) {
    if($n == 0 || $n == 1) return 1;

    return $fib($n - 1) + $fib($n - 2);
};

echo $fib(2) . PHP_EOL;

echo fibo(4) . PHP_EOL;
$lie = $fib;

$fib = function() {
    die("error" . PHP_EOL);
};

echo $lie(5);


function fibo($n) {
    if($n == 0 || $n == 1)
        return 1;

    return fibo($n - 2) + fibo($n - 1);
}

