# Union - Cornell University ILR School Design System

A simple, Twig-based component builder compatible with Drupal.

## Setup

```
$ npm run setup
```

## Usage

### Creating components

1. Create a directory with your component name in the `source/components/` folder.
2. Create a `.twig` file with markup for the component (including the class name prefixed with "`cu-`").
3. Create a `.scss` file that does not start with an underscore. Don't create a `.css` file, as it will be added automatically.
4. (Optional) Create a `.js` if your component required javascript enhancement.
5. Create a `.libraries.yml` file and reference any css or js for your component, along with any optional dependencies.

Component example:

```
source/components/button/
├── README.md
├── button.scss
├── button.css
├── button.libraries.yml
├── button.js
└── button.twig
```

Library example:

```
# button.libraries.yml

css:
  button.css: {}
js:
  button.js: {}
dependencies:
  - link
```

Note that the css file you may reference in your `.libraries.yml` file is automatically compiled from your `.scss` file. See below.

### Compile and watch for changes

```
$ npm start
```

### Compile only

```
$ npm run build
```
