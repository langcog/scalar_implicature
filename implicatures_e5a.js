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
		    hi:  "thought the restaurant deserved a high rating?",
		    low:  "thought the restaurant deserved a high rating?"
		},
		training2: {
		    hi:  "thought the restaurant deserved a low rating?",
		    low:  "thought the restaurant deserved a low rating?"
		},	
		liked_loved: {		   
		    hi:  "loved the restaurant?",
		    low:  "loved the restaurant?"
		},
		good_excellent: {
			hi:  "thought the restaurant was excellent?",
		    low:  "thought the restaurant was good?"
		},
		palatable_delicious: {
			hi:  "thought the restaurant was delicious?",
		    low:  "thought the restaurant was palatable?"
		},
		memorabe_unforgettable: {
			hi:  "thought the restaurant was unforgettable?",
		    low:  "thought the restaurant was memorable?"
		},
		some_all: {
			hi: "enjoyed all of the food",
			low: "enjoyed some of the food"
		}
    },
};

//###:::------Negative scalars to consider------:::###
//dislike_horrible
//adequate_good
//loathed_dislike
//###:::------Negative scalars to consider------:::###

//###:-----------------CONDITION PARAMETERS-------------------:###
var scales = Object.keys(sents.scale);
scales.shift();
scales.shift();
scales = shuffle(scales);
scales.unshift("training1", "training2");

var scale_degrees = ["hi", "low"];
var manipulation =  shuffle(["60", "80", "100"]);
//###:-----------------CONDITION PARAMETERS-------------------:###


var totalTrials = scales.length; //One trial for each domain
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
		//Allow experiment to start if it's a turk worker OR if it's a test run
		if (window.self == window.top || turk.workerId.length > 0) {
		    //Clear the test message and adjust progress bar
		    $("#testMessage").html('');  
		    $("#prog").attr("style","width:" +
				    String(100 * (1 - scales.length/totalTrials)) + "%");
		    
		    //Get current scale
		    var current_scale = scales.shift();
		    //If current scale is undefined we've reached end and send to debreif
		    if (typeof current_scale == "undefined") {
				return experiment.debriefing();
		    }
		    //else set rest of conditional params
		    var degree = shuffle(scale_degrees)[0];
		    //sent materials to aggregate and display
		    sent_materials = sents.scale[current_scale][degree];

		    //###:---------Manipulation code----------:###
		    manipulation_level = shuffle(manipulation)[0]; //Randomize manipulation
		    
		    //###:-----------------Display trial-----------------:###
			$(".rating-stars").attr("style","width: " +
							    manipulation_level + "%");
		    $("#sent_question").html("How natural is it so say that the person "+
					     sent_materials);
		    //###:-----------------Display trial-----------------:###

		    //###:-------------Log trial data (push to data object)-------------:###
		    experiment.data.scale.push(current_scale);
		    experiment.data.degree.push(degree);
		    experiment.data.manipulation_level.push(manipulation_level);
		    //###:-------------Log trial data (push to data object)-------------:###
		    
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
