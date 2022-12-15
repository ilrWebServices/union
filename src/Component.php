<?php

namespace Union;

use phpDocumentor\Reflection\DocBlock;
use phpDocumentor\Reflection\DocBlockFactory;
use Symfony\Component\Yaml\Yaml;
use Union\DocBlock\Tags\UnionVariation;

class Component implements ComponentInterface {

  protected string $componentId;

  public \SplFileInfo $template;

  /**
   * @var \SplFileInfo[].
   */
  protected array $css = [];

  /**
   * @var \SplFileInfo[].
   */
  protected array $js = [];

  /**
   * @var \SplFileInfo[].
   */
  protected array $fonts = [];

  protected ?DocBlock $docblock = null;

  protected array $demoData = [];

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

  public function addCss(\SplFileInfo $css): void {
    $this->css[] = $css;
  }

  public function addJs(\SplFileInfo $js): void {
    $this->js[] = $js;
  }

  public function addFont(\SplFileInfo $font): void {
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

  public function addDemoData(\SplFileInfo $demo_data): void {
    $this->demoData = Yaml::parseFile($demo_data->getPathname());
  }

  public function getDemoData(): array {
    return $this->demoData ?? [];
  }

  public function id(): string {
    return $this->componentId;
  }

  public function getLabel(): ?string {
    return $this->getDockblock() ? $this->getDockblock()->getSummary() : null;
  }

  public function getDescription(): ?string {
    return $this->getDockblock() ? $this->getDockblock()->getDescription() : null;
  }

  public function getShortDescription(): ?string {
    if ($this->getDockblock()) {
      $line = preg_split('#\r?\n#', ltrim($this->getDockblock()->getDescription()), 2)[0];
      return $line;
    }

    return null;
  }

  public function getTemplateVars() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('var') : [];
  }

  public function getReferences() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('see') : [];
  }

  public function getTodos() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('todo') : [];
  }

  public function getVariations() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('union-variation') : [];
  }

  public function getCssCategory(): string {
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

  public function getDeprecations() {
    return $this->getDockblock() ? $this->getDockblock()->getTagsByName('deprecated') : [];
  }

  /**
   * Get the docblock for this template, if it exists.
   */
  protected function getDockblock(): ?DocBlock {
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

    return null;
  }

}
