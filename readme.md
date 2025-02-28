# Dice App

## Summary
The Dice App is a web application that allows users to roll virtual dice. 

## Folder Structure
```
├── public/
│   └── index.html
└── src/
    ├── domain/
    │   ├── events/
    │   │   ├── dice-events.js
    │   │   └── types/
    │   │       └── dice-events.ts
    │   └── models/
    │       ├── dice-config.js
    │       ├── randomizer.js
    │       └── types/
    │           ├── dice-config.ts
    │           └── randomizer.ts
    ├── stack/
    │   ├── adapters/
    │   │   ├── file-store.js
    │   │   ├── file-templater.js
    │   │   ├── node-server.js
    │   │   ├── tests/
    │   │   │   └── file-templater.test.js
    │   │   └── types/
    │   │       ├── store.ts
    │   │       ├── templater.ts
    │   │       └── web-server.ts
    │   ├── build.js
    │   ├── resources/
    │   │   ├── dev-server.js
    │   │   ├── dice-client.js
    │   │   ├── file-paths.js
    │   │   └── hot-reload.js
    └── views/
        ├── layout/
        │   ├── root.css
        │   └── root.html
        └── pages/
            ├── dice.css
            └── dice.html
```

### Directory Breakdown
- **src/**: Contains all the source code for the application.
    - **domain/**: Contains domain-specific logic and models, with no external dependencies.
        - **events/**: Handles event-related logic.
            - **types/**: TypeScript definitions for events.
        - **models/**: Contains data models and related logic.
            - **types/**: TypeScript definitions for models.
    - **stack/**: Contains infrastructure and build-related code.
        - **adapters/**: Manages external dependencies.
            - **types/**: TypeScript definitions for adapters. The adapters types themselves should have no external dependencies.
        - **resources/**: Contains resource files for the application.
    - **views/**: Contains the UI layout and pages. These depend on the stack to fill in variables.
        - **layout/**: Contains layout-related files.
        - **pages/**: Contains individual page files.
- **public/**: Contains static files and the main HTML file.
- **scripts/**: Contains scripts for various tasks.
- **package.json**: Contains project metadata and dependencies.
- **README.md**: You are here.

## Division of Responsibility and Dependency Model
All external dependencies are managed through adapters in the `src/stack/adapters/` directory. These adapters use TypeScript to create generalized interfaces, ensuring that the core application logic remains isolated from external dependencies.

The domain is the most stable part of the application, and has no dependencies on other parts of the application or external services.

The stack contains the build script, adapters, and app resources. It centralizes the flow of dependencies and choice of tools in the application.

The view is dependent on the stack to fill in its variables, and has no dependencies other than that.

## Quick Start
To start the developer server:
1. Install dependencies:
     ```bash
     npm install
     ```
2. Start the developer server:
     ```bash
     npm run
     ```

## Deployment to GitHub Pages
This script is run on every commit to main. It runs build.js and pushes the build to the `gh-pages` branch.
```bash
.github/workflows/deploy.yml
```

## TypeScript and JavaScript Division
The application uses TypeScript for specifying types and better development experience. JavaScript is primarily used, with Typescript info loaded from files in seperate `/types` directorires to provide type safety and IDE completion for JavaScript files.

## Roadmap
- Add offline support using web worker
- Add additional dice

