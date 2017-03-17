<?php
$filename = '../blog.tar.gz';
function file_lines($filename)
{
    $file = fopen($filename, 'r');
    $key = 0;
    while(($line = fgets($file)) != false) {
        yield $key => $line;
        $key++;
    }

    fclose($file);
}

$m = memory_get_peak_usage();

foreach(file_lines($filename) as $key => $line) {
    echo $key, PHP_EOL;
}
echo memory_get_peak_usage() - $m, PHP_EOL;

$m = memory_get_peak_usage();
foreach(file($filename) as $l);
echo memory_get_peak_usage() - $m, PHP_EOL;
