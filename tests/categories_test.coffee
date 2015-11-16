# Go to categories page
# Check the visable title is Choose an activity that is relevant to any problems you experience.
# # Check for li button data category and count equals button count
# Check that clicking each li button goes to a question in that category

baseurl = 'http://localhost:9001/build'
hash = 'categories'
url = baseurl + '/#' + hash
sectionTitle = 'Choose an activity that is relevant to any problems you experience.'

# Helper to get back to categories list
navToHash = (hash) ->
  casper.click 'a[data-action="stats"]'
  casper.click 'button[data-action="delete-data"]'
  casper.click 'button[data-action="menu"]'
  casper.click 'a[data-action="start-or-resume"]'
  casper.click 'button[data-action="' + hash + '"]'
  currentUrl = casper.getCurrentUrl()

casper.test.begin 'ESA Choose an Activity', 21, (test) ->
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
      test.assertExists '.box.loaded h1',
        'Title showing for: ' + @getCurrentUrl()
      # visible loaded h1 is as expected
      visableTitle = @fetchText '.box.loaded h1'
      test.assertEquals visableTitle, sectionTitle,
        'Section title displayed as: ' + sectionTitle
      # check for li buttons, data-cat matches display text, return count
      catCount = 0
      cats = @getElementsAttribute '.box.loaded li button', 'data-category'
      test.comment 'Categories Found:'
      for cat in cats
        catCount++
        @echo cat
        if cat && cat != 'random-category'
          @click '.box.loaded li button[data-category="'+cat+'"]'
          h2Activity = @fetchText '.loaded h2 span.activity'
          test.assertEquals h2Activity, 'Activity: ' + cat,
            'Clicking button displays question from: ' + cat
          navToHash hash
 
      # number of categories matches number of buttons
      test.assertElementCount '.box.loaded li button', catCount
    .run ->
      test.done()
