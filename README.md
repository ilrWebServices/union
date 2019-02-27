# Union - Cornell University ILR School Design System

A simple, Twig-based component builder compatible with Drupal.

## Setup

```
$ npm run setup
```

## Usage

### Creating components

1. Add a directory with your component name in the `source/components` folder.
2. Create a twig file with markup for the component (including the class name prefixed with "cu-").
3. Create a scss file that does not start with an underscore.
4. Add any js needed.

```
source/components/button/
├── README.md
├── button.scss
├── button.css
├── button.js
└── button.twig
```

### Compile and watch for changes

```
$ npm start
```

### Compile only

```
$ npm run build
```
