//############################## Helper functions ##############################
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
//############################## Helper functions ##############################	

var sents = {
    scale: {
		training1: {
			//because training trial hi and low are the same
		    hi:  "thought the food deserved a <b>high</b> rating?",
		    low:  "thought the food deserved a <b>low</b> rating?"
		},
		liked_loved: {		   
		    hi:  "<b>loved</b> the food?",
		    low:  "<b>liked</b> the food?"
		},
		good_excellent: {
			hi:  "thought the food was <b>excellent</b>?",
		    low:  "thought the food was <b>good</b>?"
		},
		palatable_delicious: {
			hi:  "thought the food was <b>delicious</b>?",
		    low:  "thought the food was <b>palatable</b>?"
		},
	memorable_unforgettable: {
			hi:  "thought the food was <b>unforgettable</b>?",
		    low:  "thought the food was <b>memorable</b>?"
		},
		some_all: {
			hi: "enjoyed <b>all</b> of the food they ate?",
			low: "enjoyed <b>some</b> of the food they ate?"
		}
    },
};
//###:::------Negative scalars to consider------:::###
//dislike_horrible
//adequate_good
//loathed_dislike
//###:::------Negative scalars to consider------:::###

//Trial condition params initializations ------------------->
var TOTAL_TRIALS = 52;
var trials = [];
for(var i = TOTAL_TRIALS; i > 0; --i) {
	trials.push(i);
}
var scales = Object.keys(sents.scale);
var scale_degrees = ["hi", "low"];
var manipulation = ["20", "40", "60", "80", "100"];
//var totalTrials = trials.length;
//Trial condition params initializations ------------------->



// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

//###:-----------------MAIN EVENT-------------------:###
var experiment = {
    //Data object for logging responses, etc
    data: {
		scale: [],
		degree: [],
		manipulation_level: [],
		judgment: [],
		language: [],
		expt_aim: [],
		expt_gen: [],
    },
    
    //End the experiment
    end: function() {
		showSlide("finished");
		setTimeout(function() {
		    turk.submit(experiment.data)
		}, 1500);
    },

    //Log response
    log_response: function() {
		var response_logged = false;
		//Array of radio buttons
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
		    
		    //Uncheck radio buttons
		    for (i = 0; i < radio.length; i++) {
				radio[i].checked = false
		    }
		    experiment.next(); //Move to next condition
		} else {
			//Else respondent didn't make a response
		    $("#testMessage").html('<font color="red">' + 
					   'Please make a response!' + 
					   '</font>');
		}
	},
    
    //Run every trial
    next: function() {
    	//If no trials are left go to debreifing
		if (!trials.length) {
			return experiment.debriefing();
		}
		
		//Allow experiment to start if it's a turk worker OR if it's a test run
		if (window.self == window.top || turk.workerId.length > 0) {
		    //Clear the test message and adjust progress bar
		    $("#testMessage").html('');  
		    $("#prog").attr("style","width:" +
				    String(100 * ((TOTAL_TRIALS - trials.length)/TOTAL_TRIALS)) + "%");
		    
		    //Trial params ---------------------------->
		    if(trials.length == 52) {
		    	trials.shift();
		    	current_scale = scales[0];
		    	degree = "hi";
		    	manipulation_level = "100";
		    } else if (trials.length == 51) {
		    	trials.shift();
		    	current_scale = scales[0];
		    	degree = "low";
		    	manipulation_level = "80";
		    } else if (trials.length == 50) {
		    	trials = shuffle(trials); 
		    	current_trial = trials.shift();
		    	current_scale = scales[(Math.floor(current_trial / 10)) % 5 + 1];
		    	degree = scale_degrees[current_trial % 2];
		    	manipulation_level = manipulation[current_trial % 5];
		    } else {
		    	current_trial = trials.shift();
		    	current_scale = scales[(Math.floor(current_trial / 10)) % 5 + 1];
		    	degree = scale_degrees[current_trial % 2];
		    	manipulation_level = manipulation[current_trial % 5];
		    }
			sent_materials = sents.scale[current_scale][degree];
		    //Trial params ---------------------------->


		    //Display Trials -------------------------->
			$(".rating-stars").attr("style","width: " +
							    manipulation_level + "%");
		    $("#sent_question").html("How much would you agree that the person "+
					     sent_materials);
		    //Display Trials -------------------------->

		    //Log Data -------------------------------->
		    experiment.data.scale.push(current_scale);
		    experiment.data.degree.push(degree);
		    experiment.data.manipulation_level.push(manipulation_level);
		    //Log Data -------------------------------->
		    
		    showSlide("stage");
		}
    },

    //Show debrief
    debriefing: function() {
		showSlide("debriefing");
    },

    //###:-------------Log debrief data-------------:###
    submit_comments: function() {
		experiment.data.language.push(document.getElementById("homelang").value);
		experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
		experiment.data.expt_gen.push(document.getElementById("expcomments").value);
		experiment.end();
    }
    //###:-------------Log debrief data-------------:###
};
