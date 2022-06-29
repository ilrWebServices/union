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
      $css = new \SplFileInfo(dirname($template->getRealPath()) . '/' . str_replace('_', '', $component_id . '.css'));
      $js = new \SplFileInfo(dirname($template->getRealPath()) . '/' . str_replace('_', '', $component_id . '.js'));

      $this->components[$component_id] = new Component(
        $component_id,
        $template,
        $css->isFile() ? [$css] : [],
        $js->isFile() ? [$js] : [],
      );
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
