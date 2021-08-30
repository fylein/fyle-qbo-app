import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';

const hostname= window.location.hostname.substring(0, window.location.hostname.indexOf('.'))

if (environment.sentry_dsn) {
  Sentry.init({
    dsn: environment.sentry_dsn,
    release: 'v1',
    environment : hostname,
    ignoreErrors: [
      'Non-Error exception captured'
    ],
    tracesSampleRate: 1.0,
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
