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


//sent_materials = doSentSubs(scale, type, degree);
// substitution function - do we want to save all these factors to a data object?
//Pass a trial object in to be populated?
// function doSentSubs (group_type, scale, degree) {
// 	//TODO: work with this function

//     //inference = sents["scales"][scale]["sent_inference"];
//     //question = sents["scales"][scale]["sent_question"];
//     //manipulation = sents["domains"][domain][manip];
//     //manipulation = sents["scales"][scale]["sent_manipulation"];

//     main_sent = sents["group_type"][group_type]["sent_question"];
//     target = sents["scale"][group_type][scale][degree];

//     // SP = sents["domains"][domain]["SP"]; //Plural
//     // SS = sents["domains"][domain]["SS"]; //Singular
//     // P1 = sents["domains"][domain]["P1"]; //Predicate 1
//     // P2 = sents["domains"][domain]["P2"]; //Predicate 2
//     // V1 = sents["domains"][domain]["V1"]; //Past
//     // V2 = sents["domains"][domain]["V2"]; //Present

//     //inference = inference.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);


//     //question = question.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);
//     main_sent = main_sent.replace("ADJ", target).replace("VP", target);

//     return main_sent;
// }

//Replace speaker name in manipulation
// function doSpeakerSub(speaker, manip) {
// 	manip = manip.replace("SPEAKER", speaker);
// 	return manip;
// }
//############################## Helper functions ##############################	

//3.24.25
//1. Change "scale" to "type"
//2. Change "domain" to "scale"
var sents = {
    scale: {
		training1: {
		    hi:  "thought the restaurant deserved a <b>high</b> rating.",
		    low:  "thought the restaurant deserved a <b>low</b> rating"
		},
		liked_loved: {		   
		    hi:  "<b>loved</b> the restaurant.",
		    low:  "<b>liked</b> the restaurant."
		},
		good_excellent: {
			hi:  "thought the restaurant was <b>excellent</b>.",
		    low:  "thought the restaurant was <b>good</b>."
		},
		palatable_delicious: {
			hi:  "thought the restaurant was <b>delicious</b>.",
		    low:  "thought the restaurant was <b>palatable</b>."
		},
		memorabe_unforgettable: {
			hi:  "thought the restaurant was <b>unforgettable</b>.",
		    low:  "thought the restaurant was <b>memorable</b>."
		},
		some_all: {
			hi: "enjoyed <b>all</b> of the food.",
			low: "enjoyed <b>some</b> of the food."
		}
    },
};

//Trial condition params initializations ------------------->
var TOTAL_TRIALS = 12;
var trials = [];
for(var i = TOTAL_TRIALS; i > 0; --i) {
	trials.push(i);
}
var scales = Object.keys(sents.scale);
var scale_degrees = ["hi", "low"];
//var totalTrials = trials.length;
//Trial condition params initializations ------------------->


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
		
		var judgment = $(".rating-stars").attr("style");
		judgment = parseInt(judgment.replace(/[^\d.]/g, ''));
		judgment /= 20;
		experiment.data.judgment.push(judgment);
		console.log(judgment);

		nextButton.blur();
		experiment.next();
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
				    String(100 * (1 - scales.length/totalTrials)) + "%");
		    

		    //Trial params ---------------------------->
		    if(trials.length == 12) {
		    	trials.shift();
		    	current_scale = scales[0];
		    	degree = "hi";
		    } else if (trials.length == 11) {
		    	trials.shift();
		    	current_scale = scales[0];
		    	degree = "low";
		    } else if (trials.length == 10) {
		    	trials = shuffle(trials); 
		    	current_trial = trials.shift();
		    	current_scale = scales[current_trial % 5 + 1];
		    	degree = scale_degrees[current_trial % 2];
		    } else {
		    	current_trial = trials.shift();
		    	current_scale = scales[current_trial % 5 + 1];
		    	degree = scale_degrees[current_trial % 2];
		    }
			sent_materials = sents.scale[current_scale][degree];
			//Trial params ---------------------------->


		    //###:-----------------Display trial-----------------:###
		    $("#sent_question").html("Someone said they "+
					     sent_materials);
		    $(".rating-stars").on("click", function(event) {
				$(".rating-stars").fadeOut(100).fadeIn(100);
				event.stopImmediatePropagation();
				$('.rating-stars').unbind();
				//Set attribute once clicked
				var selection = $(".rating-stars").attr("style");
				selection = Math.floor(parseInt(selection.replace(/[^\d.]/g, '')) / 10);
				console.log("selection", selection);
				$(".rating-stars").attr({"style":"width: " + selection.toString() + "%"});

				//document.getElementsByClassName("rating-stars").hoverEnabled = false;
			});
		    //###:-----------------Display trial-----------------:###
		    
		    //###:-------------Log trial data (push to data object)-------------:###
		    experiment.data.scale.push(current_scale);
		    experiment.data.degree.push(degree);
		    //experiment.data.manipulation_level.push(manipulation_level);
		    //###:-------------Log trial data (push to data object)-------------:###
		    
		    showSlide("stage");
			//Clear stars
			$(".rating-stars").attr({"style":"width: 0%"});
			//document.getElementsByClassName("rating-stars").hoverEnabled = true;
		}
    },

    //Show debrief
    debriefing: function() {
		showSlide("debriefing");
		//Remove first item (0) from judgments
		//experiment.data.judgment.shift();
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
