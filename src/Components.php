<?php

namespace Union;

class Components implements ComponentsInterface {

  protected $components = [];

  /**
   * {@inheritdoc}
   */
  public function getComponents($include_demo_data = FALSE) {
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

      $it = new \RecursiveDirectoryIterator(dirname($template->getRealPath()));
      $css_it = new \RegexIterator($it, '/.+\.css$/');

      foreach ($css_it as $css_file) {
        $this->components[$component_id]->addCss($css_file);
      }

      $js_it = new \RegexIterator($it, '/.+\.js$/');

      foreach ($js_it as $js_file) {
        $this->components[$component_id]->addJs($js_file);
      }

      if ($include_demo_data) {
        $data_it = new \RegexIterator($it, "/$component_id\.data\.yml$/");

        foreach ($data_it as $data_file) {
          $this->components[$component_id]->addDemoData($data_file);
        }
      }
    }

    return $this->components;
  }

  /**
   * {@inheritdoc}
   */
  public function getComponent($component_id, $include_demo_data = FALSE) {
    if (empty($this->components)) {
      $this->getComponents($include_demo_data);
    }

    if (isset($this->components[$component_id])) {
      return $this->components[$component_id];
    }

    return FALSE;
  }

}
