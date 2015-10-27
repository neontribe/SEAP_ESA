/**********************************************************************
START UP (DETERMINE IF USER HAS BEEN USING THE APP ALREADY OR NOT)
**********************************************************************/

// Define indexOf for array - ie8
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(val) {
    return jQuery.inArray(val, this);
  };
}

// define the database
var db = $.localStorage;

window.hashHistory = [];

if (db.isEmpty('esaAss')) {

  // setup the database esaAss object
  initAss();

  // set answered global to false
  window.answered = false;

  // load the intro slide
  loadSlide('main-menu');

} else {

  // welcome back users or allow new users to restart
  loadSlide('resume');

}

/**********************************************************************
FUNCTIONS
**********************************************************************/

function initAss() {
  // model the database 'esaAss' object
  var assTemplate = { // the questions which haven't been viewed
    unseenQuestions: [],
    seenQuestions: [],
    skippedQuestions: [], // the questions which have been viewed but not answered
    allCategories: _.uniq(_.reject(window.allCategories,
      function(cat) {
        return cat && cat.charAt(0) === '*';
      }
    )),
    remainingCategories: _.uniq(_.reject(window.allCategories,
      function(cat) {
        return cat && cat.charAt(0) === '*';
      }
    )),
    started: false, // whether a practise has been started
    answeredOne: false, // Whether any questions have been answered at all
    context: null, // the jQuery object for the slide in hand
    slideType: null, // null or 'question' etc.
    mode: 'unseenQuestions', // 'unseenQuestions' or 'skippedQuestions'
    category: null, // or the name of the current category (activity)
    answers: {}, // the master object of category high scores for tallying
    low: false, // low qualification?
    high: false, // high qualification?
    reminders: [], // list of reminders form "Things to remember" checkboxes
    incomplete: true, // whether all the questions have been answered
    date: '',
    venue: '',
    time: ''
  };

  // Save the virgin ass to local storage
  db.set('esaAss', assTemplate);

  // reset radio buttons
  $('[type="radio"]').prop('checked', false);

}

function getCatQuestions(slug) {

  if (slug === "i-dont-know") {
    // Select a random category containing unseen questions
    var nextCat = _.sample(db.get('esaAss.remainingCategories'));
    db.set('esaAss.category', nextCat);
    loadSlide('chose-i-dont-know');
    return;

  } else {
    db.set('esaAss.category', slug);
    getCatQuestionArr(slug);
    pickQuestion();

  }

}

function getCatQuestionArr(slug) {

  var questions = [],
    reducedToCat = _.where(window.allQuestions, {
      category: slug
    });

  $.each(reducedToCat, function(i, v) {
    questions.push(v.question);
  });

  db.set('esaAss.unseenQuestions', questions);

}

function loadSlide(id, type) {

  // Register google page view
  var trackHashes = ['main-menu', 'stats', 'data', 'about-esa', 'start'];

  if ($.inArray(id, trackHashes) !== -1) {
    ga('send', 'pageview', '#' + id);
  }

  if (id === 'stats') {

    // if you ran out of unseen questions and didn't skip any
    if (_.isEmpty(db.get('esaAss.unseenQuestions')) && _.isEmpty(db.get('esaAss.skippedQuestions')) && _.isEmpty(db.get('esaAss.remainingCategories')) && db.get('esaAss.started')) {
      db.set('esaAss.incomplete', false);
    }

    // compile the stats before showing slide
    compileStats();

  }

  if (id === 'categories') {
    compileCategories();
  }

  if (id === 'category-finished') {
    $('#this-activity').text(db.get('esaAss.category').toLowerCase());
  }

  if (id === 'chose-i-dont-know') {
    $('#chose-i-dont-know button').attr('data-category', db.get('esaAss.category'));
    $('#chose-i-dont-know #unseen-category').text(db.get('esaAss.category'));
  }

  $('.slide > *').removeClass('loaded');

  // set type in local storage or reset to null
  if (type) {
    db.set('esaAss.slideType', type);
  } else {
    db.set('esaAss.slideType', null);
  }

  // go to picked question
  window.location.hash = '#' + id;

  // focus title to announce title in AT
  $('#' + id)
    .find('[tabindex="-1"]')
    .focus();

  // find out if we've gone to one of the locations that don't need saving
  var exclude = _.find(['resume', 'break-time', 'resume-practise'],
    function(unsaveable) {
      return unsaveable === id;
    });

  // If it's not an excluded location, save location
  if (!exclude) {

    // Record where the user is for resuming purposes
    db.set('esaAss.whereIAm', id);

  }

  // Set context reference (jQuery object)
  db.set('esaAss.context', id);

  // add the loaded class for transitions
  $('#' + id + ' > *').addClass('loaded');

}

// show a random unseen question
function pickQuestion() {

  // If the next question was a followup, load it
  if (db.get('esaAss.followupSlug')) {
    loadSlide(db.get('esaAss.followupSlug'));
    db.set('esaAss.followupSlug', null);
    return;
  }

  // If we need to alert user of qualification, do it
  if (db.get('esaAss.show-low')) {
    loadSlide('qualify-low');
    db.set('esaAss.show-low', false);
    return;
  }

  // same for high qualification
  if (db.get('esaAss.show-high')) {
    loadSlide('qualify-high');
    db.set('esaAss.show-high', false);
    return;
  }

  // We've started practicing
  db.set('esaAss.started', true);

  // the type of the previous slide if any
  var typeOfSlide = db.get('esaAss.slideType');
  // the last slide seen
  var context = db.get('esaAss.context');
  // get mode (unseen or skipped)
  var mode = db.get('esaAss.mode');

  if (typeOfSlide === 'question' && !window.answered && mode === 'unseenQuestions') {

    // put the unanswered question into the array of skipped questions
    var skipped = db.get('esaAss.skippedQuestions');
    skipped.push(db.get('esaAss.context'));
    db.set('esaAss.skippedQuestions', _.uniq(skipped));

  }

  // get the appropriate set
  var questions = db.get('esaAss.' + mode);

  if (db.get('esaAss.category')) {
    if (_.isEmpty(db.get('esaAss.unseenQuestions'))) {
      if (_.isEmpty(db.get('esaAss.remainingCategories'))) {

        db.set('esaAss.category', null);

        if (_.isEmpty(db.get('esaAss.skippedQuestions'))) {
          loadSlide('seen-all-even-skipped');
          db.set('esaAss.incomplete', false);
          return;
        } else {
          loadSlide('seen-all');
          return;
        }
      } else {
        loadSlide('category-finished');
        return;
      }
    }
  } else {
    if (mode === 'unseenQuestions' && _.isEmpty(db.get('esaAss.unseenQuestions')) && _.isEmpty(db.get('esaAss.skippedQuestions'))) {
      loadSlide('seen-all-even-skipped');
      return;
    }
    if (mode === 'unseenQuestions' && _.isEmpty(db.get('esaAss.unseenQuestions'))) {
      loadSlide('seen-all');
      return;
    }
    if (mode === 'skippedQuestions' && _.isEmpty(db.get('esaAss.skippedQuestions'))) {
      loadSlide('seen-all-even-skipped');
      db.set('esaAss.incomplete', false);
      return;
    }
  }

  // init individual question var
  var question;

  if (mode === 'unseenQuestions') {

    question = questions[0];

    // set collection with this question removed
    db.set('esaAss.' + mode, _.without(questions, question));

  } else {

    if (window.answered) {

      questions = _.without(questions, context);

      db.set('esaAss.' + mode, questions);

      question = questions[0];

      // if the array is empty, all the skipped questions are answered
      if (question === undefined) {

        loadSlide('seen-all-even-skipped');
        return;
      }

    } else {

      // remove last question seen from random sample
      // so two questions don't show at once
      // unless this is the last one
      if (questions.length !== 1) {
        questions = _.without(questions, context);
      }

      if (db.get('esaAss.category')) {

        question = questions[0];

      } else {

        // use underscore to get random question slug
        question = _.sample(questions);

      }

    }

  }

  // get seen questions array
  var seen = db.get('esaAss.seenQuestions');

  // add this new question
  seen.push(question);

  db.set('esaAss.seenQuestions', seen);

  // load question slide and set slide type global to 'question'
  loadSlide(question, 'question');

  // set to false until button pressed
  window.answered = false;

}

// clear data and go to start screen
function restart() {

  db.set('esaAss.unseenQuestions', []);
  db.set('esaAss.seenQuestions', []);
  db.set('esaAss.skippedQuestions', []);
  db.set('esaAss.started', false);
  db.set('esaAss.mode', 'unseenQuestions');
  db.set('esaAss.category', null);
  db.set('esaAss.remainingCategories', _.uniq(window.allCategories));

  // go to start screen
  loadSlide('start');

}

// go to slide you were last at
function resume() {

  // get the stored slide id
  var whereIWas = db.get('esaAss.whereIAm');

  loadSlide(whereIWas);

}

function tally() {

  // get all the answers
  var answers = db.get('esaAss.answers');

  // Remove the '*' answers
  var omitSpecial = _.omit(answers, 'Eating and drinking');

  // add up the highest values for each category
  // by taking the max value that's not 16 from each
  // category and adding them together
  var total = _.reduce(omitSpecial, function(memo, cat) {
    return memo + _.max(_.without(_.pluck(cat, 'points'), 16));
  }, 0);

  return total;

}

function promote() {

  var answers = db.get('esaAss.answers');

  var array = _.toArray(answers);

  var star = false;

  $.each(array, function(key, value) {
    $.each(value, function(k, v) {
      if (v.points === '*') {
        star = true;
      }
    });
  });

  return star;

}

// add the high scores for each category together
function qualify() {

  var total = tally();

  if (total >= 15) {

    // if an end question was set to promote from low to high
    if (promote()) {

      //don't show the slide if you have already
      if (!db.get('esaAss.high')) {

        db.set('esaAss.show-high', true);

      }

      // record that low qualification is possible
      db.set('esaAss.low', true);
      // AND record that high qualification is possible
      db.set('esaAss.high', true);

    } else {

      //don't show the slide if you have already
      if (!db.get('esaAss.high') && !db.get('esaAss.low')) {

        db.set('esaAss.show-low', true);

      }

      // record that low qualification is possible
      db.set('esaAss.low', true);

    }

  } else {

    // reset to false
    db.set('esaAss.low', false);

  }

}

// helper function to test numeric strings
function isNumeric(num) {
  return !isNaN(num);
}

function compileStats() {

  divideAnswers();

  if (_.isEmpty(db.get('esaAss.supportAnswers'))) {
    db.set('esaAss.high', false);
  }

  // if WRAGroup a no, set to false
  if (_.isEmpty(db.get('esaAss.WRAGAnswers'))) {
    db.set('esaAss.low', false);
  }

  // template up the stats with handlebars and
  // write to the stats container
  var template = Handlebars.compile(document.getElementById("stats-template").innerHTML);
  var esaAssData = db.get('esaAss');
  var output = template(esaAssData);
  $('#stats-content').html(output);

}

function disabledCats() {

  var remaining = db.get('esaAss.remainingCategories');

  $('.real-cat').each(function() {

    var button = $('button', this);

    button.attr('disabled', null);

    var catName = button.attr('data-category');

    // console.log('remaining', remaining);
    // console.log('disabled?', !_.contains(remaining, catName));

    if (!_.contains(remaining, catName)) {

      button.attr('disabled', 'disabled');

    }

  });

}

function compileCategories() {

  // template up the stats with handlebars and
  // write to the categories container
  var template = Handlebars.compile(document.getElementById("categories-template").innerHTML);
  var esaAssData = db.get('esaAss');
  var output = template(esaAssData);
  $('#categories-content').html(output);

  // disable seen categories
  disabledCats();

}

// remove answers from category nesting for easy iteration
function divideAnswers() {

  var answers = db.get('esaAss.answers');

  var supportAnswers = [];
  var WRAGAnswers = [];

  // ugly nested each to make a handelebars #each iterable array of question objects
  $.each(answers, function(key, value) {
    if (value) {
      $.each(value, function(k, v) {
        if (v) {
          // include support group answers
          if (v.points === 16) {
            // push to flattened array
            supportAnswers.push({
              question: v.question,
              answer: v.answer,
              points: v.points
            });
          }
          // if it's a promotion question
          // and the total is more than 15
          if (v.points === '*' && tally() >= 15) {
            // push the promotion question
            supportAnswers.push({
              question: v.question,
              answer: v.answer,
              points: v.points
            });
          }
          // include WRAG answers
          if (v.points > 0 && v.points !== 16) {
            WRAGAnswers.push({
              question: v.question,
              answer: v.answer,
              points: v.points
            });
          }
        }
      });
    }
  });

  // set these to be accessible by template
  db.set('esaAss.supportAnswers', supportAnswers);
  db.set('esaAss.WRAGAnswers', WRAGAnswers);

}

/**********************************************************************
HELPERS
**********************************************************************/

Handlebars.registerHelper('count', function(array) {
  return array.length || 0;
});

Handlebars.registerHelper('seen', function() {
  return window.allQuestions.length - db.get('esaAss.unseenQuestions').length;
});

Handlebars.registerHelper('answered', function() {

  var answers = db.get('esaAss.answers');

  var amount = 0;

  $.each(answers, function(key, value) {
    amount += _.size(value);
  });

  return amount;
});

Handlebars.registerHelper('accuracy', function(array) {

  var answers = db.get('esaAss.answers');

  var answered = 0;

  $.each(answers, function(key, value) {
    answered += _.size(value);
  });

  var accuracy = Math.round((answered / allQuestions.length) * 100) + "%";

  return accuracy;
});

Handlebars.registerHelper('qualifyHigh', function() {
  if (db.get('esaAss.high') && !db.get('esaAss.low')) {
    return '<p>You may qualify for the highest allowance, placing you in what&#x2019;s called the Support Group. Remember to show your assessor the answers marked <span class="warn">VERY IMPORTANT</span> (below) by printing this page or opening it on your phone. These indicate you could qualify.</p>';
  }
});

Handlebars.registerHelper('qualifyLow', function() {
  if (!db.get('esaAss.high') && db.get('esaAss.low')) {
    return '<p>You may qualify for the standard ESA allowance, placing you in what&#x2019;s called the Work Related Activity Group. Remember to show your assessor the answers marked <span class="warn amber">IMPORTANT</span> (below) by printing this page or opening it on your phone. These indicate you could qualify.</p>';
  }
});

Handlebars.registerHelper('qualifyEither', function() {
  if (db.get('esaAss.high') && db.get('esaAss.low')) {
    return '<p>It looks like you&#x2019;ll qualify for the standard allowance (placing you in what&#x2019;s called the Work Related Activity Group) or possibly the higher allowance (Support Group). Remember to show your assessor the <strong>Important Answers</strong> (below) by printing this page or opening it on your phone. These are the questions that indicate you qualify.</p>';
  }
});

Handlebars.registerHelper('qualifyNone', function() {
  if (!db.get('esaAss.high') && !db.get('esaAss.low')) {
    return "<p>From the questions you've answered so far, you do not have enough points to qualify for ESA.</p>";
  }
});

Handlebars.registerHelper('sluggify', function(words) {
  var slug = words
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  return slug;
});

function sluggify(string) {

  return string
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

}

/**********************************************************************
EVENTS
**********************************************************************/

// click to see a random question
$('body').on('click', '[data-action="pick"]', function() {

  // run pickQuestion function to get a random unseen question
  pickQuestion();

});

// click to see a random question
$('body').on('click', '[data-action="skipped"]', function() {

  // the first skipped question cannot have been answered
  window.answered = false;

  // set mode to skipped questions
  db.set('esaAss.mode', 'skippedQuestions');

  // pick a question
  pickQuestion();

});

// restart the questions part but keep the data
$('body').on('click', '[data-action="restart"]', function() {

  // run restart function defined in FUNCTIONS block
  restart();

});

// restart the app
$('body').on('click', '[data-action="start-or-resume"]', function() {

  // has the user (or _a_ user) been to the questions section before?
  if (db.get('esaAss.started')) {

    pickQuestion();

  } else {

    loadSlide('start');

  }

});

$('body').on('click', '[data-action="break"]', function() {

  // run resume function defined in FUNCTIONS block
  db.set('esaAss.whereIAm', window.location.hash.slice(1));
  loadSlide('break-time');

});

$('.expandies').on('click', '[aria-controls]', function() {

  var expanded = $(this).attr('aria-expanded');

  var controlled = $('#' + $(this).attr('aria-controls'));

  if (expanded === 'false') {

    $(this).attr('aria-expanded', 'true');

    controlled.attr('aria-hidden', 'false');

  } else {

    $(this).attr('aria-expanded', 'false');

    controlled.attr('aria-hidden', 'true');

  }

});

$('body').on('click', '[data-action="resume"]', function() {

  // run resume function defined in FUNCTIONS block
  resume();

});

$('body').on('click', '[data-action="menu"]', function() {

  // run resume function defined in FUNCTIONS block
  loadSlide('main-menu');

});

$('body').on('click', '[data-action="remember"]', function() {

  // run resume function defined in FUNCTIONS block
  loadSlide('remember');

});

$('body').on('click', '[data-action="clean-up"]', function() {

  // set answered global to false
  window.answered = false;

  // initialize database
  initAss();

  // load the intro slide
  loadSlide('main-menu');

});

$('body').on('click', '[data-action="delete-data"]', function() {

  // set answered global to false
  window.answered = false;

  // initialize database
  initAss();

  // load the deleted data slide
  loadSlide('deleted');

});

$('body').on('click', '[data-action="stats"]', function() {

  // load the stats slide
  loadSlide('stats');

});

$('body').on('click', '[data-action="prep"]', function() {

  // get id of slide to load
  var id = $(this).attr('data-prep-slug');

  // check checkboxes based on previous actions
  checkReminders(id);

  // load slide
  loadSlide(id);

});

$('body').on('click', '[data-action="about-esa"]', function() {

  // load slide
  loadSlide('about-esa');

});

$('body').on('change', '[data-action="save-basic-info"]', function() {

  db.set('esaAss.' + $(this).attr('id'), $(this).val());

});

$('body').on('change', '[type="radio"]', function() {

  // record that change has been made
  window.answered = true;

  db.set('esaAss.answeredOne', true);

  // get checked answer's value and the category the question belongs to
  var context = db.get('esaAss.context');
  var points = $(':checked', '#' + context).val();
  var category = $(':checked', '#' + context).attr('data-category-name');
  var question = $('h2 em', '#' + context).text();
  var answer = $(':checked + span', '#' + context).text();

  // Remove from skipped questions if present
  // (part of back button fixing)
  db.set('esaAss.skippedQuestions', _.without(db.get('esaAss.skippedQuestions'), context));

  // remove followup '*' cipher if present from category name
  if (category.charAt(0) === '*') {

    category = category.substr(1);

  }

  var answerObject;

  if (!isNumeric(points) && points !== '*') {

    // turn the followup question into a slug ready to use
    db.set('esaAss.followupSlug', 'question-' + sluggify(points));

  } else {

    // If not a star answer, cast to real integer
    if (points !== '*') {

      // cast to real integer
      points = +points;

    }

    // initialize the answer object
    answerObject = {
      question: question,
      answer: answer,
      points: points
    };

    // check if the category object exists
    // and, if not, set it
    if (!db.isSet('esaAss.answers.' + category)) {
      db.set('esaAss.answers.' + category, category);
    }

    // set the new points for this question in this category
    db.set('esaAss.answers.' + category + '.' + context, answerObject);

    if (points === 16) {

      if (!db.get('esaAss.high')) {

        // record that the high qualification is true
        db.set('esaAss.high', true);

        // no need to add up, just make sure the user is told
        db.set('esaAss.show-high', true);

      }

    } else {

      // fire the adding up function
      // to see if there are enough points to qualify
      qualify();

    }

  }

});

$('body').on('click', '[data-action="categories"]', function() {

  loadSlide('categories');

});

$('body').on('click', '[data-action="change"]', function() {

  // get question slug
  var slug = $(this).attr('data-question');

  // just show the question slide
  loadSlide(slug, 'question');

});

$('body').on('click', '[data-action="set-cat"]', function() {

  var slug = $(this).attr('data-category');

  var reduced = _.without(db.get('esaAss.remainingCategories'), slug);

  db.set('esaAss.remainingCategories', reduced);

  getCatQuestions(slug);

});

// Fix back button
$(window).on('hashchange', function(e) {

  // If we've gone to a question fragment but we haven't
  // pressed a "pick a question" button to get there...
  if (window.location.hash.substr(0, 9) === '#question' && !window.realPick) {
    if (hashHistory.indexOf(window.location.hash > -1)) {
      loadSlide(window.location.hash.substr(1), 'question');
    }
  }

});
