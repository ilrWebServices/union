<?php

namespace Union;

use phpDocumentor\Reflection\DocBlockFactory;
use Symfony\Component\Yaml\Yaml;

class Component {

  protected $componentId;

  public $template;

  /**
   * Component CSS
   *
   * @var array An array of \SplFileInfo objects representing CSS files.
   */
  protected $css = [];

  /**
   * Component JavaScript
   *
   * @var array An array of \SplFileInfo objects representing JS files.
   */
  protected $js = [];

  protected $docblock;

  protected $demoData;

  /**
   * Construct a new component.
   *
   * @param string $component_id
   *   The component machine name.
   * @param \SplFileInfo $template
   *   The twig template file.
   */
  public function __construct(string $component_id, \SplFileInfo $template) {
    $this->componentId = $component_id;
    $this->template = $template;
  }

  public function addCss(\SplFileInfo $css) {
    $this->css[] = $css;
  }

  public function addJs(\SplFileInfo $js) {
    $this->js[] = $js;
  }

  public function getCss() {
    return $this->css;
  }

  public function getJs() {
    return $this->js;
  }

  public function addDemoData(\SplFileInfo $demo_data) {
    $this->demoData = Yaml::parseFile($demo_data->getPathname());
  }

  public function getDemoData() {
    return $this->demoData ?? [];
  }

  /**
   * Get the component machine name.
   *
   * @return string The machine name identifier.
   */
  public function id() {
    return $this->componentId;
  }

  /**
   * Get the component label.
   *
   * @return string|null The human readable label.
   */
  public function getLabel() {
    return $this->getDockblock() ? $this->getDockblock()->getSummary() : null;
  }

  /**
   * Get the component description.
   *
   * @return string|null The long description for this component. Can be
   *   markdown for use in other tools.
   */
  public function getDescription() {
    return $this->getDockblock() ? $this->getDockblock()->getDescription() : null;
  }

  /**
   * Get a list of variables used in the template for this component.
   *
   * @return array An array of phpDocumentor\Reflection\DocBlock\Tags\Var_ objects.
   */
  public function getTemplateVars() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('var') : [];
  }

  /**
   * Get a list of references (links) for this component.
   *
   * @return array An array of phpDocumentor\Reflection\DocBlock\Tags\Var_ objects.
   */
  public function getReferences() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('see') : [];
  }

  /**
   * Get the docblock for this template, if it exists.
   *
   * @return phpDocumentor\Reflection\DocBlock|FALSE
   */
  protected function getDockblock() {
    if (!is_null($this->docblock)) {
      return $this->docblock;
    }

    $twig_code = file_get_contents($this->template->getRealPath());
    $factory = DocBlockFactory::createInstance();

    if (preg_match_all("/{#([^}]*)#}/", $twig_code, $matches)) {
      if ($doc_comment = $matches[1][0] ?? FALSE) {
        return $factory->create($doc_comment);
      }
    }

    return FALSE;
  }

  /**
   * Render this component.
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
