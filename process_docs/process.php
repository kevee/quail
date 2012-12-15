<?php

$tests = (array)json_decode(file_get_contents('../js/quail/src/resources/tests.json'));

foreach($tests as $testname => &$test) {
  if(file_exists('../js/quail/docs/tests/'. $testname .'.rst')) {
    $file = file('../js/quail/docs/tests/'. $testname .'.rst');
    $test->readableName = $file[1];
    $test->docs = implode("\n", $file);
  }
}
$results = fopen('../tests/test_texts.json', 'w');
fwrite($results, json_encode($tests));
fclose($results);