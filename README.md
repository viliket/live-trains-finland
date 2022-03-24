[![Netlify Status](https://api.netlify.com/api/v1/badges/62a70830-6ab5-4a0e-9299-ed99b72b67a0/deploy-status)](https://app.netlify.com/sites/junaan/deploys)

# Junaan.fi

A web application made with React that allows checking real-time train schedules, locations, and compositions of trains in Finland. The app uses open APIs provided by Fintraffic / Digitraffic and HSL / Digitransit.

Live version running at [junaan.fi](https://junaan.fi).

## Development

See the instructions below for development.

### Requirements

- Node.js >= 16
- npm >= 8

### Run the app

```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Regenerate GraphQL operations

```
npm run gql-codegen
```

Run the above command whenever you modify the GraphQL queries in the `src/graphql/queries` folder or when the remote GraphQL schema is modified.

Note that the above command is also run as part of the `prestart` script when running `npm start`.

### Run the tests

```
npm test
```

Launches the test runner in the interactive watch mode.

### Create production build

```
npm run build
```

Builds the app for production to the `build` folder.

## License

Copyright (C) 2022 [Vili Ketonen](https://github.com/viliket)

[GNU General Public License version 3 (GPLv3)](gpl-3.0.txt)
