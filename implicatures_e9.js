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
		    hi:  "<font color=\"blue\"><b>high</b></font>",
		    low:  "<font color=\"blue\"><b>low</b></font>",
		    before: " thought the food deserved a ",
		    after: " rating."
		},
		liked_loved: {		   
		    hi:  "<font color=\"blue\"><b>loved</b></font>",
		    low:  "<font color=\"blue\"><b>liked</b></font>",
		    before: " ",
		    after: " the food."
		},
		good_excellent: {
			hi:  "<font color=\"blue\"><b>excellent</b></font>",
		    low:  "<font color=\"blue\"><b>good</b></font>",
		    before: " thought the food was ",
		    after: "."
		},
		palatable_delicious: {
			hi:  "<font color=\"blue\"><b>delicious</b></font>",
		    low:  "<font color=\"blue\"><b>palatable</b></font>",
		    before: " thought the food was ",
		    after: "."
		},
		memorable_unforgettable: {
			hi:  "<font color=\"blue\"><b>unforgettable</b></font>",
		    low:  "<font color=\"blue\"><b>memorable</b></font>",
		    before: " thought the food was ",
		    after: "."
		},
		some_all: {
			hi: "<font color=\"blue\"><b>all</b></font>",
			low: "<font color=\"blue\"><b>some</b></font>",
			before: "enjoyed ",
		    after: " of the food they ate."
		}
    },
};

//Trial condition params initializations ------------------->
var TOTAL_TRIALS = 8;
var TRAINING_ROUNDS = 2;
var trials = [];
for(var i = 0; i < TOTAL_TRIALS; i++) {
	trials.push(i);
}
trials = shuffle(trials); 						// randomize trials
var scales = Object.keys(sents.scale);			// array of target scales
scales.shift(); 								// remove 'training1' trial from scales array
var scale_degrees = ["hi", "low"];


// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

//###:-----------------MAIN EVENT-------------------:###
var experiment = {
    //Data object for logging responses, etc
    data: {
		scale: [],
		degree: [],
		manipulation_level: [],
		alt1: [],
		alt2: [],
		alt3: [],
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

    reset_form: function() {
    	document.getElementById("alt1").value = "";
		document.getElementById("alt2").value = "";
		document.getElementById("alt3").value = "";	
    },

 	// returns True if entry in form
    check_response: function() {
    	var box_1 = document.getElementById("alt1");
    	var box_2 = document.getElementById("alt2");
    	var box_3 = document.getElementById("alt3");
		return(box_1.value != "" && box_2.value != "" && box_3.value != "");
    },

    //Log response
    log_response: function() {
		var response_logged = experiment.check_response();
		if (!experiment.check_response()) {
			$("#testMessage").html('<br><font color="red">' + 
					   'Please make all three responses!' + 
					   '</font>');
		} else {
			var alt1 = document.getElementById("alt1").value;
			var alt2 = document.getElementById("alt2").value;
			var alt3 = document.getElementById("alt3").value;			
			experiment.data.alt1.push(alt1);
			experiment.data.alt2.push(alt2);
			experiment.data.alt3.push(alt3);

			nextButton.blur();
			experiment.next();
		}
		return;
	},
    
    //Run every trial
    next: function() {
    	experiment.reset_form();
    	
    	// If no trials are left go to debriefing
		if (!trials.length) {
			return experiment.debriefing();
		}
		
		//Allow experiment to start if it's a turk worker OR if it's a test run
		if (window.self == window.top || turk.workerId.length > 0) {
		    //Clear the test message and adjust progress bar
		    $("#testMessage").html('');  
		    $("#prog").attr("style","width:" +
				    String(100 * ((TOTAL_TRIALS - trials.length)/TOTAL_TRIALS)) + "%");
		    

		    if (TRAINING_ROUNDS == 2) {
		     	current_scale = "training1";
		     	degree = "hi";
		     	TRAINING_ROUNDS--;
		    } else if (TRAINING_ROUNDS == 1) {
		    	current_scale = "training1";
		     	degree = "low";
		     	TRAINING_ROUNDS--;
		    } else {
			    current_trial = trials.shift();
			    current_scale = scales[Math.floor(current_trial / 2)];
			    degree = scale_degrees[current_trial % 2];	
		    }

		    // compile sentence material
			sent_materials = sents.scale[current_scale]["before"] + 
							 sents.scale[current_scale][degree] +
							 sents.scale[current_scale]["after"];
		    
		    // Display trial information
		    $("#sent_question").html("\"In a recent restaurant review someone said they "+
					     sent_materials + "\"");
		    $("#target_word").html("If they had <i>felt different</i> about the restaurant, what other words might they have used instead of " +
		    	sents.scale[current_scale][degree] + "?");
		    $("#before").html(sents.scale[current_scale]["before"]);

		    // Log Data
		    experiment.data.scale.push(current_scale);
		    experiment.data.degree.push(degree);
		    
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
