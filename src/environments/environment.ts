// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// TODO: the variable placeholders should have _
export const environment = {
  production: false,
  fyle_url: 'https://accounts.fyle.tech',
  fyle_client_id: 'tpaPu6HJt8hfL',
  callback_uri: 'http://localhost:4200/auth/callback',
  api_url: 'http://localhost:8000/api',
  app_url: 'http://localhost:4200',
  qbo_client_id: 'ABTemcw1ngLRye1iqW25EI2CyNUzdBSkNYWYxaFtkaJNgRcbM5',
  qbo_scope: 'com.intuit.quickbooks.accounting',
  qbo_authorize_uri: 'https://appcenter.intuit.com/connect/oauth2',
  qbo_app_url: 'https://app.sandbox.qbo.intuit.com',
  hotjar_id : '',
  sentry_dsn: '',
  release: 'dev'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
