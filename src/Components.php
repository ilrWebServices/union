<?php

namespace Union;

class Components implements ComponentsInterface {

  protected $components = [];

  /**
   * {@inheritdoc}
   */
  public function getComponents() {
    $it = new \RecursiveDirectoryIterator(__DIR__ . '/../components');
    $it = new \RecursiveIteratorIterator($it);
    $it = new \RegexIterator($it, '/.+_.*\.twig$/');

    /** @var \SplFileInfo $file */
    foreach ($it as $template) {
      $component_id = $template->getBasename('.twig');

      $this->components[$component_id] = new Component(
        $component_id,
        $template
      );

      $css_it = new \RecursiveDirectoryIterator(dirname($template->getRealPath()));
      $css_it = new \RegexIterator($css_it, '/.+\.css$/');

      foreach ($css_it as $css_file) {
        // dump($css_file);
        $this->components[$component_id]->addCss($css_file);
      }

      $js_it = new \RecursiveDirectoryIterator(dirname($template->getRealPath()));
      $js_it = new \RegexIterator($js_it, '/.+\.js$/');

      foreach ($js_it as $js_file) {
        $this->components[$component_id]->addJs($js_file);
      }

      $yml_it = new \RecursiveDirectoryIterator(dirname($template->getRealPath()));
      $yml_it = new \RegexIterator($yml_it, '/.+\.yml$/');

      foreach ($yml_it as $data_file) {
        $this->components[$component_id]->addData($data_file);
      }
    }

    return $this->components;
  }

  /**
   * {@inheritdoc}
   */
  public function getComponent($component_id) {
    if (empty($this->components)) {
      $this->getComponents();
    }

    if (isset($this->components[$component_id])) {
      return $this->components[$component_id];
    }

    return FALSE;
  }

}
