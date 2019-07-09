const { join, relative } = require('path');
const Generator = require('yeoman-generator');

let componentPath = join(__dirname, '../../source/patterns/components/');

const prompts = [
  {
    name: 'name',
    message: 'Component name:',
    filter(answer) {
      return answer.replace(/ /g, '-').toLowerCase();
    }
  },
  {
    type: 'checkbox',
    name: 'optional_features',
    message: 'Optional features:',
    choices: ['js'],
    default: []
  }
];

module.exports = class extends Generator {
  prompting() {
    this.log(`Create a new component at ${relative(process.cwd(), componentPath)}/ from the tempates in ${relative(process.cwd(), __dirname)}/.`);

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = {
        ...props,
        dashlessName: props.name.replace(/-/g, ''),
        underscoreName: props.name.replace(/-/g, '_'),
      };
    });
  }

  writing() {
    const { optional_features, name } = this.props;
    componentPath = join(componentPath, name);

    // generatorAssets has a key for each file that Union creates. Each of those
    // is an array of objects, each of which must contain the properties
    // templatePath and destinationPath. These arrays are looped over in the
    // function below.
    const generatorAssets = {
      scss: [
        {
          templatePath: 'pattern.scss',
          destinationPath: join(componentPath, `${name}.scss`)
        }
      ],
      twig: [
        {
          templatePath: '_pattern.twig',
          destinationPath: join(componentPath, `_${name}.twig`)
        }
      ],
      js: [
        {
          templatePath: 'pattern.js',
          destinationPath: join(componentPath, `${name}.js`)
        }
      ],
      library: [
        {
          templatePath: 'pattern.libraries.yml',
          destinationPath: join(componentPath, `${name}.libraries.yml`)
        }
      ],
      demo: [
        {
          templatePath: 'pattern.twig',
          destinationPath: join(componentPath, 'demo', `${name}s.twig`)
        },
        {
          templatePath: 'pattern.yml',
          destinationPath: join(componentPath, 'demo', `${name}s.yml`)
        },
        {
          templatePath: 'pattern.md',
          destinationPath: join(componentPath, 'demo', `${name}s.md`)
        }
      ],
    };

    // Loop over all the selected files and populate the template according to
    // the pattern structure in generatorAssets.
    let features = ['twig', 'scss', 'library', 'demo'];

    // Add selected optional features (e.g. 'js').
    optional_features.forEach(optional_feature => {
      features.push(optional_feature);
    });

    features.forEach(fileType => {
      generatorAssets[fileType].forEach(file => {
        this.fs.copyTpl(
          this.templatePath(file.templatePath),
          this.destinationPath(file.destinationPath),
          this.props
        );
      });
    });

    this.log(
      `The ${name} component is being created!`
    );
  }
};
