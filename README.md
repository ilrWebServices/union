# Union - Cornell University ILR School Design System

A simple, Twig-based component builder and Pattern Lab styleguide compatible with Drupal.

## Setup

```
$ npm run setup
```

## Usage

### Creating components

```
$ npm run union:new
```

Component example:

```
source/patterns/components/button/
├── _button.twig
├── demo
│   ├── buttons.md
│   ├── buttons.twig
│   └── buttons.yml
├── button.css     (automatically compiled)
├── button.css.map (automatically compiled)
├── button.libraries.yml
└── button.scss
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

Note that the css file referenced in your `.libraries.yml` file is automatically compiled from your `.scss` file. See below.

### Compile and watch for changes and start Pattern Lab

```
$ npm start
```

### Compile only

```
$ npm run build
```

### Connect to Drupal

[Union Organizer](https://github.com/ilrWebServices/union_organizer/) is a custom Drupal 8 module configures Twig namespacing and adds components and skins as Drupal libraries. See the [Union Organizer readme](https://github.com/ilrWebServices/union_organizer/blob/master/README.md) for installation and documentation.

### Helper functions

#### union_attributes().

Abstracts Drupal Attribute functionality so that attributes can be dynamically created or added to from within a template. See the `form` component.

## Publishing a new Release

This package is published to NPM. To create a new release:

```
$ npm login                            # As a user with access to the @cornell_ilr NPM org
$ npm version [patch | minor | major]
$ git push origin --follow-tags
$ npm publish
```

## Roadmap

- Don't always include all skins in Pattern Lab and allow selection of skin.
- Refactor colors. Define names in global but actual colors in skins.
- Actually use libraries to build css rather than single union.css and union.js files.
- In all cases, skin CSS should be loaded after component CSS.
- Cleaner separation of component and skin typography.
