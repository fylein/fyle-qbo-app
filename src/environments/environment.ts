// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// TODO: the variable placeholders should have _
export const environment = {
  production: false,
  fyle_url: 'FYLE URL',
  fyle_app_url: '{{FYLE_APP_URL}}',
  fyle_client_id: 'FYLE CLIENT ID',
  callback_uri: 'CALLBACK URL',
  api_url: 'QBO API URL',
  app_url: 'ANGULAR APP URL',
  qbo_client_id: 'QBO CLIENT_ID',
  qbo_scope: 'QBO SCOPE',
  qbo_authorize_uri: 'QBO CONNETION URI',
  qbo_app_url: 'QBO APP URL',
  hotjar_id : 'HOTJAR_ID',
  sentry_dsn: 'SENTRY_DSN',
  release: '{{RELEASE}}',
  new_qbo_app_url: 'OLD QBO APP URL'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
