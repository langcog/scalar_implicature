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
		}
    },

    domains: {
		movies: {
		    SP: "movies",
		    SS: "movie",
		    P1: "comedies",
		    P2: "dramas",
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
		    P1: "scored points",
		    P2: "fouled out",
		    V1: "",
		    V2: ""
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
		    P1: "collars",
		    P2: "buttons",
		    V1: "had",
		    V2: "had"
		}
    }
};  

var contrasts = {
    lower: [0, 1],
    upper: [1, 2],
    full: [0, 2]
};

// make the trial order
var orders = shuffle([contrasts.lower, contrasts.upper, contrasts.full]).concat(
    shuffle([contrasts.lower, contrasts.upper, contrasts.full]));

for (i = 0; i < orders.length; i++) {
    orders[i] = shuffle(orders[i]);
}

// Parameters for this participant
var scales = shuffle(Object.keys(sents.scales));
var domains = shuffle(Object.keys(sents.domains));
var n_scales = scales.length;

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

// ############################## The main event ##############################
var experiment = {
    
    // The object to be submitted.
    data: {
		order: [],
		scale: [],
		domain: [],
		sent1: [],
		sent2: [],
		rating: [],
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
		$("#testMessage").html(''); 	// clear the test message
		
		// Get the current trial - <code>shift()</code> removes the first element
		//Randomly select from our scales array and stop exp after we've exhausted all the domains
		var scale = scales[random(0, n_scales)];
		console.log("scale", scale);
		var domain = domains.shift();
		var order = orders.shift();
		
		//If the current trial is undefined, call the end function.
		if (typeof domain == "undefined") {
		    return experiment.end();
		}
		
		// Show sentences
		sent1 = doSentSubs(sents, scale, domain, order[0])
		sent2 = doSentSubs(sents, scale, domain, order[1])
		
		// Display the sentence stimuli
		$("#sentence1").html(sent1);
		$("#sentence2").html(sent2);

		// push all relevant variables into data object
		experiment.data.order.push(order);
		experiment.data.scale.push(scale);
		experiment.data.domain.push(domain);
		experiment.data.sent1.push(sent1);
		experiment.data.sent2.push(sent2);

		showSlide("stage");
    }
}

