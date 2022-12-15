<?php

namespace Union;

interface ComponentInterface {

  const CSS_CATEGORIES = ['base', 'layout', 'component', 'state', 'theme'];

  public function __construct(string $component_id, \SplFileInfo $template);

  /**
   * Add a CSS file to this component.
   */
  public function addCss(\SplFileInfo $css): void;

  /**
   * Add a JS file to this component.
   */
  public function addJs(\SplFileInfo $js): void;

  /**
   * Add a font file to this component.
   */
  public function addFont(\SplFileInfo $font): void;

  /**
   * Get CSS files for this component.
   *
   * @return \SplFileInfo[]
   */
  public function getCss();

  /**
   * Get JS files for this component.
   *
   * @return \SplFileInfo[]
   */
  public function getJs();

  /**
   * Get font files for this component.
   *
   * @return \SplFileInfo[]
   */
  public function getFonts();

  /**
   * Add a YAML file with demo data to this component.
   *
   * The YAML data should be an array of template vars. The special `demo_label`
   * key is used to label the demo item.
   */
  public function addDemoData(\SplFileInfo $demo_data): void;

  /**
   * Get the array of demo data for this component.
   *
   * The array items are keyed by the template variables.
   */
  public function getDemoData(): array;

  /**
   * Get the component machine name.
   *
   * @return string The machine name identifier.
   */
  public function id(): string;

  /**
   * Get the component label.
   *
   * @return string|null The human readable label.
   */
  public function getLabel(): ?string;

  /**
   * Get the component description.
   *
   * @return string|null The long description for this component. Can be
   *   markdown for use in other tools.
   */
  public function getDescription(): ?string;

  /**
   * Get a short description of the component.
   *
   * @return string|null The first line of the description for this component.
   *   Can be markdown.
   */
  public function getShortDescription(): ?string;

  /**
   * Get a list of variables used in the template for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\Var_[].
   */
  public function getTemplateVars();

  /**
   * Get a list of references (links) for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\See[].
   */
  public function getReferences();

  /**
   * Get a list of todos for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\Generic[].
   */
  public function getTodos();

  /**
   * Get a list of variations for this component.
   *
   * @return \Union\DocBlock\Tags\UnionVariation[].
   */
  public function getVariations();

  /**
   * Get the CSS category for this component.
   *
   * @return string
   *   The first `union-css-category` tag, e.g. `base`, `layout`, etc. or `component` if not set.
   *
   * @see http://smacss.com/book/categorizing
   * @see https://www.drupal.org/docs/develop/standards/css/css-architecture-for-drupal-9#separate-concerns
   */
  public function getCssCategory(): string;

  /**
   * Get a list of deprecations for this component.
   *
   * @return \phpDocumentor\Reflection\DocBlock\Tags\Deprecated[].
   */
  public function getDeprecations();

}
