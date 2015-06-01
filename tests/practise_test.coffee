# Clear data
# Go to practice page
# Click choose an activity
# Select 'Moving around and using steps'
# Answer 0 value 'yes' (if no 0 value option, try another question)
# remember value of 'yes' for later
# Select ask me another
# TODO after this
# Repeat until end of section reached
# Verify 'well done' message
# Select 'Sitting and standing'
# Answer no (if no 'no' option, try another)
# Verify 'support group qualifier' message
# Click select another question
# Verify in section 'sitting and standing'
# Select 'most negative outcome'
# Verify 'section complete'
# Click My assessment so far
# Verify that 'important' types of questions are displayed
# Count questions
# Select a question
# Click on change your answer
# Select a more positive option (lowest value)
# Return to 'My assessment'
# Verify that the question is no longer there (trello 11)
# TODO trello 12-35 (in chunks)

url = 'http://localhost:9001/build'
startHash = 'start-or-resume'
categoriesSectionSelector = '.loaded#categories-content'
activityName = 'Moving around and using steps'
activitySelector =
  categoriesSectionSelector+' button[data-category="'+activityName+'"]'

# Helper to clear data from session and return home
clearData = (test) ->
  casper.click 'a[data-action="data"]'
  casper.thenClick 'button[data-action="delete-data"]'
  # Make sure we get the deleted message
  casper.then ->
    test.assertExists '#deleted .loaded', 'Deleted message loaded'
  # Return to home
  casper.thenClick 'button[data-action="menu"]'
  true

casper.test.begin 'Practice add remove important question', 4, (test) ->
  # Start at home, clear data, return to home, click start-or-resume
  casper
    .start url, ->
      clearData(test)
      @thenClick 'button[data-action="' + startHash + '"]'
      test.comment this.getCurrentUrl()
    .then (data) ->
    # Correct url appears for activity start
      test.assertUrlMatch url + '/#start',
        'Button press Navigated to ' + @getCurrentUrl()
      @thenClick 'button[data-action="categories"]'
      # visible loaded categories-content
    .then (data) ->
      test.assertExists categoriesSectionSelector
      # verify activity button exists
      test.assertExists activitySelector
      @thenClick activitySelector
    .then (data) ->
      question = @fetchText '.question-container.loaded h2 em'
      test.comment question
      # verify there is a 0 value option if not, ask another
      hasZero = false
      hasZero = @exists '.question-container.loaded input[value="0"]'
      @thenClick '.question-container.loaded input[value="0"]' if hasZero
      data[question] = 0
      @echo 'Answered Yes 0'
      @thenClick '.question-container.loaded button[data-action="pick"]'
    .then (data) ->
      test.comment @fetchText '.question-container.loaded h2 em'
      #TODO run through all questions recording answer given and then
      # check 'My Assessment page is as expected
    .run ->
      test.done()
