Package.describe({
  name: 'sakulstra:versioned',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');
  api.use('aldeed:simple-schema@1.5.3');
  api.use('dburles:collection-helpers@1.1.0');
  api.use('matb33:collection-hooks@0.8.4');
  api.mainModule('versioned.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('sakulstra:versioned');
  api.mainModule('versioned-tests.js');
});
