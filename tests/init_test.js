(function() {
  var url;

  url = 'http://localhost:9001/build';

  casper.test.begin('Title page', 5, function(test) {
    return casper.start(url, function() {
      test.comment(this.getCurrentUrl());
      test.assertHttpStatus(200, 'SEAP is up');
      test.assertTitle('ESA Assessment Support', 'ESA page title is the one expected');
      test.assertElementCount('header nav li a', 2, '2 header menu links');
      this.click('button[data-action="resume"]');
      return this.click('a[data-action="menu"]');
    }).then(function() {
      return test.assertElementCount('.flow.loaded button', 2, '2 buttons in view');
    }).then(function() {
      return test.assertSelectorHasText('footer .privacy-link a', 'Privacy & terms of use', 'Found privacy link in footer');
    }).run(function() {
      return test.done();
    });
  });

}).call(this);
