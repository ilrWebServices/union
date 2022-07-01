<?php

require __DIR__ . '/vendor/autoload.php';

use Union\Components;

$components = new Components;

foreach ($components->getComponents() as $component) {
  echo '-------' . PHP_EOL;
  echo $component->id() . PHP_EOL;

  if ($component->getDescription()) {
    echo $component->getLabel() . PHP_EOL . PHP_EOL;
    echo $component->getDescription() . PHP_EOL . PHP_EOL;
    echo (new Parsedown())->text($component->getDescription()) . PHP_EOL . PHP_EOL;

    foreach ($component->getTemplateVars() as $var) {
      echo $var->getVariableName() . ' (' . $var->getType() . ')' . PHP_EOL;
      echo '  ' . $var->getDescription() . PHP_EOL . PHP_EOL;
    }
  }
  else {
    echo PHP_EOL;
  }
}


