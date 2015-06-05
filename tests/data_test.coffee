# Test navigate to My Assessment/ data page
# Fill in some details
# Practise some questions
# Go to My Data, clear
# Return to My Assessment and veify that it is cleared

url = 'http://localhost:9001/build'

casper.test.begin "Stats Page", 1, (test)->
  casper
    .start url, ->
      @click 'a[data-action="stats"]'
      test.assertUrlMatch url+'/#stats', 'press link navigates to stats page'
      # hmm this fill depends on venue being name attr - not id
      #@fill "input#venue", venue:"Starbucks", true
    .run ->
      # display results
      test.done()
