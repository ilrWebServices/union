# Union - Cornell University ILR School Design System

A simple, Twig-based component builder and styleguide compatible with Drupal.

## Setup

```
$ composer install
```

## Basics

Most components are standalone, self-documenting `.twig` files, with independent `.css` and `.js` files organized into libraries.

Although components are meant to be standalone, they share certain 'schemes' that they can optionally honor.

1. `cu-colorscheme--` - Currently implemented. Any component can choose to deal with things like padding when a colorscheme is set.
2. `cu-layoutscheme--` - Proposed. The first option would be `--reversed`. Any component that has top-down or right-left layouts could choose to honor this and flip if/when set. It would replace some component-specific variants, since it's so common.
3. `cu-spacingscheme--` - Proposed. This scheme would mostly affect the outer margins of components. Currently component margins are inconsistent, and a design-system-global setting like this could help. Values could be things like `none`, `compact`, `airy`.

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
