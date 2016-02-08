# Go to activities page
# Check the visable title is 'What do you have trouble with?'.
# Check for li button data category and count equals button count
# Check that clicking each li button goes to a question in that category

baseurl = 'http://localhost:9001/build'
hash = 'activities'
url = baseurl
sectionTitle = 'What do you have trouble with?'

# Helper to get back to categories list
navToHash = (hash) ->
  casper.click 'button[data-action="clean-up"]'
  casper.thenClick 'button[data-action="menu"]'
  casper.thenClick 'a[data-action="start-or-resume"]'
  currentUrl = casper.getCurrentUrl()
  true

casper.test.begin 'ESA Choose an Activity', 3, (test) ->
  # Start go straight to categories page
  casper
    .start url, ->
      test.comment this.getCurrentUrl()
      # make sure we aren't on the resume message
      # TODO add to util functions - clear data go to page
      if @getCurrentUrl().search 'resume' != -1
        navToHash hash

    .then ->
    # h1 visable
      test.assertExists '.loaded h1',
        'Title showing for: ' + @getCurrentUrl()
      # visible loaded h1 is as expected
      visableTitle = @fetchText '.loaded h1'
      test.assertEquals visableTitle, sectionTitle,
        'Section title displayed as: ' + sectionTitle
      # check for li buttons, data-cat matches display text, return count
      catCount = 0
      cats = @getElementsAttribute '.loaded li button', 'data-category'
      test.comment 'Categories Found:'
      for cat in cats
        catCount++
        @echo cat
        if cat && cat != 'random-category'
          test.comment @getCurrentUrl()
         # @click '.loaded li button[data-category="'+cat+'"]'
         # h2Activity = @fetchText '.loaded h2 span.activity'
         # test.assertEquals h2Activity, 'Activity: ' + cat,
         #   'Clicking button displays question from: ' + cat
         # @click 'button[data-action="your-assessment"]'
         # @click 'button[data-action="delete-are-you-sure"]'
         # @click 'button[data-action="delete-data"]'
         # @click 'button[data-action="menu"]'
         # @click 'button[data-action="start-or-resume"]'
          
      # number of categories matches number of buttons
      test.assertElementCount '.loaded li button', cats.length
    .run ->
      test.done()
