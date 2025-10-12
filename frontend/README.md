# SQLite Remote - Frontend

## Prerequisites

- Node.js 20
- Docker (for OpenAPI generator)

## Getting started

```shell
nvm use
npm ci
npm run dev
```

The app will be available at [http://localhost:4000](http://localhost:4000).

## Scripts

### `npm run dev`

Starts the development server.

### `npm run build`

Builds the app for production.

### `npm run generate:api`

(i) Requires the API and Docker to be running.
Generates the API client from the OpenAPI specification.

### `npm run lint`

Runs eslint checks.

### `npm run style`

Runs prettier checks.

### `npm run ts`

Runs Typescript checks.

### `npm run lint:fix`

Applies eslint fixes.

### `npm run style:fix`

Applies prettier fixes.

## Used tools

- React 18
- [Vite](https://vite.dev/guide/)
- [Radix Themes](https://www.radix-ui.com/themes/docs/overview/getting-started)
- [CSS modules](https://github.com/css-modules/css-modules)
- [React Query](https://tanstack.com/query/latest)
- [OpenAPI React Query Generator](https://github.com/7nohe/openapi-react-query-codegen)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- ESLint
- Prettier
