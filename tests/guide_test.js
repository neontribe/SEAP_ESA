var url = 'http://localhost:9001/build';

casper.test.begin('ESA Guide', 1, function suite(test) {
  // Start at home, click about esa button
  casper.start(url, function() {
    this.click('button[data-action="about-esa"]');
    test.comment(this.getCurrentUrl());
  });
  casper.then(function() {
    test.assertUrlMatch(url+"/#about-esa", 'Button press Navigated to '+this.getCurrentUrl());
  });
  casper.run(function() {
    test.done();
  });
});
