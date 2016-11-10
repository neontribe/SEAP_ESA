(function() {
  var countOpen, guideSection, guideSectionSelector, hash, url;

  url = 'http://localhost:9001/build';

  hash = 'about-esa';

  guideSection = 'application-process';

  guideSectionSelector = '.flow.loaded .expandies h2 button';

  countOpen = function(selector) {
    var openGuideSections, openSections, openSectionsFound;
    openSections = 0;
    openSectionsFound = casper.exists(selector + '[aria-expanded="true"]');
    openGuideSections = openSectionsFound ? casper.getElementsInfo(selector + '[aria-expanded="true"]') : void 0;
    if (openSectionsFound) {
      openSections = openGuideSections.length;
    }
    return openSections;
  };

  casper.test.begin('ESA Guide', 4, function(test) {
    return casper.start(url, function() {
      this.click('button[data-action="resume"]');
      this.click('button[data-action="' + hash + '"]');
      return test.comment(this.getCurrentUrl());
    }).then(function(data) {
      test.assertUrlMatch(url + '/#' + hash, 'Button press Navigated to ' + this.getCurrentUrl());
      test.assertExists(guideSectionSelector);
      data.startOpen = countOpen(guideSectionSelector);
      test.comment(data.startOpen + ' Guide sections opened at start');
      test.comment('Click ' + guideSection + ' to open');
      return this.thenClick(guideSectionSelector + '[aria-controls="' + guideSection + '"]');
    }).then(function(data) {
      var openGuideSections;
      openGuideSections = countOpen(guideSectionSelector);
      test.assert(openGuideSections > data.startOpen, openGuideSections + ' sections now open');
      test.comment('Click ' + guideSection + ' to close');
      return this.thenClick(guideSectionSelector + '[aria-controls="' + guideSection + '"]');
    }).then(function(data) {
      var nowOpen;
      nowOpen = countOpen(guideSectionSelector);
      return test.assert(nowOpen === data.startOpen, nowOpen + ' sections now open');
    }).run(function() {
      return test.done();
    });
  });

}).call(this);
