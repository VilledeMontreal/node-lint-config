# Lint Config - Ville de Montréal

> A [TSLint config](https://palantir.github.io/tslint/usage/tslint-json/) based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) that is compatible with [Prettier](https://prettier.io).

## Goal

This package provides standard configurations for TSLint and Prettier that must be used by all TypeScript projects created for the city of Montreal.

The configured rules strive to be as close as possible to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript), as well as a couple of additional rules based on [TypeScript recommended rules](https://palantir.github.io/tslint/usage/configuration/). In order to minimize any disagreements in the choice of the configured rules, which can become subjective, teams should refer the these guides before pushing for a change. Individual projects should refrain from overriding rules, all changes should be applied directly to this project.

## Installation

Add the current project to your project's dev dependency.

```sh
npm install -D @villemontreal/lint-config-villemontreal
```

If you use VS Code, you should install the following extensions in order to see the rules and simplify the formatting of your files:

- [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Integration for other editors is also available. For more details, please refer to the TSLint and Prettier documentation.

## Usage for Angular

In `$project-root/tslint.json`:

```json
{
  "extends": "@villemontreal/lint-config-villemontreal/rules/tslint-angular"
}
```

In `$project-root/prettier.config.js`:

```js
module.exports = require('@villemontreal/lint-config-villemontreal/rules/prettier.config');
```

In `$project-root/tsconfig.json` (Note that you can add extra options, when required):

```json
{
  "extends": "./node_modules/@villemontreal/lint-config-villemontreal/rules/tsconfig-base.json",
  "compilerOptions": {
    "sourceMap": true,
    "pretty": true,
    "experimentalDecorators": true,
    "skipLibCheck": true
  }
}
```

## Usage for Node.js

#### Node.js

In `$project-root/tslint.json`:

```json
{
  "extends": "@villemontreal/lint-config-villemontreal/rules/tslint-node"
}
```

In `$project-root/prettier.config.js`:

```js
module.exports = require('@villemontreal/lint-config-villemontreal/rules/prettier.config');
```

In `$project-root/tsconfig.json` (Note that you can add extra options, if required!):

```json
{
  "extends": "./node_modules/@villemontreal/lint-config-villemontreal/rules/tsconfig-base.json",
  "compilerOptions": {
    "sourceMap": true,
    "pretty": true,
    "experimentalDecorators": true,
    "skipLibCheck": true
  }
}
```

## The Check/Fix script

When the `@villemontreal/lint-config-villemontreal` dependency is installed in your project, you gain
access to a script that can validate and fix linting. This script will be available
at `$project-root/node_modules/.bin/villemontreal-lint`.

Note that TSLint fixing won't work for some rules that can only be fixed manually
(the "`cyclomatic-complexity`" rule, for example).

### Script help

To display the help for the script, run at the root of your project:

```sh
linux/mac: node_modules/.bin/villemontreal-lint --help
windows: node_modules\.bin\villemontreal-lint --help
```

### Script parameters

The lint script accept those parameters, when executing using command line :

```sh
node_modules/.bin/villemontreal-lint [projectRoot] [action] [projectType] [validationType]
```

None of those parameters is mandatory, they all have a default value.

- **projectRoot** : The relative or absolute path to the root of the project to lint. Defaults to the `current directory`.
- **action** : The action to perform. Can be "`check`" or "`fix`". Defaults to "`check`".
- **projectType** : The type of the target project. Can be "`angular`", "`node`" or "`auto`". If "`auto`" is used the script will
  try to detect the project type automatically. If not specified, "`auto`" is used.
- **validationType** : The type of validation. Can be "`prettier`", "`tslint`" or "`both`". If not specified, "`both`" is used.

### Command line examples

To check the current project, from its root :

```sh
linux/mac: node_modules/.bin/villemontreal-lint
windows: node_modules\.bin\villemontreal-lint
```

To fix the current project, from its root :

```sh
linux/mac: node_modules/.bin/villemontreal-lint . fix
windows: node_modules\.bin\villemontreal-lint . fix
```

Fix the formatting only using the Prettier rules, on a Node project :

```sh
linux/mac: node_modules/.bin/villemontreal-lint /someDir/myNodeProject fix node prettier
windows: node_modules\.bin\villemontreal-lint C:\someDir\myNodeProject fix node prettier
```

## The Check/Fix functions

The "`@villemontreal/lint-config-villemontreal`" dependency also exports functions that can be used to check and fix a project
programatically :

- `prettierCheck(...)`
- `prettierFix(...)`
- `tslintCheck(...)`
- `tslintFix(...)`

### Rules Exceptions

A few exceptions to the default configurations were introduced in order to make it easier to work with lint-config-villemontreal.

- **"array-type": [true, "array"]**
  As a workaround for https://github.com/palantir/tslint/issues/2946

- **"no-increment-decrement": false**
  Allows ++ in for loops. An [issue](https://github.com/Microsoft/tslint-microsoft-contrib/issues/362) already exist on GitHub.

- **"no-switch-case-fall-through": true**
  Fall through in switch statements is often unintentional and a bug.

- **"no-var-requires": false**
  Allows for libraries without type definitions.

- **"object-literal-sort-keys": false**
  Alphabetical ordering is not always appropriate in object literal.

- **"object-shorthand-properties-first": false**
  Similarly to the previous rule, disabling this one allows ordering the keys
  of an object literal in a logical order, when required.

- **"strict-boolean-expressions": false**
  Allows statement such as if(!myObjectThatCanBeNullOrUndefined) { /_ do something _/ }

- **"variable-name": [true, "ban-keywords", "check-format", "allow-leading-underscore"]**
  Adds ban-keywords to the Airbnb convention.
  Allows for leading underscore in naming class variables for private variables. Otherwise, it would be impossible to have a public property wrapping a private variable of the same name.

- **"no-floating-promises": true**
  Helps in preventing missing "`await`" keywords.

- **"member-ordering": [true, {"order": ["static-field", "static-method", "instance-field", "constructor", "instance-method"]}]**
  After [a discussion](https://bitbucket.org/villemontreal/lint-config-villemontreal/issues/2/proposition-une-version-modifi-e-de-la-r) about this rule,
  we decided to make it more permissive than the default (from "tslint recommended"). The main reason being that it sometimes makes sense
  to group functions of different visibilities together.

### Exclude generated files

You can add a folder named **generated** at the root of your project. Any files in this folder will be ignored by Prettier, TSlint and the TS transpiler.

The intent of this folder is to put files that has been generated by a third-party tool such as Swagger codegen and that you should not modify manually.

# Builder le projet

**Note**: Sur Linux/Mac assurz-vous que le fichier `run` est exécutable. Autrement, lancez `chmod +x ./run`.

Pour lancer le build :

- > `run compile` ou `./run compile` (sur Linux/Mac)

Pour lancer les tests :

- > `run test` ou `./run test` (sur Linux/Mac)

# Mode Watch

Lors du développement, il est possible de lancer `run watch` (ou `./run watch` sur Linux/mac) dans un terminal
externe pour démarrer la compilation incrémentale. Il est alors possible de lancer certaines _launch configuration_
comme `Debug current tests file - fast` dans VsCode et ainsi déboguer le fichier de tests présentement ouvert sans
avoir à (re)compiler au préalable (la compilation incrémentale s'en sera chargé).

Notez que, par défaut, des _notifications desktop_ sont activées pour indiquer visuellement si la compilation
incrémentale est un succès ou si une erreur a été trouvée. Vous pouvez désactiver ces notifications en utilisant
`run watch --dn` (`d`isable `n`otifications).

# Déboguer le projet

Trois "_launch configurations_" sont founies pour déboguer le projet dans VSCode :

- "`Debug all tests`", la launch configuration par défaut. Lance les tests en mode debug. Vous pouvez mettre
  des breakpoints et ils seront respectés.

- "`Debug a test file`". Lance _un_ fichier de tests en mode debug. Vous pouvez mettre
  des breakpoints et ils seront respectés. Pour changer le fichier de tests à être exécuté, vous devez modifier la ligne appropriée dans le fichier "`.vscode/launch.json`".

- "`Debug current tests file`". Lance le fichier de tests _présentement ouvert_ dans VSCode en mode debug. Effectue la compîlation au préalable.

- "`Debug current tests file - fast`". Lance le fichier de tests _présentement ouvert_ dans VSCode en mode debug. Aucune compilation
  n'est effectuée au préalable. Cette launch configuration doit être utilisée lorsque la compilation incrémentale roule (voir la section "`Mode Watch`" plus haut)

- "`Debug a Script`", permet de déboguer un script custom à la librairie. Vous pouvez mettre
  des breakpoints et ils seront respectés. Il faut modifier les informations dans `.vscode/launch` pour spécifier le
  script à déboguer.

# Notes sur la dépendance "@villemontreal/core-utils-scripting-core-nodejs-lib"

Pour éviter d'avoir une hiérarchie trop profonde dans `node_modules`, nous incluons la librarie de scripting
"`@villemontreal/core-utils-scripting-core-nodejs-lib`" en spécifiant uniquement _sa version majeure_
(par exemple: "`^1`" ou "`^2`"). La raison est que cette librairie de scripting, ainsi que la librairie présente,
s'utilisent chacune mutuellement. En spécifiant uniquement la version majeure de la librairie
de scripting, seul _le plus récent artifact_ à cette version majeure sera ajouté ici au `node_modules`.

**Note**: Il faut aussi s'assurer dans la librairie de ne pas provoquer de dépendances circulaires
en important des composants de la librairie de scripting qui eux-mêmes importeraient en ce faisant des composants
de la librairie présente! C'est pour cette raison que tous les scripts core reliés au lintage et définis dans la
librairie de scripting sont remplacés ici! D'hériter de la classe `ScriptBase` est sans problème car cet import
ne génère aucune dépendance circulaire.

# Test et publication de la librairie sur Nexus

En mergant une pull request dans la branche `develop`, un artifact "`-pre.build`" sera créé automatiquement dans Nexus. Vous
pouvez utiliser cette version temporaire de la librairie pour bien la tester dans un réel projet.

Une fois mergée dans `master`, la librairie est définitiement publiée dans Nexus, en utilisant la version spécifiée dans
le `package.json`.

# Aide / Contributions

Pour obtenir de l'aide avec cette librairie, vous pouvez poster sur la salle Google Chat [dev-discussions](https://chat.google.com/room/AAAASmiQveI).

Notez que les contributions sous forme de pull requests sont bienvenues.
