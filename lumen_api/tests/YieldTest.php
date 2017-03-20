<?php
function xrange($start, $limit, $step = 1) {
    for ($i = $start; $i <= $limit; $i += $step) {
        yield $i;
    }
}

foreach (xrange(1, 9, 1) as $number) {
    echo "$number " . PHP_EOL;
}

var_dump(xrange(1, 9, 1));


function nums()
{
    echo 'The generator has started' . PHP_EOL;
    for ($i = 0; $i < 5; ++$i) {
        $cmd = (yield $i);
        if ($cmd == 'stop') {
            return; // 退出generator
        }
        echo 'Yielded ' . $i . PHP_EOL;
    }
    echo 'The generator has ended'. PHP_EOL;
}
$gen = nums();

foreach($gen as $v) {
    if($v == 3) {
        $gen->send('stop');
    }

    echo $v . PHP_EOL;
}
