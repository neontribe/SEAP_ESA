# Go to categories page
# Check the visable title is Choose an activity affected by your condition.
# # Check for li button data category and count equals button count
# Check that clicking each li button goes to a question in that category

baseurl = 'http://localhost:9001/build'
sectionTitle = 'Choose an activity affected by your condition'

# Helper to get back to categories list
navToHash = (test) ->
  casper.reload
  casper.click 'button[data-action="clean-up"]'
  casper.thenClick 'button[data-action="start-or-resume"]'
  true

casper.test.begin 'ESA Choose an Activity', 21, (test) ->
  # Start go straight to categories page
  casper
    .start baseurl, ->
      test.comment this.getCurrentUrl()
    .then ->
      @reload
      @thenClick 'button[data-action="clean-up"]'
      @thenClick 'a[data-action="menu"]'
      @thenClick 'button[data-action="start-or-resume"]'
      test.comment this.getCurrentUrl()
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
          test.comment casper.getCurrentUrl()
          @click '.loaded li button[data-category="'+cat+'"]'
          h2Activity = @fetchText '.loaded h2 span.activity'
          test.assertEquals h2Activity, 'Activity: ' + cat,
            'Clicking button displays question from: ' + cat

      # number of categories matches number of buttons
      test.assertElementCount '.loaded li button', catCount
    .run ->
      test.done()
