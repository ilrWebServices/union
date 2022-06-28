<?php

namespace Union;

use Symfony\Component\Yaml\Yaml;

class UnionComponent {

  public $componentId;

  public $template;

  public $css;

  public $js;

  public function __construct($component_id, $template, $css = null, $js = null) {
    $this->componentId = $component_id;
    $this->template = $template;
    $this->css = $css;
    $this->js = $js;
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
    $library = [
      'css' => [
        $this->css->getRealPath(),
      ],
      'js' => [
        $this->js->getRealPath(),
      ],
    ];

    return $library;
  }

}
