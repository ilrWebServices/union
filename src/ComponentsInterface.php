<?php

namespace Union;

interface ComponentsInterface {

  /**
   * Get all components.
   *
   * @return Component[]
   */
  public function getComponents($include_demo_data = false);

  /**
   * Get a component by ID.
   *
   * @param string $component_id
   * @param bool $include_demo_data
   *
   * @return Component|null
   */
  public function getComponent($component_id, $include_demo_data): ?Component;

  /**
   * Get the directory path to Union images.
   *
   * @return string
   */
  public function getImagePath(): string;

}
