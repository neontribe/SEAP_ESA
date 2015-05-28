url = 'http://localhost:9001/build'

casper.test.begin "Coffee latte", 1, ->

casper.start url, ->
  @.click 'a[data-action="stats"]'
  @.test.assertUrlMatch(url+'/#stats','matches')
  # hmm this fill depends on venue being name attr - not id
  #@.fill "input#venue", venue:"Starbucks", true
casper.run ->
  # display results
  @.exit()
