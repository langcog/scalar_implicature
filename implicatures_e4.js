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

// substitution function - do we want to save all these factors to a data object?
//Pass a trial object in to be populated?
function doSentSubs (sents, scale, domain) {
	//TODO: work with this function

    inference = sents["scales"][scale]["sent_inference"];
    question = sents["scales"][scale]["sent_question"];
    //manipulation = sents["domains"][domain][manip];
    //manipulation = sents["scales"][scale]["sent_manipulation"];

    SP = sents["domains"][domain]["SP"]; //Plural
    SS = sents["domains"][domain]["SS"]; //Singular
    P1 = sents["domains"][domain]["P1"]; //Predicate 1
    P2 = sents["domains"][domain]["P2"]; //Predicate 2
    V1 = sents["domains"][domain]["V1"]; //Past
    V2 = sents["domains"][domain]["V2"]; //Present

    inference = inference.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);

    question = question.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);

	//TODO: return manipulation
    return [inference, question];
}

//Replace speaker name in manipulation
function doSpeakerSub(speaker, manip) {
	manip = manip.replace("SPEAKER", speaker);
	return manip;
}
//############################## Helper functions ##############################

var sents = {
    scales: {
		training1: {
		    sent_inference: "I enjoy going sailing with my father.",
		    sent_question:  "he enjoys walking in the woods alone?"
		},	
		training2: {
		    sent_inference: "I don't like eating out at upscale places.",
		    sent_question:  "he doesn't like eating at fancy restaurants?"
		},	
		all_some: {		   
		    sent_inference: "Some of the SP V1 P1.",
		    sent_question:  "not all of the SP V1 P1?"
		}
    },
    domains: {
		training1: {
		    sent_context_plural: "John and Bob were talking about sailing yesterday.",
		    sent_manipulation_high: "SPEAKER spends a lot of time with his family.",
		    sent_manipulation_low: "SPEAKER spends a lot of time with his family.",
		},
		training2: {
		    sent_context_plural: "John and Bob were talking about restaurants yesterday.",
		    sent_manipulation_high: "SPEAKER enjoys reading restaurant reviews.",
		    sent_manipulation_low: "SPEAKER enjoys reading restaurant reviews.",
		},
		movies: {
		    sent_context_plural: "Yesterday, John and Bob were talking about the movies at a local theater.",
		    sent_manipulation_high: "SPEAKER has seen every movie at the theater.",
		    sent_manipulation_low: "SPEAKER has only had the chance to see one of the movies showing at the theater.",
		    SP: "movies at the theater",
		    P1: "comedies",
		    V1: "are"
		},
		cookies: {
		    sent_context_plural: "A few days ago, John and Bob were talking about the current selection of cookies at a local bakery.",
		    sent_manipulation_high: "SPEAKER has been to the bakery and looked at the new cookies.",
		    sent_manipulation_low:  "SPEAKER ate one of the cookies but hasn't been to the bakery himself.",
		    SP: "cookies at the bakery",
		    P1: "chocolate",
		    V1: "are"
		},
		players: {
		    sent_context_plural: "Last week, John and Bob were talking about the high school football game.",
		    sent_manipulation_high: "SPEAKER watched the whole game carefully.",
		    sent_manipulation_low: "SPEAKER saw only a single play.",
		    SP: "players on the team",
		    P1: "skillful",
		    V1: "were"
		},
		weather: {
		    sent_context_plural: "Bob and John were talking about the weather during the previous month.",
		    sent_manipulation_high: "SPEAKER was around for the entire month.",
		    sent_manipulation_low: "SPEAKER was out of town most of the time.",
		    SP: "weekends in the month",
		    P1: "sunny",
		    V1: "were"
		},
		clothes: {
		    sent_context_plural: "Last month, Bob and John were talking about the selection of shirts at a local store.",
		    sent_manipulation_high: "SPEAKER has shopped at the store and looked at the shirt display.",
		    sent_manipulation_low: "SPEAKER got a shirt as a present, but hasn't been to the store himself.",
		    SP: "shirts at the store",
		    P1: "expensive",
		    V1: "are"
		},
		students: {
		    sent_context_plural: "A year ago, Bob and John were talking about the students in a class they taught.",
		    sent_manipulation_high: "SPEAKER has kept in touch with all of the students.",
		    sent_manipulation_low: "SPEAKER has only kept up with one of the students.",
		    SP: "students from the class",
		    P1: "successful",
		    V1: "have been"
		}
    }
}

//###:-----------------CONDITION PARAMETERS-------------------:###
var speakers = ["John","Bob"];
var domains = Object.keys(sents.domains);
domains.shift();
domains.shift();
domains = shuffle(domains);

//manipulations is new
var manipulation =  shuffle(["high", "low"]);

// now put the training trials up front and shuffle the rest of the trials.
var scales = ["training1","all_some","training2","all_some"];
var domains = ["training1", domains[0], "training2", domains[1]];
var manipulation_levels = ["training", manipulation[0], "training", manipulation[1]];

//###:-----------------CONDITION PARAMETERS-------------------:###
var totalTrials = domains.length; //One trial for each domain

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

//###:-----------------MAIN EVENT-------------------:###
var experiment = {

    //Data object for logging responses, etc
    data: {
		scale: [],
		domain: [],
		sent_context: [],
		manipulation_level: [],
		sent_manipulation: [],
		sent_inference: [],
		sent_question: [],
		speaker: [],
		judgment: [],
		language: [],
		expt_aim: [],
		character_thoughts: [],
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
		if (window.self == window.top | turk.workerId.length > 0) {

		    //Clear the test message and adjust progress bar
		    $("#testMessage").html('');  
		    $("#prog").attr("style","width:" +
				    String(100 * (1 - domains.length/totalTrials)) + "%");
		    
		    //#####:---Get the current trial parameters - scale, domain, speaker---:#####
		    var scale = scales.shift();
		    var domain = domains.shift();
		    speaker = shuffle(speakers)[0]; //Randomize speaker

		    // If the current trial domain is undefined, move to debrief
		    if (typeof domain == "undefined") {
				return experiment.debriefing();
		    }

		    //###:---------Manipulation code----------:###
		    manipulation_level = manipulation_levels.shift(); //Randomize manipulation
		    //Set manipulation sentence
		    if (manipulation_level == "high") {
		    	sent_manipulation = sents["domains"][domain]["sent_manipulation_high"];
		    } else {
		    	sent_manipulation = sents["domains"][domain]["sent_manipulation_low"];
		    }
		    //Replace speaker in manipulation
		    sent_manipulation = doSpeakerSub(speaker, sent_manipulation);

		    //###:---------Manipulation code----------:###
		    sent_context = sents["domains"][domain]["sent_context_plural"];


		    //Main substitition function (everything but manipulation)
		    sent_materials = doSentSubs(sents, scale, domain);	
		    
		    //###:-----------------Display trial-----------------:###
		    $("#sent_context").html(sent_context);
		    //adding in manipulation
		    $("#speaker").html(speaker);
		    $("#sent_manipulation").html(sent_manipulation);
		    $("#speaker").html("<b>" + speaker + " said:</b>");
		    $("#sent_inference").html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp\"" +
					      sent_materials[0] + "\"");
		    $("#sent_question").html("Would you conclude from this sentence that, according to " +
					     speaker + ", " +
					     sent_materials[1]);
		    console.log(sent_materials);
		    //###:-----------------Display trial-----------------:###
		    
		    //###:-------------Log trial data (push to data object)-------------:###
		    experiment.data.scale.push(scale);
		    experiment.data.domain.push(domain);
		    experiment.data.sent_context.push(sent_context);
		    experiment.data.sent_inference.push(sent_materials[0]);
		    experiment.data.sent_question.push(sent_materials[1]);
		    experiment.data.manipulation_level.push(manipulation_level);
		    experiment.data.sent_manipulation.push(sent_manipulation);
		    experiment.data.speaker.push(speaker); 
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
		experiment.data.character_thoughts.push(document.getElementById("character_thoughts").value);
		experiment.data.expt_gen.push(document.getElementById("expcomments").value);
		experiment.end();
    }
    //###:-------------Log debrief data-------------:###
};
