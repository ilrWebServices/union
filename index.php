<?php

require __DIR__ . '/vendor/autoload.php';

use Union\Union;

$union = new Union;

$components = $union->getComponents();

foreach ($components as $component) {
  // print_r($component);
  // var_dump($component->template->getPath());
  // var_dump($component->getLibrary());
}

$banner = $union->getComponent('_logo');

var_dump($banner);
