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
function doSentSubs (sents, scale, domain, order)
{
    sent = sents["scales"][scale]["base"];
    Q = sents["scales"][scale]["Q"][order];
    SP = sents["domains"][domain]["SP"]; //Plural
    SS = sents["domains"][domain]["SS"]; //Singular
    P1 = sents["domains"][domain]["P1"]; //Predicate 1
    P2 = sents["domains"][domain]["P2"]; //Predicate 2
    V1 = sents["domains"][domain]["V1"]; //Past
    V2 = sents["domains"][domain]["V2"]; //Present

    sent = sent.replace("Q",Q).replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);

    return sent;
}

// ############################## Configuration settings ##############################
var sents = {
    scales: {
	training1: {
	    Q: ["enjoy going sailing with my father","enjoy walking in the woods alone"],
	    base: "I really Q."
	},	
	training2: {
	    Q: ["despise fancy restaurants.","don't like eating out at upscale places."],
	    base: "I really Q."
	},	
	all_some: {
	    Q: ["Some","Some but not all","All"],
	    base: "Q of the SP V1 P1."
	},
	always_sometimes: {
	    Q: ["sometimes","sometimes but not always","always"],
	    base: "The SP V1 Q P1."
	},
	and_or: {
	    Q: ["P1 or P2","either P1 or P2","P1 and P2"],
	    base: "The SS V2 Q."
	},
	two_three: {
	    Q: ["Two","Two but not three","Three"],
	    base: "Q of the SP V1 P1."
	},
	good_excellent: {
	    Q: ["good","good but not excellent","excellent"],
	    base: "He thought the SS V2 Q."
	},
	like_love: {
	    Q: ["liked","liked but didn't love","loved"],
	    base: "She Q the SS."
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

var contrasts = {
    lower: [0, 1],
    upper: [1, 2],
    full: [0, 2]
};

// make the trial order
var orders = [[0, 1],[0, 1]].concat(
    shuffle([contrasts.lower, contrasts.upper, contrasts.full]).concat(
	shuffle([contrasts.lower, contrasts.upper, contrasts.full])));

for (i = 0; i < orders.length; i++) {
    orders[i] = shuffle(orders[i]);
}

var totalTrials = orders.length;

// Parameters for this participant
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

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

// ############################## The main event ##############################
var experiment = {
    
    // The object to be submitted.
    data: {
	order: [],
	comparison: [],
	scale: [],
	domain: [],
	sent1: [],
	sent2: [],
	rating: [],
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
	    
	    $("#testMessage").html(''); 	// clear the test message
	    $("#prog").attr("style","width:" +
			    String(100 * (1 - orders.length/totalTrials)) + "%")
// style="width:progressTotal%"
	    
	    // Get the current trial - <code>shift()</code> removes the first element
	    //Randomly select from our scales array and stop exp after we've exhausted all the domains
	    var scale = scales.shift();
	    var domain = domains.shift();
	    var order = orders.shift();
	    
	    //If the current trial is undefined, call the end function.
	    if (typeof scale == "undefined") {
		return experiment.debriefing();
	    }
	    
	    // Show sentences
	    sent1 = doSentSubs(sents, scale, domain, order[0])
	    sent2 = doSentSubs(sents, scale, domain, order[1])
	    
	    // Display the sentence stimuli
	    $("#sentence1").html(sent1);
	    $("#sentence2").html(sent2);
	    
	    // create comparison
	    var comparison = "";
	    
	    if ((order[0]==0 & order[1] == 1) | (order[0]==1 & order[1]==0)) {
		if (scale.match("training")) {
		    comparison = "training";
		} else {	
		    comparison = "lower";
		}
	    } else if ((order[0]==1 & order[1] == 2) | (order[0]==2 & order[1]==1)) {
		comparison = "upper";
	    } else {
		comparison = "full";
	    }
	    
	    // push all relevant variables into data object	    
	    experiment.data.order.push(order);
	    experiment.data.comparison.push(comparison);
	    experiment.data.scale.push(scale);
	    experiment.data.domain.push(domain);
	    experiment.data.sent1.push(sent1);
	    experiment.data.sent2.push(sent2);
	    
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

