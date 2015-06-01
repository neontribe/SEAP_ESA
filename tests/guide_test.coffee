# Go to about page
# Check there are expandable divs containing h2 button
# Check theat clicking h2 button unhides and expands
# Check that clicking h2 button with visable content hides and collapses
# Todo - check external links - make sure they open in new tab
# Todo - count elements
# Todo - check for practise and menu links at bottom
# Todo - check for pdf guide link

url = 'http://localhost:9001/build'
hash = 'about-esa'
guideSection = 'application-process'
guideSectionSelector = '.flow.loaded .expandies h2 button'

# Helper to count number of expanded sections of selector type
countOpen = (selector) ->
  openSections = 0
  # check if any sections are open and return count
  openSectionsFound =
    casper.exists selector + '[aria-expanded="true"]'
  openGuideSections =
    casper.getElementsInfo selector +
      '[aria-expanded="true"]' if openSectionsFound
  openSections = openGuideSections.length if openSectionsFound
  openSections

casper.test.begin 'ESA Guide', 4, (test) ->
  # Start at home, click about esa button
  casper
    .start url, ->
      @click 'button[data-action="' + hash + '"]'
      test.comment this.getCurrentUrl()
  
    .then (data) ->
    # Correct url appears
      test.assertUrlMatch url + '/#' + hash,
        'Button press Navigated to ' + @getCurrentUrl()
      # visible loaded content contains expandies
      test.assertExists guideSectionSelector
      # check if any sections are open and return count
      data.startOpen = countOpen guideSectionSelector
      test.comment data.startOpen + ' Guide sections opened at start'
      test.comment 'Click ' + guideSection + ' to open'
      @thenClick guideSectionSelector + '[aria-controls="' + guideSection+'"]'
    .then (data) ->
      # verify that more sections are now open
      openGuideSections = countOpen guideSectionSelector
      test.assert openGuideSections > data.startOpen,
        openGuideSections + ' sections now open'
      # click again to close
      test.comment 'Click ' + guideSection + ' to close'
      @thenClick guideSectionSelector + '[aria-controls="' + guideSection+'"]'
    .then (data) ->
      # check if any sections are open and return count
      nowOpen = countOpen guideSectionSelector
      test.assert nowOpen == data.startOpen, nowOpen + ' sections now open'
    .run ->
      test.done()
