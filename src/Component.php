<?php

namespace Union;

use Symfony\Component\Yaml\Yaml;

class Component {

  protected $componentId;

  public $template;

  public $css = [];

  public $js = [];

  public function __construct($component_id, $template, array $css = [], array $js = []) {
    $this->componentId = $component_id;
    $this->template = $template;
    $this->css = $css;
    $this->js = $js;
  }

  public function id() {
    return $this->componentId;
  }

  /**
   * Render a component.
   *
   * @return string
   *   HTML markup or ???.
   */
  public function render() {

  }

  public function getLibrary() {
    $library = [];

    if ($this->css) {
      foreach ($this->css as $css_file) {
        $library['css'][] = $css_file->getRealPath();
      }
    }

    if ($this->js) {
      foreach ($this->js as $js_file) {
        $library['js'][] = $js_file->getRealPath();
      }
    }

    return $library;
  }

}
