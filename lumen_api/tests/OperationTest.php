<?php
$operate = function($operator) {
    switch($operator) {
        case '+':
            return function($a, $b) {
                return $a + $b;
            };
            break;
        case '-':
            return function($a, $b) {
                return $a - $b;
            };
            break;
        case '*':
            return function($a, $b) {
                return $a * $b;
            };
            break;
        case '/':
            return function($a, $b) {
                return $a / $b;
            };
            break;
    }
};


$addition = $operate('+');
echo $addition(1, 2) . PHP_EOL;


$subtraction = $operate('-');
echo $subtraction(3, 1) . PHP_EOL;

$multiplication = $operate('*');
echo $multiplication(2, 3) . PHP_EOL;

$divide = $operate('/');
echo $divide(6, 3) . PHP_EOL;
