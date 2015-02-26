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
//TODO: work with this function

    inference = sents["scales"][scale]["sent_inference"];
    question = sents["scales"][scale]["sent_question"];
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

// ############################## BP Changes Configuration settings ##############################
var sents = {
	//todo: make it so that manipulation comes from a manipulation choice from the function call
    scales: {
		training1: {
		    //sent_manipulation: null,
		    sent_inference: "I enjoy going sailing with my father.",
		    sent_question:  "he enjoys walking in the woods alone?"
		},	
	training2: {
		    //sent_manipulation: null,
		    sent_inference: "I don't like eating out at upscale places.",
		    sent_question:  "he despises fancy restaurants?"
		},	
		all_some: {		   
		    //sent_manipulation: null,
		    sent_inference: "Some of the SP V1 P1.",
		    sent_question:  "not all of the SP V1 P1?"
		},
		always_sometimes: {
		    //sent_manipulation: null,
		    sent_inference: "Sometimes the SP V1 P1.",
		    sent_question:  "the SP V1 not always P1?"
		},
		and_or: {
		    //sent_manipulation: null,
		    sent_inference: "The SS V2 P1 or P2.",
		    sent_question:  "the SS V2 not both P1 and P2?"
		},
		two_three: {
		    //sent_manipulation: null,
		    sent_inference: "Two of the SP V1 P1.",
		    sent_question:  "two but not three of the SP V1 P1?",
		},
		good_excellent: {
		    //sent_manipulation: null,
		    sent_inference: "The SS V2 good.",
		    sent_question:  "the SS V2 not excellent?",
		},
		like_love: {
		    //sent_manipulation: null,
		    sent_inference: "I liked the SS.",
		    sent_question:  "he did not love the SS?",
		}
    },
    domains: {
    	//if it says "speaker" then it is a sentence Charlie wrote as a filler that may or may not be good
	training1: {
	    sent_context_plural: "John and Bob were talking about sailing yesterday.",
	    sent_manipulation_high: "filler training1 high",
	    sent_manipulation_low: "filler training1 low",
	},
	training2: {
	    sent_context_plural: "John and Bob were talking about restaurants yesterday.",
	    sent_manipulation_high: "filler training2 high",
	    sent_manipulation_low: "filler training2 low",
	},
	movies: {
	    sent_context_plural: "Yesterday, John and Bob were talking about the movies at a local theater.",
	    sent_context_singular: "Yesterday, John and Bob were talking about a movie at the local theater.",
	    sent_manipulation_high: "Speaker has read all of the movie reviews.",
	    sent_manipulation_low: "Speaker doesn't know anything about these movies.",
	    SP: "movies",
	    SS: "movie",
	    P1: "funny",
	    P2: "sad",
	    V1: "were",
	    V2: "was"
	},
	cookies: {
	    sent_context_plural: "A few days ago, John and Bob were talking about cookies at a local bakery.",
	    sent_context_singular: "A few days ago, John and Bob were talking about a particular cookie at a local bakery.",
	   	sent_manipulation_high: "Speaker goes to the bakery every day.",
	    sent_manipulation_low:  "Speaker has never been to the bakery.",
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
	    sent_manipulation_high: "Speaker is a big football fan.",
	    sent_manipulation_low: "Speaker has never watched football before.",
	    SP: "players",
	    SS: "player",
	    P1: "skillful",
	    P2: "hardworking",
	    V1: "were",
	    V2: "was"
	},
	weather: {
	    sent_context_plural: "Bob and John were talking about the weather during a recent trip.",
	    sent_context_singular: "Bob and John were talking about the previous weekend.",
	    sent_manipulation_high: "Speaker is a weather expert.".
	    sent_manipulation_low: "Speaker does not pay much attention to the weather.",
	    SP: "weekends",
	    SS: "weekend",
	    P1: "sunny",
	    P2: "windy",
	    V1: "were",
	    V2: "was"
	},
	clothes: {
	    sent_context_plural: "Last month, Bob and John were talking about the selection of shirts at a local store.",
	    sent_context_singular: "Last month, Bob and John were talking about a shirt their friend wore to a party.",
	   	sent_manipulation_high: "Speaker works at the store.",
	    sent_manipulation_low: "Speaker has never been to the store.",
	    SP: "shirts",
	    SS: "shirt",
	    P1: "striped",
	    P2: "soft",
	    V1: "were",
	    V2: "was"
	},
	students: {
	    sent_context_plural: "A year ago, Bob and John were talking about the students in a class they taught.",
	    sent_context_singular: "A year ago, Bob and John were talking about a particular student they used to teach.",
	    sent_manipulation_high: "Speaker cares a lot about students.",
	    sent_manipulation_low: "Speaker does not care that much about students",
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
// console.log("sent_main" )
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
	//manipulation is randomly selected either high or low
	manipulation: [],
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
		experiment.data.judgment.push(radio[i].value);
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
			    String(100 * (1 - scales.length/totalTrials)) + "%")
	    
	    // Get the current trial - <code>shift()</code> removes the first element
	    // randomly select from our scales array,
	    // stop exp after we've exhausted all the domains
	    var scale = scales.shift();
	    var domain = domains.shift();

	    // if the current trial is undefined, call the end function.
	    if (typeof scale == "undefined") {
		return experiment.debriefing();
	    }
	    
	    // Generate the sentence stimuli
	    speaker = shuffle(speakers)[0]

	    //New: pick a manipulation "high" or "low"
	    manipulation = shuffle (manipulation_choices)[0]

	    //Sets sent_manipulation equal to the high or low manipulation
	    if (manipulation == "high") {
	    	sent_manipulation = sents["domains"][domain]["sent_manipulation_high"];
	    } else {
	    	sent_manipulation = sents["domains"][domain]["sent_manipulation_low"];
	    }

	    //If we have a singular scale adjust domains
	    if (scale == "and_or" || scale == "good_excellent" || scale == "like_love") {
	    	sent_context = sents["domains"][domain]["sent_context_singular"];
	    } else {
	    	sent_context = sents["domains"][domain]["sent_context_plural"];
	    }

	    sent_materials = doSentSubs(sents, scale, domain);	
	    
	    // Display the sentence stimuli
	    $("#sent_context").html(sent_context);
	    //adding in manipulation
	    $("#speaker").html(speaker)
	    $("#sent_manipulation").html(sent_manipulation);
	    $("#speaker").html("<i>" + speaker + " said:</i>")
	    $("#sent_inference").html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp\"" +
				      sent_materials[0] + "\"");
	    $("#sent_question").html("Would you conclude from this sentence that, according to " +
				     speaker + ", " +
				     sent_materials[1]);
	    
	    // push all relevant variables into data object	    
	    experiment.data.scale.push(scale);
	    experiment.data.domain.push(domain);
	    experiment.data.sent_context.push(sent_context);
	    experiment.data.sent_inference.push(sent_materials[0]);
	    experiment.data.sent_question.push(sent_materials[1]);
	    //TODO: push manipulation
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
	experiment.data.character_thoughts.push(document.getElementById("character_thoughts").value);
	experiment.data.expt_gen.push(document.getElementById("expcomments").value);
	experiment.end();
    }
}

