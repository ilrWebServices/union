# Union - Cornell University ILR School Design System

A simple, Twig-based component builder and styleguide compatible with Drupal.

## Setup

```
$ composer install
```

## Usage

### Creating components

Component example:

```
components/button/
├── buttons.data.yml
├── button.twig
├── button.css
└── button.libraries.yml
```

Library example:

```
# button.libraries.yml

css:
  button.css: {}
js:
  button.js: {}
dependencies:
  - base
```

### Connect to Drupal

[Union Organizer](https://github.com/ilrWebServices/union_organizer/) is a custom Drupal module that configures Twig namespacing and adds components and skins as Drupal libraries. See the [Union Organizer readme](https://github.com/ilrWebServices/union_organizer/blob/master/README.md) for installation and documentation.

### Helper functions

#### union_attributes().

Abstracts Drupal Attribute functionality so that attributes can be dynamically created or added to from within a template. See the `form` component.

## Roadmap

- Refactor colors. Define names in global but actual colors in skins.
- In all cases, skin CSS should be loaded after component CSS.
- Cleaner separation of component and skin typography.
