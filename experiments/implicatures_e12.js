// ################################################################################
// ######### Experiment 12 literal listener with 'neutral alternative' ############
// ################################################################################

// Helper fns()
// ------------
// Shows slides. We're using jQuery here - the **$** is the jQuery selector function, which takes as input either a DOM element or a CSS selector string.
function showSlide(id) {
	// Hide all slides
	$(".slide").hide();
	// Show just the slide we want to show
	$("#"+id).show();
}

// Get random integers.
// When called with no arguments, it returns either 0 or 1. When called with one argument, *a*, it returns a number in {*0, 1, ..., a-1*}. When called with two arguments, *a* and *b*, returns a random value in {*a*, *a + 1*, ... , *b*}.
function random(a,b) {
	if (typeof b == "undefined") {
		a = a || 2;
		return Math.floor(Math.random()*a);
	} else {
		return Math.floor(Math.random()*(b-a+1)) + a;
	}
}

// Add a random selection function to all arrays (e.g., <code>[4,8,7].random()</code> could return 4, 8, or 7). This is useful for condition randomization.
Array.prototype.random = function() {
  return this[random(this.length)];
}

// shuffle function - from stackoverflow?
// shuffle ordering of argument array -- are we missing a parenthesis?
function shuffle (a) { 
	var o = [];

	for (var i=0; i < a.length; i++) {
		o[i] = a[i];
	}

	for (var j, x, i = o.length;
	 i;
	 j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);	
	return o;
}


// Target scalar items
// -------------------
var sents = {
    scale: {
		training1: {
		    //hi1:  "thought the food deserved a <b>very high</b> rating?",
		    hi2:  "thought the food deserved a <b>high</b> rating?",
		    low1:  "thought the food deserved a <b>low</b> rating?"
		    //low2:  "thought the food deserved a <b>very low</b> rating?"
		},
		liked_loved: {		   
		    hi1:  "<b>loved</b> the food?",
		    hi2:  "<b>liked</b> the food?",
		    mid: "<b>felt indifferent about</b> the food",
		    low1:  "<b>disliked</b> the food?",
		    low2:  "<b>hated</b> the food?",
		},
		good_excellent: {
			hi1:  "thought the food was <b>excellent</b>?",
		    hi2:  "thought the food was <b>good</b>?",
		    mid:  "thought the food was <b>okay</b>?",
		    low1:  "thought the food was <b>bad</b>?",
		    low2:  "thought the food was <b>terrible</b>?"
		},
		palatable_delicious: {
			hi1:  "thought the food was <b>delicious</b>?",
		    hi2:  "thought the food was <b>palatable</b>?",
		    mid:  "thought the food was <b>mediocre</b>?",
		    low1:  "thought the food was <b>gross</b>?",
		    low2:  "thought the food was <b>disgusting</b>?"
		},
		memorable_unforgettable: {
			hi1:  "thought the food was <b>unforgettable</b>?",
		    hi2:  "thought the food was <b>memorable</b>?",
		    mid:  "thought the food was <b>ordinary</b>?",
		    low1:  "thought the food was <b>bland</b>?",
		    low2:  "thought the food was <b>forgettable</b>?"
		},
		some_all: {
			hi1: "enjoyed <b>all</b> of the food they ate?",
			hi2: "enjoyed <b>most</b> of the food they ate?",
			mid: "enjoyed <b>some</b> of the food they ate?",
			low1: "enjoyed <b>little</b> of the food they ate?",
			low2: "enjoyed <b>none</b> of the food they ate?"
		}
    },
};

// Trial Parameters
// ----------------
var NUM_DEGREES = 5
var NUM_SCALES = 5
var NUM_STARS = 5
var NUM_TRAINING_TRIALS = 2
// 5 scales * 5 rating levels * 5 manipulation levels + 2 training trials
var TOTAL_TRIALS = NUM_SCALES * NUM_STARS * NUM_DEGREES + NUM_TRAINING_TRIALS;

var scales = Object.keys(sents.scale);
var scale_degrees = ["hi1", "hi2", "mid","low1", "low2"];
var manipulation = ["20", "40", "60", "80", "100"];

var trials = [];
for(var i = TOTAL_TRIALS - 1; i >= 0; --i) trials.push(i);

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

// Run Experiment
// --------------
var experiment = {
    // Data object
    data: {
		scale: [],
		degree: [],
		manipulation_level: [],
		judgment: [],
		language: [],
		expt_aim: [],
		expt_gen: [],
		age: [],
		gender:[]
    },
    
    // End experiment
    end: function() {
		showSlide("finished");
		setTimeout(function() {
		    turk.submit(experiment.data)
		}, 1500);
    },

    // Log response
    log_response: function() {
		var response_logged = false;
		// Array of radio buttons
		var radio = document.getElementsByName("judgment");
		
		// Loop through radio buttons
		for (i = 0; i < radio.length; i++) {
		    if (radio[i].checked) {
				experiment.data.judgment.push(radio[i].value);
				response_logged = true;		    
		    }
		}
		
		if (response_logged) {
		    nextButton.blur();
		    
		    // Uncheck radio buttons
		    for (i = 0; i < radio.length; i++) {
				radio[i].checked = false
		    }
		    experiment.next(); // Move to next condition
		} else {
			// Else respondent didn't make a response
		    $("#testMessage").html('<font color="red">' + 
					   'Please make a response!' + 
					   '</font>');
		}
	},
    
    // Run every trial
    next: function() {
    	// If no trials are left go to debriefing
		if (!trials.length) {
			return experiment.debriefing();
		}
		
		// Allow experiment to start if it's a turk worker OR if it's a test run
		if (window.self == window.top || turk.workerId.length > 0) {
		    // Clear the test message and adjust progress bar
		    $("#testMessage").html('');  
		    $("#prog").attr("style","width:" +
				    String(100 * ((TOTAL_TRIALS - trials.length)/TOTAL_TRIALS)) + "%");
		    
		    // Check for training runs
		    if(trials.length > TOTAL_TRIALS - NUM_TRAINING_TRIALS) {
		    	// training #1: 'hi2' == "high" with 5 stars (expect 'Yes' resopnse)
		    	if (trials.length == TOTAL_TRIALS) {
			    	trials.shift();
			    	current_scale = scales[0];
			    	degree = "hi2";
			    	manipulation_level = "100";

			    } // training #2: 'low1' == "low" with 1 star (expect 'Yes' resopnse)
			    else {
			    	trials.shift();
			    	current_scale = scales[0];
			    	degree = "low1";
			    	manipulation_level = "20";
		    	} 
		    } else {
		    	if (trials.length == TOTAL_TRIALS - 2) { // TOTAL_TRIALS - 2 == 125
		    		trials = shuffle(trials); 
		    	}
		    	current_trial = trials.shift();
		   		current_scale_num = Math.floor(current_trial / 25)		// Get scale range (1 - 5)
		    	current_scale = scales[current_scale_num + 1];			// Set scale (i.e. liked_loved is trial nums 0 - 24)
		    	target_range = current_trial - (25 * current_scale_num) // Convert to 0 - 24 range for degree and manipulation level
		    	degree = scale_degrees[Math.floor(target_range / 5)]	// Set scalar degree (i.e. 0-4 is 'hi2', 5-10 is 'hi1')
		    	manipulation_level = manipulation[target_range % 5];	// Set star manipulation level
		    }
			sent_materials = sents.scale[current_scale][degree];

		    // Display trials to respondent
			$(".rating-stars").attr("style","width: " +
							    manipulation_level + "%");
		    $("#sent_question").html("Do you think the person "+
					     sent_materials);

		    // Run-time checks
		    console.log("--------------------------");
		    console.log("current_scale", current_scale);
		    console.log("degree", degree);
		    console.log("manipulation_level", manipulation_level);

		    // Log Data
		    experiment.data.scale.push(current_scale);
		    experiment.data.degree.push(degree);
		    experiment.data.manipulation_level.push(manipulation_level);
		    
		    showSlide("stage");
		}
    },

    // Show debrief
    debriefing: function() {
    	showSlide("debriefing");
		// Get age
    	var select_age = '';
    	for (i = 18; i <= 100; i++) {
    		select_age += '<option val=' + i + '>' + i + '</option>';
    	}
    	$('#age').html(select_age);    	
    },

    // Log data
    submit_comments: function() {
		experiment.data.language.push(document.getElementById("homelang").value);		// language
		experiment.data.expt_aim.push(document.getElementById("expthoughts").value);	// thoughts
		experiment.data.expt_gen.push(document.getElementById("expcomments").value);	// comments
		experiment.data.age.push(document.getElementById("age").value);					// age
		if (document.getElementById("Male").checked) {
    		experiment.data.gender.push(document.getElementById("Male").value);			// gender
    	} else {
    		experiment.data.gender.push(document.getElementById("Female").value);
    	}
		experiment.end();
    }
};
