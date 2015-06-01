# Go to about page
# Check there are expandable divs containing h2 button
# Check theat clicking h2 button unhides and expands
# Check that clicking h2 button with visable content hides and collapses
# Todo - count elements
# Todo - check for practise and menu links at bottom
# Todo - check for pdf guide link

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
