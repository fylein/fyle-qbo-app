// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  fyle_url: 'https://accounts.staging.fyle.in',
  fyle_client_id: 'tpaYfU7VLyrEN',
  callback_uri: 'http://localhost:4201/auth/callback',
  api_url: 'https://api-quickbooks.fyleappz.com/api',
  app_url: 'https://localhost:4201',
  qbo_client_id: 'ABTemcw1ngLRye1iqW25EI2CyNUzdBSkNYWYxaFtkaJNgRcbM5',
  qbo_scope: 'com.intuit.quickbooks.accounting',
  qbo_authorize_uri: 'https://appcenter.intuit.com/connect/oauth2',
  qbo_app_url: 'https://app.sandbox.qbo.intuit.com'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
