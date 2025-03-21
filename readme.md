# Dice

## Summary

Dice is a web application for rolling virtual dice. The concept for making this
app was mostly an excuse for me to test ideas for JavaScript and Web
architecture. I have carefully considerred the source code structure, dependency
management, client side caching, developer server, and how to manage third party
software with adapters and generic types.

## Quick Start

To start the developer server:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the developer server on http://localhost:8080/:
   ```bash
   npm start
   ```
3. Run tests with live reload
   ```bash
   npm run test
   ```

## Deployment to GitHub Pages

This script is run on every commit to main. It runs build.js and pushes the
build to the `gh-pages` branch.

```bash
.github/workflows/deploy.yml
```

## Folder Structure

```
$ tree -I 'node_modules' 
.
.
├── package.json
├── public
│   ├── cache-worker.js
│   ├── dice.svg
│   ├── dice_180.png
│   ├── index.html
│   └── manifest.json
├── readme.md
└── src
    ├── events
    │   ├── dice-events.js
    │   └── types
    │       ├── dice-event-map.ts
    │       └── event-emitter.ts
    ├── models
    │   ├── dice-config.js
    │   ├── dice-rotation.js
    │   ├── dice-rules.js
    │   ├── randomizer.js
    │   └── types
    │       ├── dice-config.ts
    │       ├── dice-rotation.ts
    │       ├── dice-rules.ts
    │       └── randomizer.ts
    ├── stack
    │   ├── adapters
    │   │   ├── file-store.js
    │   │   ├── file-templater.js
    │   │   ├── node-server.js
    │   │   ├── tests
    │   │   │   └── file-templater.test.js
    │   │   └── types
    │   │       ├── store.ts
    │   │       ├── templater.ts
    │   │       └── web-server.ts
    │   ├── build.js
    │   ├── manifest.json
    │   └── resources
    │       ├── cache-client.js
    │       ├── cache-events.js
    │       ├── cache-worker.js
    │       ├── dev-server.js
    │       ├── file-paths.js
    │       └── hot-reload.js
    └── views
        ├── images
        │   ├── dice.svg
        │   └── dice_180.png
        ├── layout
        │   ├── meta.html
        │   ├── root.css
        │   └── root.html
        └── pages
            ├── dice.css
            └── dice.html
```

### Directory Breakdown

- **public/**: Contains static files and the main HTML file.
- **readme.md**: You are here.
- **src/**: Contains all the source code for the application.
  - **events/**: Event handling logic.
    - **types/**: TypeScript definitions.
  - **models/**: Contains domain-specific logic and related logic with no
    external dependencies.
    - **types/**: TypeScript definitions for models.
  - **stack/**: Contains infrastructure and build related code.
    - **adapters/**: Manages external dependencies.
      - **types/**: TypeScript definitions for adapters. The adapters types
        themselves should have no external dependencies.
    - **resources/**: Contains resource files for the application.
  - **views/**: Contains the UI layout and pages. These depend on the stack to
    fill in variables.
    - **layout/**: Contains layout files.
    - **pages/**: Contains individual page files.

## Division of Responsibility and Dependency Model

The models are the most stable part of the application, and has no dependencies
on other parts of the application or external services.

Events may only have depedencies on models

The view is devoid of logic and and dependencies except for simple template
variables.

The stack assembles the user interface by loading data and view templates. It
contains build script, adapters, and app resources. It centralizes the flow of
data and dependencies in the application.

All external dependencies are managed through adapters in the
`src/stack/adapters/` directory. These adapters use TypeScript to create
generalized interfaces, so that the core application logic remains isolated from
external dependencies.

## TypeScript and JavaScript Division

The application uses TypeScript for specifying types and better development
experience. JavaScript is primarily used, with Typescript info loaded from files
in seperate `/types` directorires to provide type safety and IDE completion for
JavaScript files.
