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
    sent = base_sent.replace("PERSON", name).replace("SETTING", c).replace("GEN", gender).replace("GEN", gender);
    return sent;
}

function get_context (name, pro) {
	return context[name][pro];
}

var base_sent = "<b>PERSON went out to a restaurant SETTING.</b> <br><br>Without knowing anything about the food GEN ate,<br>\
how many stars do you think GEN gave the restaurant?";

var context = {
	Bob: {
		c1: "with a friend",
		c2: "alone",
	        c3: "for a birthday party",
	        c4: "on a date",
	        c5: "with his co-workers",
	        c6: "with his parents",
		pro: "he"
	},
	John: {
		c1: "with a friend",
		c2: "alone",
	        c3: "for a birthday party",
	        c4: "on a date",
	        c5: "with his co-workers",
	        c6: "with his parents",
		pro: "he"
	},
	Chris: {
		c1: "with a friend",
		c2: "alone",
	        c3: "for a birthday party",
	        c4: "on a date",
	        c5: "with his co-workers",
	        c6: "with his parents",
		pro: "he"
	},
	Lisa: {
		c1: "with a friend",
		c2: "alone",
	        c3: "for a birthday party",
	        c4: "on a date",
	        c5: "with her co-workers",
	        c6: "with her parents",
		pro: "she"
	},
	Jenny: {
		c1: "with a friend",
		c2: "alone",
	        c3: "for a birthday party",
	        c4: "on a date",
	        c5: "with her co-workers",
	        c6: "with her parents",
		pro: "she"
	},
	Alice: {
		c1: "with a friend",
		c2: "alone",
	        c3: "for a birthday party",
	        c4: "on a date",
	        c5: "with her co-workers",
	        c6: "with her parents",
		pro: "she"
	}
};

//Basic trial data--------------------->
var names = Object.keys(context);
names = shuffle(names);
var settings = ["c1", "c2", "c3", "c4", "c5", "c6"];
settings = shuffle(settings);
var TOTAL_TRIALS = 6;
//Basic trial data--------------------->

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
		if (settings.length == 0) {
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
		        var cur_setting = settings.shift(); //current context
			var sent_materials = doSentSubs(base_sent, cur_name, cur_setting);
			//Trial params ---------------------------->

		    //Display trial---------------------------->
		    $("#sent_question").html(sent_materials);
		    //Vary ratings prompt by name gender
		    if (context[cur_name]["pro"] == "he") { 
		    	$("#rating_prompt").html("<i>Make your best guess:</i>");
		    } else {
		    	$("#rating_prompt").html("<i>Make your best guess:</i>");
		    }

		    $("#rating-stars").on("click", 
			    	function(event) {
						var selection = $("#rating-stars").val();
			});
		    //Display trial---------------------------->
		    
		    //Log trial data--------------------------->
		    experiment.data.name.push(cur_name);
		    experiment.data.context.push(get_context(cur_name, cur_setting));
		    //Log trial data--------------------------->
		    
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
