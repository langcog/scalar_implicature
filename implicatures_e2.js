// ############################## Helper functions ##############################

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
function shuffle (a) 
{ 
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
function doSentSubs (sents, scale, domain)
{
    inference = sents["scales"][scale]["sent_inference"];
    context = sents["scales"][scale]["sent_question"];
    //Q = sents["scales"][scale]["Q"][order];
    SP = sents["domains"][domain]["SP"]; //Plural
    SS = sents["domains"][domain]["SS"]; //Singular
    P1 = sents["domains"][domain]["P1"]; //Predicate 1
    P2 = sents["domains"][domain]["P2"]; //Predicate 2
    V1 = sents["domains"][domain]["V1"]; //Past
    V2 = sents["domains"][domain]["V2"]; //Present

    inference = sent.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);
    context = sent.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);

    return [inference, context];
}

// ############################## BP Changes Configuration settings ##############################
var sents = {
    scales: {
		training1: {
		    sent_context: "A and B were talking about sailing, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'I enjoy going sailing with my father.'",
		    sent_question:  "Would you conclude from this that, according to
		    A, he enjoys waling in the woords alone?"
		},	
		training2: {
			sent_context: "A and B were talking about restaurants, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'I don't like eating out at upscale places.'",
		    sent_question:  "Would you conclude from this that, according to
		    A, he despises fancy restaurants?"
		},	
		all_some: {
		    sent_context: "A and B were talking about SP, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'some of the SP V1 P1'",
		    sent_question:  "Would you conclude from this that, according to
		    A, not all of the SP V1 P1?"
		},
		always_sometimes: {
			sent_context: "A and B were talking about SP, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'sometimes the SP V1 P1'",
		    sent_question:  "Would you conclude from this that, according to
		    A, the SP V1 not always P1?"
		},
		and_or: {
			sent_context: "A and B were talking about SP, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'the SS V2 P1 or P2'",
		    sent_question:  "Would you conclude from this that, according to
		    A, the SS V2 not both P1 and p2?"
		},
		two_three: {
			sent_context: "A and B were talking about SP, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'two of the SS V1 P1'",
		    sent_question:  "Would you conclude from this that, according to
		    A, two but not three of the SP V1 P1?",
		},
		good_excellent: {
		    sent_context: "A and B were talking about SS, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'The SS V2 good'",
		    sent_question:  "Would you conclude from this that, according to
		    A, the SS V2 not excellent?",
		},
		like_love: {
		    sent_context: "A and B were talking about a SS, yesterday",
		    sent_manipulation: NULL,
		    sent_inference: "A said, 'I liked the SS'",
		    sent_question:  "Would you conclude from this that, according to
		    A, he did not love the SS?",
		}
    },
    domains: {
		training1: {	    
		},
		training2: {	    
		},
		movies: {
		    SP: "movies",
		    SS: "movie",
		    P1: "funny",
		    P2: "sad",
		    V1: "were",
		    V2: "was"
		},
		cookies: {
		    SP: "cookies",
		    SS: "cookie",
		    P1: "chocolate",
		    P2: "oatmeal",
		    V1: "were",	    
		    V2: "was"
		},
		players: {
		    SP: "players",
		    SS: "player",
		    P1: "skillful",
		    P2: "hardworking",
		    V1: "were",
		    V2: "was"
		},
		weather: {
		    SP: "weekends",
		    SS: "weekend",
		    P1: "sunny",
		    P2: "windy",
		    V1: "were",
		    V2: "was"
		},
		clothes: {
		    SP: "shirts",
		    SS: "shirt",
		    P1: "striped",
		    P2: "soft",
		    V1: "were",
		    V2: "was"
		},
		students: {
		    SP: "students",
		    SS: "student",
		    P1: "tired",
		    P2: "hungry",
		    V1: "were",
		    V2: "was"
		}
    }
};  


// Parameters for this participant
var speakers = ["John","Mary"];
var scales = Object.keys(sents.scales);
var domains = Object.keys(sents.domains);

// remove the first two elements - the training trials
scales.shift();
scales.shift();
domains.shift();
domains.shift();

// now put the training trials up front and shuffle the rest of the trials.
scales = ["training1","training2"].concat(shuffle(scales));
domains = ["training1","training2"].concat(shuffle(domains));

var totalTrials = scales.length;

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

// ############################## The main event ##############################
var experiment = {
    
    // The object to be submitted.
    data: {
	scale: [],
	domain: [],
	sent_context: [],
	sent_inference: [],
	sent_question: [],
	speaker: [],
	judgment: [],
	language: [],
	expt_aim: [],
	expt_gen: [],
    },
    
    // end the experiment
    end: function() {
	showSlide("finished");
	setTimeout(function() {
	    turk.submit(experiment.data)
	}, 1500);
    },

    // LOG RESPONSE
    log_response: function() {
	var response_logged = false;
	
	//Array of radio buttons
	var radio = document.getElementsByName("judgment");
	
	// Loop through radio buttons
	for (i = 0; i < radio.length; i++) {
	    if (radio[i].checked) {
		experiment.data.rating.push(radio[i].value);
		response_logged = true;		    
	    }
	}
	
	
	if (response_logged) {
	    nextButton.blur();
	    
	    // uncheck radio buttons
	    for (i = 0; i < radio.length; i++) {
		radio[i].checked = false
	    }
	    experiment.next();
	} else {
	    $("#testMessage").html('<font color="red">' + 
				   'Please make a response!' + 
				   '</font>');
	}
    },
    
    // The work horse of the sequence - what to do on every trial.
    next: function() {
	// Allow experiment to start if it's a turk worker OR if it's a test run
	if (window.self == window.top | turk.workerId.length > 0) {

	    // clear the test message and adjust progress bar
	    $("#testMessage").html('');  
	    $("#prog").attr("style","width:" +
			    String(100 * (1 - orders.length/totalTrials)) + "%")
	    
	    // Get the current trial - <code>shift()</code> removes the first element
	    // randomly select from our scales array,
	    // stop exp after we've exhausted all the domains
	    var scale = scales.shift();
	    var domain = domains.shift();
	    
	    // if the current trial is undefined, call the end function.
	    typeof scale == "undefined" ? experiment.debriefing() : true
	    
	    // Generate the sentence stimuli
	    speaker = shuffle(speakers)[0]
	    sent_context = sents["scales"][scale]["context"];
	    sent_inference = doSentSubs(sents, scale, domain);
	    sent_question = doSentSubs(sents, scale, domain);
	    
	    // Display the sentence stimuli
	    $("#sent_context").html(sent_context);
	    $("#sent_inference").html(sent_inference);
	    $("#sent_question").html(sent_question);
	    $("#speaker").html(speaker)
	    
	    // push all relevant variables into data object	    
	    experiment.data.scale.push(scale);
	    experiment.data.domain.push(domain);
	    experiment.data.sent_context.push(sent_context);
	    experiment.data.sent_inference.push(sent_inference);
	    experiment.data.sent_question.push(sent_question);
	    experiment.data.speaker.push(speaker); 
	    
	    showSlide("stage");
	}
    },

    //	go to debriefing slide
    debriefing: function() {
	showSlide("debriefing");
    },

    // submitcomments function
    submit_comments: function() {
	experiment.data.language.push(document.getElementById("homelang").value);
	experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
	experiment.data.expt_gen.push(document.getElementById("expcomments").value);
	experiment.end();
    }
}

