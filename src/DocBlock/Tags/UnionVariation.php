<?php

namespace Union\DocBlock\Tags;

use phpDocumentor\Reflection\DocBlock\Description;
use phpDocumentor\Reflection\DocBlock\DescriptionFactory;
use phpDocumentor\Reflection\DocBlock\Tags\BaseTag;
use phpDocumentor\Reflection\Types\Context;
use phpDocumentor\Reflection\Utils;
use Webmozart\Assert\Assert;

/**
 * A custom tag called `union-variant` with class name and optional description.
 *
 * @see https://github.com/phpDocumentor/ReflectionDocBlock/blob/master/examples/04-adding-your-own-tag.php
 */
final class UnionVariation extends BaseTag {

    /** @var string Name of the tag */
    protected string $name = 'union-variation';

    /** @var string CSS class name of the variant */
    protected $className;

    /**
     * The constructor for the `union-variation`.
     *
     * @param string $class_name
     *   The CSS class name of the variation.
     * @param Description $description
     *   An example of how to add a Description to
     *   the tag; the Description is often an optional variable so passing null is
     *   allowed in this instance (though you can also construct an empty
     *   description object).
     */
    public function __construct(string $class_name, Description $description = null) {
      $this->className = $class_name;
      $this->description = $description;
    }

    /**
     * Create a new instance of the tag.
     *
     * @param string $body
     * @param DescriptionFactory $descriptionFactory
     * @param Context|null $context
     *   The Context is used to resolve Types and FQSENs, although optional
     *   it is highly recommended to pass it. If you omit it then it is assumed that
     *   the DocBlock is in the global namespace and has no `use` statements.
     */
    public static function create(string $body, DescriptionFactory $descriptionFactory = null, Context $context = null): self {
      Assert::notNull($descriptionFactory);
      $parts = Utils::pregSplit('/(\s+)/Su', $body, 2);
      $class_name = $parts[0] ?? '';
      $description = $parts[1] ?? '';
      Assert::stringNotEmpty($class_name);
      return new static($class_name, $descriptionFactory->create($description, $context));
    }

    /**
     * Returns the CSS class name.
     */
    public function getClassName(): ?string {
      return $this->className;
    }

    /**
     * Returns a rendition of the original tag line.
     *
     * This method is used to reconstitute a DocBlock into its original form by
     * the {@see Serializer}. It should feature all parts of the tag so that the
     * serializer can put it back together.
     */
    public function __toString(): string {
      return (string) $this->className . ' ' . $this->description;
    }
}
