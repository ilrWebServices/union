<?php

namespace Union;

interface ComponentsInterface {

  /**
   * Get all components.
   *
   * @return Component[]
   */
  public function getComponents();

  /**
   * Get a component by ID.
   *
   * @param string $component_id
   * @param bool $include_demo_data
   *
   * @return Component
   */
  public function getComponent($component_id, $include_demo_data);

}
