# App - Sanatorio Allende

## Using the application

Install grunt
`npm install -g grunt grunt-cli`

Install webpack
`npm install -g webpack webpack-dev-server`

And then be sure to install everything that the repo requires:
`npm install`

### Development Mode

Run the following command to start the app in local mode.
`npm start`

You can now access the website at
`http://localhost:8888`

### Build

Run the following command to start the app
`grunt run build:environment`

Where environment can be 'dev', 'prod', 'test' or 'local'.

### Deploy

Run the following command to start the app
`grunt run deploy:environment`

Where environment can be 'dev', 'prod', 'test' or 'local'.

### Test

#### Single Run Tests

You can run individual test suites by running the commands:
`grunt test:unit`

Or everything in order:
`grunt test`