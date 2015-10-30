//############################## Helper functions #############################
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

var sents = {
    scale: {
		training1: {
		    //hi1:  "thought the food deserved a <b>very high</b> rating?",
		    hi2:  "thought the food deserved a <b>high</b> rating.",
		    low1:  "thought the food deserved a <b>low</b> rating.",
		    //low2:  "thought the food deserved a <b>very low</b> rating?"
		},
		liked_loved: {		   
		    hi1:  "<b>loved</b> the food.",
		    hi2:  "<b>liked</b> the food.",
		    low1:  "<b>disliked</b> the food.",
		    low2:  "<b>hated</b> the food.",
		},
		good_excellent: {
			hi1:  "thought the food was <b>excellent</b>.",
		    hi2:  "thought the food was <b>good</b>.",
		    low1:  "thought the food was <b>bad</b>.",
		    low2:  "thought the food was <b>terrible</b>."
		},
		palatable_delicious: {
			hi1:  "thought the food was <b>delicious</b>.",
		    hi2:  "thought the food was <b>palatable</b>.",
		    low1:  "thought the food was <b>gross</b>.",
		    low2:  "thought the food was <b>disgusting</b>."
		},
	memorable_unforgettable: {
			hi1:  "thought the food was <b>unforgettable</b>.",
		    hi2:  "thought the food was <b>memorable</b>.",
		    low1:  "thought the food was <b>bland</b>.",
		    low2:  "thought the food was <b>forgettable</b>."
		},
		some_all: {
			hi1: "enjoyed <b>all</b> of the food they ate.",
			hi2: "enjoyed <b>most</b> of the food they ate.",
			low1: "enjoyed <b>some</b> of the food they ate.",
			low2: "enjoyed <b>none</b> of the food they ate."
		}
    },
};

//Trial condition params initializations ------------------->
var TOTAL_TRIALS = 22;
var trials = [];
for(var i = TOTAL_TRIALS; i > 0; --i) {
	trials.push(i);
}
var scales = Object.keys(sents.scale);
var scale_degrees = ["hi1", "hi2", "low1", "low2"];
var totalTrials = scales.length; //One trial for each domain
//Trial condition params initializations ------------------->

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

//###:-----------------MAIN EVENT-------------------:###
var experiment = {
    //Data object for logging responses, etc
    data: {
		scale: [],
		degree: [],
		judgment: [],
		language: [],
		expt_aim: [],
		expt_gen: [],
		age: [],
		gender:[]
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

		var judgment = $(".rating-stars").attr("style");
		judgment = parseInt(judgment.replace(/[^\d.]/g, ''));
		//console.log("judgment: ", judgment); for debuggging
		if (judgment == 0) {
			//Else respondent didn't make a response
		    $("#testMessage").html('<font color="red">' + 
					   'Please make a response!' + 
					   '</font>');
		    judgment = $(".rating-stars").attr("style");
		    judgment = parseInt(judgment.replace(/[^\d.]/g, ''));
		} else {
			//Log judgment
			judgment /= 20;
			experiment.data.judgment.push(judgment);
			nextButton.blur();
			experiment.next();
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
				    String(100 * (1 - trials.length/TOTAL_TRIALS)) + "%");

		    //Trial params ---------------------------->
		    if(trials.length == TOTAL_TRIALS) {
		    	trials.shift();
		    	current_scale = scales[0];
		    	degree = "hi2";
		    } else if (trials.length == TOTAL_TRIALS - 1) {
		    	trials.shift();
		    	current_scale = scales[0];
		    	degree = "low1";
		    } else if (trials.length == TOTAL_TRIALS - 2) {
		    	trials = shuffle(trials); 
		    	current_trial = trials.shift();
		    	current_scale = scales[current_trial % 5 + 1];
		    	degree = scale_degrees[current_trial % 4];
		    } else {
		    	current_trial = trials.shift();
		    	current_scale = scales[current_trial % 5 + 1];
		    	degree = scale_degrees[current_trial % 4];
		    }
			sent_materials = sents.scale[current_scale][degree];
			//Trial params ---------------------------->


		    //###:-----------------Display trial-----------------:###
		    $("#sent_question").html("Someone said they "+
					     sent_materials);

		    $("#rating-stars").on("click", 
			    	function(event) {
						var selection = $("#rating-stars").val();
			});
		    //###:-----------------Display trial-----------------:###
		    
		    //###:-------------Log trial data (push to data object)-------------:###
		    experiment.data.scale.push(current_scale);
		    experiment.data.degree.push(degree);
		    //###:-------------Log trial data (push to data object)-------------:###
		    
		    showSlide("stage");

			//Clear stars
			$(".rating-stars").attr({"style":"width: 0%"});
		}
    },

    //Show debrief
    debriefing: function() {
		// showSlide("debriefing");

		showSlide("debriefing");
		// Get age
    	var select_age = '';
    	for (i = 18; i <= 100; i++) {
    		select_age += '<option val=' + i + '>' + i + '</option>';
    	}
    	$('#age').html(select_age);    	
    },

    //###:-------------Log debrief data-------------:###
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
    //###:-------------Log debrief data-------------:###
};
