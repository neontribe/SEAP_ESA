# Check site is serving
# Check title is ESA Assessment Support
# Check count 2 menu links in main nav (Home, your assessment)
# Make sure we aren't on resume screen, then
# Check count 2 option buttons - (guide, practise)
# Check for Survey and Privacy link in footer

url = 'http://localhost:9001/build'

casper.test.begin 'Title page', 6, (test)->
  casper
    .start url, ->
      test.comment @getCurrentUrl()
      test.assertHttpStatus 200, 'SEAP is up'
      test.assertTitle 'ESA Assessment Support', 'ESA page title is the one expected'
      # 2 Menu links in header
      test.assertElementCount 'header nav li a', 2, '2 header menu links'
      # make sure we aren't on the resume message
      @click 'button[data-action="resume"]'
      @click 'a[data-action="menu"]'
    .then ->
      # body content 2 buttons
      test.assertElementCount '.flow.loaded button', 2, '2 buttons in view'
    .then ->
      #footer content
      test.assertSelectorHasText 'footer #feedback', 'Is there anything wrong with this page?', 'Found survey link in footer'
      test.assertSelectorHasText 'footer .privacy-link a', 'Privacy & terms of use', 'Found privacy link in footer'
    .run ->
      test.done()
