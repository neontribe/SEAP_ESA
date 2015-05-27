casper.test.begin('Title page', 3, function suite(test) {
    casper.start("http://localhost:9001/build", function() {
      this.test.comment('bum'+this.getCurrentUrl());
      this.test.assertHttpStatus(200, 'SEAP is up');
      test.assertTitle("My ESA Assessment", "ESA page title is the one expected");
        //test.assertExists('form[action="/search"]', "main form is found");
        //this.fill('form[action="/search"]', {
            //q: "casperjs"
        //}, true);
    });

    casper.run(function() {
        test.done();
    });
});
