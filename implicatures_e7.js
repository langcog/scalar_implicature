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

// substitution function - do we want to save all these factors to a data object?
//Pass a trial object in to be populated?
function doSentSubs (base_sent, x, y)
{
    var name = x;
    var c = context[x][y];
    var gender = context[x]["pro"];
    /*SP = sents["domains"][domain]["SP"]; //Plural
    SS = sents["domains"][domain]["SS"]; //Singular
    P1 = sents["domains"][domain]["P1"]; //Predicate 1
    P2 = sents["domains"][domain]["P2"]; //Predicate 2
    V1 = sents["domains"][domain]["V1"]; //Past
    V2 = sents["domains"][domain]["V2"]; //Present*/
    sent = base_sent.replace("PERSON", name).replace("SETTING", c).replace("GEN", gender);
    //sent = sent.replace("Q",Q).replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);
    return sent;
}

function get_context (name, pro) {
	return context[name][pro];
}

var base_sent = "PERSON went out to a restaurant SETTING. Without knowing anything about the food, \
how many stars do you think GEN gave?";

var context = {
	Bob: {
		c1: "with his friend",
		c2: "alone",
		c3: "for a birthday",
		pro: "he"
	},
	John: {
		c1: "with his friend",
		c2: "alone",
		c3: "for a birthday",
		pro: "he"
	},
	Chris: {
		c1: "with his friend",
		c2: "alone",
		c3: "for a birthday",
		pro: "he"
	},
	Lisa: {
		c1: "with her friend",
		c2: "alone",
		c3: "for a birthday",
		pro: "she"
	},
	Jenny: {
		c1: "with her friend",
		c2: "alone",
		c3: "for a birthday",
		pro: "she"
	},
	Alice: {
		c1: "with her friend",
		c2: "alone",
		c3: "for a birthday",
		pro: "she"
	}
};

var names = Object.keys(context);
names = shuffle(names);
var settings = ["c1", "c2", "c3"];
/*
var sents = {
    scale: {
		training1: {
		    hi:  "thought the food deserved a <b>high</b> rating.",
		    low:  "thought the food deserved a <b>low</b> rating"
		},
		liked_loved: {		   
		    hi:  "<b>loved</b> the food.",
		    low:  "<b>liked</b> the food."
		},
		good_excellent: {
			hi:  "thought the food was <b>excellent</b>.",
		    low:  "thought the food was <b>good</b>."
		},
		palatable_delicious: {
			hi:  "thought the food was <b>delicious</b>.",
		    low:  "thought the food was <b>palatable</b>."
		},
		memorable_unforgettable: {
			hi:  "thought the food was <b>unforgettable</b>.",
		    low:  "thought the food was <b>memorable</b>."
		},
		some_all: {
			hi: "enjoyed <b>all</b> of the food.",
			low: "enjoyed <b>some</b> of the food."
		}
    },
};
*/
var TOTAL_TRIALS = 6;
/*Trial condition params initializations ------------------->

var trials = [];
for(var i = TOTAL_TRIALS; i > 0; --i) {
	trials.push(i);
}
var scales = Object.keys(sents.scale);
var scale_degrees = ["hi", "low"];
var totalTrials = scales.length; //One  for each domain
//Trial condition params initializations ------------------->*/

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

//###:-----------------MAIN EVENT-------------------:###
var experiment = {
    //Data object for logging responses, etc
    data: {
		name: [],
		context: [],
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
		if (!names.length) {
			return experiment.debriefing();
		}

		//Allow experiment to start if it's a turk worker OR if it's a test run
		if (window.self == window.top || turk.workerId.length > 0) {

		    //Clear the test message and adjust progress bar
		    $("#testMessage").html('');  
		    $("#prog").attr("style","width:" +
				    String(100 * (1 - names.length/TOTAL_TRIALS)) + "%");

		    //Trial params ---------------------------->
			var cur_name = names.shift(); //current name
			var num = random(3);
			var cur_setting = settings[num]; //current context
			console.log("here!!1");
			console.log("cur_name: ", cur_name);
			console.log("cur_setting: ", cur_setting);

			var sent_materials = doSentSubs(base_sent, cur_name, cur_setting);
			console.log(sent_materials);
			//Trial params ---------------------------->


		    //###:-----------------Display trial-----------------:###
		    $("#sent_question").html(sent_materials);
		    if (context[cur_name]["pro"] == "he") {
		    	$("#rating_prompt").html("<i>Please select the number of stars you think he gave:</i>");
		    } else {
		    	$("#rating_prompt").html("<i>Please select the number of stars you think she gave:</i>");
		    }

		    $("#rating-stars").on("click", 
			    	function(event) {
						var selection = $("#rating-stars").val();
			});
		    //###:-----------------Display trial-----------------:###
		    
		    //###:-------------Log trial data (push to data object)-------------:###
		    experiment.data.name.push(cur_name);
		    experiment.data.context.push(get_context(cur_name, cur_setting));
		    //###:-------------Log trial data (push to data object)-------------:###
		    showSlide("stage");

			//Clear stars
			$(".rating-stars").attr({"style":"width: 0%"});
			//$("#rating_prompt").html("Please select the number of stars you think PRO gave:");
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
