# REUSED
# Clear data
# Go to practice page
# Click choose an activity

# TEST 1 - answer all in category
# Select 'Moving around and using steps'
# Answer 0 value 'yes' (if no 0 value option, stop)
# remember value of 'yes' for later
# Select ask me another
# Repeat until end of section reached
# Verify category complete page for 'Moving around and using steps'

# TEST 2 - instant qualify high with 16 value answer
# Select 'Using your hands'
# Answer no (value 16)
# Click select another question
# Verify 'support group qualifier' message

# TEST 3 - instant qualify low with
# Select 'Awareness'
# Answer Yes (value 0)
# Click select another question
# Verify in section 'Awareness'
# Select All the time (value 15)
# Verify 'section complete'
# Click select another question
# Verify 'Work Related Activity group' message

# TEST 4 - qualify high with 15 + *
# Select 'Picking up and moving things'
# Click 'Ask me another' 3 times
# Answer No (value 9)
# Click 'Ask me another' 2 times
# Click 'A new activity'
# Select 'Verbal communication'
# Click 'Ask me another'
# Answer Very difficult... (value 6)
# Click 'Ask me another'
# Verify 'Work related activity group' message
# Click 'Ask me another'
# Click 'Another question'
# Click 'A new activity'
# Select 'Eating food and drink'
# Answer No (value *)
# Click 'Ask me another'
# Verify 'support group qualifier' message

# TODO move to another file?After test 3 ?without clearing -
# Click My Assessment...
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

# Helper to get selector for category
getCategorySectionSelector = (activityName) ->
  '.loaded#categories-content button[data-category="'+activityName+'"]'

# Helper to clear data from session and return home
clearData = (test) ->
  casper.click 'a[data-action="stats"]'
  casper.thenClick 'button[data-action="delete-data"]'
  # Make sure we get the deleted message
  casper.then ->
    test.assertExists '#deleted .loaded', 'Deleted message loaded'
  # Return to home
  casper.thenClick 'button[data-action="menu"]'
  true

# Helper to clear session and start practice in category
clearAndStartPractise = (test, activityName) ->
  clearData(test)
  casper.thenClick 'button[data-action="' + startHash + '"]'
  test.comment casper.getCurrentUrl()
  casper.then (data) ->
    #set empty answer obj
    data['answered'] = {}
    # Correct url appears for activity start
    test.assertUrlMatch url + '/#start',
      'Button press Navigated to ' + @getCurrentUrl()
    casper.thenClick 'button[data-action="categories"]'
    # visible loaded categories-content
  casper.then (data) ->
    test.assertExists '.loaded#categories-content',
      'Found categories content'
    # verify activity button exists
    activitySelector = getCategorySectionSelector activityName
    test.assertExists activitySelector,
      'Found "' + activityName + '" button.'
    casper.thenClick activitySelector
    true

# Answer question with given value
# returns false if value is not valid option
answerQuestion = (value) ->
  hasValue = false
  hasValue = casper.exists '.question-container.loaded input[value="'+value+'"]'
  casper
    .click '.question-container.loaded input[value="'+value+'"]' if hasValue
  hasValue

###############################
# TEST Answer all in category #
###############################
activityName1 = 'Moving around and using steps'

casper.test.begin 'Answer all questions using: ' + activityName1, 6, (test) ->
  # Start at home, clear data, return to home, click start-or-resume
  casper
    .start url, ->
      clearAndStartPractise test, activityName1
    .then (data) ->
      isNext = @exists '.question-container.loaded button[data-action="pick"]'
      test.comment 'Answer all 0'
      while isNext
        question = @fetchText '.question-container.loaded h2 em'
        @echo question
        # verify there is a 0 value option if not, ask another
        if answerQuestion(0) then data['answered'][question] = 0
        #@echo JSON.stringify(data)
        @click '.question-container.loaded button[data-action="pick"]'
        isNext = @exists '.question-container.loaded'
        test.comment 'Another question in category:'+isNext
        break unless isNext
    .then (data) ->
      # verify we are on the category-finished page
      test.assertUrlMatch url + '/#category-finished',
        'Landed on category finished page'
      # verify category name as expected
      test.assertSelectorHasText '.box.loaded p strong',
        activityName1.toLowerCase(),
        'Category name matches "' + activityName1 + '"'
    .run ->
      test.done()

##########################################
# Test Qualify High with value 16 answer #
##########################################
activityName2 = 'Using your hands'

casper.test.begin 'Qualify high with : ' + activityName2, 5, (test) ->
  # Start at home, clear data, return to home, click start-or-resume
  casper
    .start url, ->
      clearAndStartPractise test, activityName2
    .then (data) ->
      question = @fetchText '.question-container.loaded h2 em'
      test.comment question
      # verify and click option value 16
      if answerQuestion(16) then data['answered'][question] = 16
      # click ask me another
      @click '.question-container.loaded button[data-action="pick"]'
      # verify Support Group Qualifier message
      test.assertSelectorHasText '.box.loaded h1 strong',
        'Support Group',
        'Clicking value 16 answer instantly qualifies high'
    .run ->
      test.done()

#########################################
# Test Qualify Low with value 15 answer #
#########################################
activityName3= 'Awareness of hazards or danger'

casper.test.begin 'Qualify low with : ' + activityName3, 5, (test) ->
  # Start at home, clear data, return to home, click start-or-resume
  casper
    .start url, ->
      clearAndStartPractise test, activityName3
    .then (data) ->
      question = @fetchText '.question-container.loaded h2 em'
      test.comment question
      # verify and click option value 0
      if answerQuestion(0) then data['answered'][question] = 0
      # click ask me another
      @click '.question-container.loaded button[data-action="pick"]'
      # verify and click value 15
      if answerQuestion(15) then data['answered'][question] = 15
      # click ask me another
      @click '.question-container.loaded button[data-action="pick"]'
      # verify Support Group Qualifier message
      test.assertSelectorHasText '.box.loaded h1 strong',
        'Work Related Activity Group',
        'Clicking value 15 answer instantly qualifies low'
    .run ->
      test.done()

####################################################
# Test Qualify High with aggregate value 15 + star #
# points taken as highest from all categories      #
# The total 15 has to be from only 1 question per  #
# category                                         #
####################################################
activityName4= 'Picking up and moving things'

casper.test.begin 'Qualify low then high with : ' + activityName4, 6, (test) ->
  # Start at home, clear data, return to home, click start-or-resume
  casper
    .start url, ->
      clearAndStartPractise test, activityName4
    .then (data) ->
      # click ask me another 4 times
      for i in [0...2] by 1
        @click '.question-container.loaded button[data-action="pick"]'
      question = @fetchText '.question-container.loaded h2 em'
      test.comment question
      # verify and click option value 9
      if answerQuestion(9) then data['answered'][question] = 9
      # click ask me another 2 times
      for i in [0...2] by 1
        @click '.question-container.loaded button[data-action="pick"]'
      # click A new activity
      @click '.box.loaded button[data-action="categories"]'
      @click getCategorySectionSelector 'Verbal communication'
      @click '.question-container.loaded button[data-action="pick"]'
      question = @fetchText '.question-container.loaded h2 em'
      test.comment question
      # verify and click value 6
      if answerQuestion(6) then data['answered'][question] = 6
      # click ask me another
      @click '.question-container.loaded button[data-action="pick"]'
      # verify Support Group Qualifier message
      test.assertSelectorHasText '.box.loaded h1 strong',
        'Work Related Activity Group',
        'Clicking aggregate 15 from different categories qualifies low'
      # ask another then new act eating and drink answer no.
      # should qualify high
      @click '.box.loaded button[data-action="pick"]'
      @click '.box.loaded button[data-action="categories"]'
      @click getCategorySectionSelector 'Eating and drinking'
      if answerQuestion('*') then data['answered'][question] = '*'
      # click ask me another
      @click '.question-container.loaded button[data-action="pick"]'
      # verify Support Group Qualifier message
      test.assertSelectorHasText '.box.loaded h1 strong',
        'Support Group',
        'Clicking value * answer with aggregate 15 already qualifies high'
    .run ->
      test.done()
