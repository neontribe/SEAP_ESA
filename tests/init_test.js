casper.test.begin('Title page', 1, func,tion suite(test) {
    casper.start("http://localhost:9001/build", function() {
      console.log('hello');
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
