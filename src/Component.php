<?php

namespace Union;

use phpDocumentor\Reflection\DocBlockFactory;
use Symfony\Component\Yaml\Yaml;
use Union\DocBlock\Tags\UnionVariation;

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

  /**
   * Component Fonts
   *
   * @var array An array of \SplFileInfo objects representing font files.
   */
  protected $fonts = [];

  protected $docblock;

  protected $demoData;

  const CSS_CATEGORIES = ['base', 'layout', 'component', 'state', 'theme'];

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

  public function addFont(\SplFileInfo $font) {
    $this->fonts[] = $font;
  }

  public function getCss() {
    return $this->css;
  }

  public function getJs() {
    return $this->js;
  }

  public function getFonts() {
    return $this->fonts;
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
   * Get a short description of the component.
   *
   * @return string|null The first line of the description for this component.
   *   Can be markdown.
   */
  public function getShortDescription() {
    if ($this->getDockblock()) {
      $line = preg_split('#\r?\n#', ltrim($this->getDockblock()->getDescription()), 2)[0];
      return $line;
    }

    return null;
  }

  /**
   * Get a list of variables used in the template for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\Var_[].
   */
  public function getTemplateVars() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('var') : [];
  }

  /**
   * Get a list of references (links) for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\See[].
   */
  public function getReferences() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('see') : [];
  }

  /**
   * Get a list of todos for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\Generic[].
   */
  public function getTodos() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('todo') : [];
  }

  /**
   * Get a list of variations for this component.
   *
   * @return \Union\DocBlock\Tags\UnionVariation[].
   */
  public function getVariations() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('union-variation') : [];
  }

  /**
   * Get the CSS category for this component.
   *
   * @return string
   *   The first `union-css-category` tag, e.g. `base`, `layout`, etc. or `component` if not set.
   *
   * @see http://smacss.com/book/categorizing
   * @see https://www.drupal.org/docs/develop/standards/css/css-architecture-for-drupal-9#separate-concerns
   */
  public function getCssCategory() {
    $categories = $this->getDockblock() ? $this->getDockblock()->getTagsByName('union-css-category') : [];

    if ($categories) {
      $first_category = (string) $categories[0]->getDescription();

      if (in_array($first_category, self::CSS_CATEGORIES)) {
        return $first_category;
      }
    }

    // If no category tag is present, default to 'component'.
    return 'component';
  }

  /**
   * Get a list of deprecations for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\Deprecated[].
   */
  public function getDeprecations() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('deprecated') : [];
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
    $factory = DocBlockFactory::createInstance(['union-variation' => UnionVariation::class]);

    if (preg_match_all("/{#([^}]*)#}/", $twig_code, $matches)) {
      if ($doc_comment = $matches[1][0] ?? FALSE) {
        return $this->docblock = $factory->create($doc_comment);
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
