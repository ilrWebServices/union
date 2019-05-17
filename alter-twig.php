<?php

require __DIR__ . '/vendor/autoload.php';

use \Drupal\Core\Template\Attribute;

/**
 * @param Twig_Environment $env - The Twig Environment - https://twig.symfony.com/api/1.x/Twig_Environment.html
 * @param $config - Config of `@basalt/twig-renderer`
 */
function addCustomExtension(\Twig_Environment &$env, $config) {

  /**
   * Adds the dump() function and other debug functionality.
   */
  $env->addExtension(new \Twig_Extension_Debug());

  /**
   * Add the custom union_attributes function.
   */
  $env->addFunction(new \Twig_SimpleFunction('union_attributes', function($attributes) {
    return is_array($attributes) ? new Attribute($attributes) : $attributes;
  }));

  /**
   * Add the custom union_file function.
   *
   * @todo Implement this for patternlab integration.
   */
  $env->addFunction(new \Twig_SimpleFunction('union_file', function($filepath) {
    return $filepath;
  }));

  /**
   * Stub attach_library to prevent PL errors.
   */
  $env->addFunction(new Twig_SimpleFunction('attach_library', function($string) {
    return '';
  }));
}
