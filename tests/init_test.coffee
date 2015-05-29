url = 'http://localhost:9001/build'

casper.test.begin 'Title page', 4, ->
  casper.start url, ->
    @test.comment @getCurrentUrl()
    @test.assertHttpStatus 200, 'SEAP is up'
    @test.assertTitle 'My ESA Assessment', 'ESA page title is the one expected'
    # 3 Menu links in header
    @test.assertElementCount 'header nav li a', 3, '3 header menu links'
    # 3 buttons
    @test.assertElementCount '.flow.loaded button', 3, '3 buttons in view'
casper.run ->
  @test.done()
