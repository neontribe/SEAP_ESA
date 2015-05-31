url = 'http://localhost:9001/build'
hash = 'about-esa'

casper.test.begin 'ESA Guide', 2, (test) ->
  # Start at home, click about esa button
  casper
    .start url, ->
      @click 'button[data-action="' + hash + '"]'
      test.comment this.getCurrentUrl()
  
    .then ->
    # Correct url appears
      test.assertUrlMatch url + '/#' + hash,
        'Button press Navigated to ' + @getCurrentUrl()
      # visible loaded content contains expandies 
      test.assertExists '.flow.loaded .expandies'
    .run ->
      test.done()
