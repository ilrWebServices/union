<?php

namespace Union;

interface ComponentsInterface {

  /**
   * Get all components.
   *
   * @return array
   *   An array of UnionComponent objects.
   */
  public function getComponents();

  /**
   * Get a component by ID.
   *
   * @param string $component_id
   * @return UnionComponent
   */
  public function getComponent($component_id);

}
