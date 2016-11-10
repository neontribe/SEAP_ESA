(function() {
  var url;

  url = 'http://localhost:9001/build';

  casper.test.begin("Your Assessment Page", 1, function(test) {
    return casper.start(url, function() {
      return this.click('a[data-action="your-assessment"]');
    }).then(function() {
      return test.assertUrlMatch(url + '/#your-assessment', 'press link navigates to your-assessment page');
    }).run(function() {
      return test.done();
    });
  });

}).call(this);
