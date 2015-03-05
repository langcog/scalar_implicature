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
		    sent_question:  "he despises fancy restaurants?"
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
		    sent_context_singular: "Yesterday, John and Bob were talking about a movie at the local theater.",
		    sent_manipulation_high: "SPEAKER has seen every movie at the theater",
		    sent_manipulation_low: "SPEAKER has not had a chance to see the movies at the theater.",
		    SP: "movies",
		    SS: "movie",
		    P1: "funny",
		    P2: "sad",
		    V1: "were",
		    V2: "was"
		},
		cookies: {
		    sent_context_plural: "A few days ago, John and Bob were talking about cookies at a local bakery.",
		    sent_context_singular: "A few days ago, John and Bob were talking about a particular kind of cookie at a local bakery.",
		    sent_manipulation_high: "SPEAKER is the baker and knows which cookies were baked.",
		    sent_manipulation_low:  "SPEAKER has never paid attention to the desserts at the bakery.",
		    SP: "cookies",
		    SS: "cookie",
		    P1: "chocolate",
		    P2: "oatmeal",
		    V1: "were",	    
		    V2: "was"
		},
		players: {
		    sent_context_plural: "Last week, John and Bob were talking about the football game.",
		    sent_context_singular: "Last week, John and Bob were talking about a player in a recent football game.",
		     //this one was tricky I was trying to convey that the speaker knows about the set of players and the significance of skillful/hardworking
		    sent_manipulation_high: "SPEAKER is a coach who is attending the game to scout all of the players.",
		    sent_manipulation_low: "SPEAKER does not know how football is played.",
		    SP: "players",
		    SS: "player",
		    P1: "skillful",
		    P2: "hardworking",
		    V1: "were",
		    V2: "was"
		},
		weather: {
		    sent_context_plural: "Bob and John were talking about the weather during the previous month.",
		    sent_context_singular: "Bob and John were talking about the weather during the previous weekend.",
		    sent_manipulation_high: "SPEAKER watches the weather channel every day.",
		    sent_manipulation_low: "SPEAKER has not been paying attention to the weather recently.",
		    SP: "weekends",
		    SS: "weekend",
		    P1: "sunny",
		    P2: "windy",
		    V1: "were",
		    V2: "was"
		},
		clothes: {
		    sent_context_plural: "Last month, Bob and John were talking about the selection of shirts at a local store.",
		    sent_context_singular: "Last month, Bob and John were talking about a shirt at a local store.",
		    sent_manipulation_high: "SPEAKER is an avid shopper who knows the full selection of shirts at the store.",
		    sent_manipulation_low: "SPEAKER has not had a chance to look at the shirt selection.",
		    SP: "shirts",
		    SS: "shirt",
		    P1: "striped",
		    P2: "soft",
		    V1: "were",
		    V2: "was"
		},
		students: {
		    sent_context_plural: "A year ago, Bob and John were talking about the students in a class they taught.",
		    sent_context_singular: "A year ago, Bob and John were talking about a  student in a class they taught.",
		    sent_manipulation_high: "SPEAKER cares about his students and keeps in touch with them.",
		    sent_manipulation_low: "SPEAKER does not care that much about his students and doesn't get to know them.",
		    SP: "students",
		    SS: "student",
		    P1: "tired",
		    P2: "hungry",
		    V1: "were",
		    V2: "was"
		}
    }
}

//###:-----------------CONDITION PARAMETERS-------------------:###
var speakers = ["John","Bob"];
//manipulations is new
var manipulation_choices = ["high", "low"];
var scales = Object.keys(sents.scales);
var domains = Object.keys(sents.domains);

// remove the first two elements - the training trials
scales.shift();
scales.shift();
domains.shift();
domains.shift();

// now put the training trials up front and shuffle the rest of the trials.
scales = ["training1","training2"].concat(scales);

//Debug
console.log("scales line 210: ", scales);
//Debug
domains = ["training1","training2"].concat(shuffle(domains));
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
		    //Setting scale var:
		    //First two conditions are training, the remainder are <all,some>
		    numTrials = experiment.data.scale.length; //Tracks trial number
		    if (numTrials < 2) { scale = scales[numTrials]; } //Training
		    else { scale = scales[2]; } //<all,some>

		    var domain = domains.shift();
		    speaker = shuffle(speakers)[0]; //Randomize speaker

		    // If the current trial domain is undefined, move to debrief
		    if (typeof domain == "undefined") {
				return experiment.debriefing();
		    }

		    //###:---------Manipulation code----------:###
		    manipulation_level = shuffle(manipulation_choices)[0]; //Randomize manipulation
		    //Set manipulation sentence
		    if (manipulation_level == "high") {
		    	sent_manipulation = sents["domains"][domain]["sent_manipulation_high"];
		    } else {
		    	sent_manipulation = sents["domains"][domain]["sent_manipulation_low"];
		    }
		    //Replace speaker in manipulation
		    sent_manipulation = doSpeakerSub(speaker, sent_manipulation);
		    //###:---------Manipulation code----------:###

		    //Adjust scales based on number (sing vs plural)
		    //Keeping this for now in case we do something with number
		    if (scale == "and_or" || scale == "good_excellent" || scale == "like_love") {
		    	sent_context = sents["domains"][domain]["sent_context_singular"];
		    } else {
		    	sent_context = sents["domains"][domain]["sent_context_plural"];
		    }

		    //Main substitition function (everything but manipulation)
		    sent_materials = doSentSubs(sents, scale, domain);	
		    
		    //###:-----------------Display trial-----------------:###
		    $("#sent_context").html(sent_context);
		    //adding in manipulation
		    $("#speaker").html(speaker);
		    $("#sent_manipulation").html(sent_manipulation);
		    $("#speaker").html("<i>" + speaker + " said:</i>");
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
