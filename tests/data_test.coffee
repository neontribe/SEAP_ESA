# Test navigate to My Assessment/ data page
# Practise some questions
# Go to My Data, clear
# Return to My Assessment and veify that it is cleared

url = 'http://localhost:9001/build'

casper.test.begin "Your Assessment Page", 1, (test)->
  casper
    .start url, ->
      @click 'a[data-action="your-assessment"]'
    .then ->
      test.assertUrlMatch url+'/#your-assessment', 'press link navigates to your-assessment page'
    .run ->
      # display results
      test.done()
