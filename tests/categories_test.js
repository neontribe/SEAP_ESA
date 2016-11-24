(function() {
  var baseurl, hash, navToHash, sectionTitle, url;

  baseurl = 'http://localhost:9001/build';

  hash = 'activities';

  url = baseurl;

  sectionTitle = 'What do you have trouble with?';

  navToHash = function(hash) {
    var currentUrl;
    casper.click('button[data-action="clean-up"]');
    casper.thenClick('button[data-action="menu"]');
    casper.thenClick('a[data-action="start-or-resume"]');
    currentUrl = casper.getCurrentUrl();
    return true;
  };

  casper.test.begin('ESA Choose an Activity', 3, function(test) {
    return casper.start(url, function() {
      test.comment(this.getCurrentUrl());
      if (this.getCurrentUrl().search('resume' !== -1)) {
        return navToHash(hash);
      }
    }).then(function() {
      var cat, catCount, cats, i, len, visableTitle;
      test.assertExists('.loaded h1', 'Title showing for: ' + this.getCurrentUrl());
      visableTitle = this.fetchText('.loaded h1');
      test.assertEquals(visableTitle, sectionTitle, 'Section title displayed as: ' + sectionTitle);
      catCount = 0;
      cats = this.getElementsAttribute('.loaded li button', 'data-category');
      test.comment('Categories Found:');
      for (i = 0, len = cats.length; i < len; i++) {
        cat = cats[i];
        catCount++;
        this.echo(cat);
        if (cat && cat !== 'random-category') {
          test.comment(this.getCurrentUrl());
        }
      }
      return test.assertElementCount('.loaded li button', cats.length);
    }).run(function() {
      return test.done();
    });
  });

}).call(this);
