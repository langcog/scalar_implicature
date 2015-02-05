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
    D = sents["domains"][domain]["D"];
    S = sents["domains"][domain]["S"];
    P = sents["domains"][domain]["P"];
    A = sents["domains"][domain]["A"];
    V = sents["domains"][domain]["V"];

    sent = sent.replace("Q",Q).replace("D",D).replace("A",A).replace("P",P).replace("S",S).replace("V",V);

    return sent;
}

// ############################## Configuration settings ##############################
var sents = {
    scales: {
		all_some: {
		    Q: ["some","some but not all","all"],
		    base: "Q of the D V P."
		},
		always_sometimes: {
		    Q: ["sometimes","sometimes but not always","always"],
		    base: "the D V Q P."
		},
		and_or: {
		    Q: ["P or A","either P or A","P and A"],
		    base: "the S V Q."
		}
    },

    domains: {
		movies: {
		    D: "movies",
		    S: "movie",
		    P: "comedies",
		    A: "dramas",
		    V: "were"
		},
		cookies: {
		    D: "cookies",
		    S: "cookie",
		    P: "chocolate",
		    A: "oatmeal",
		    V: "were",	    
		},
		players: {
		    D: "players",
		    S: "player",
		    P: "scored points",
		    A: "fouled out",
		    V: "",
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
    
    // The work horse of the sequence - what to do on every trial.
    next: function() {
	/***************Record previous trial here*************/
	if (document.getElementsByName("judgment") != null) {
	    //experiment.data.push(document.getElementsByName("judgment").value);
	    var els = document.getElementsByName("judgment");
	    //Loop through radio buttons
	    for (i = 0; i < els.length; i++) {
		if (els[i].type == "radio") {
		    //If one is checked, record to data array
		    if (els[i].checked == true) {
			experiment.data.rating.push(els[i].value);
		    }
		    //Make sure all buttons are unchecked
		    els[i].checked = false;
		}
	    }
	}
	
	// Get the current trial - <code>shift()</code> removes the first element
	var scale = scales.shift();
	var domain = domains.shift();
	var order = orders.shift();
	
	// If the current trial is undefined, call the end function.
	if (typeof scale == "undefined") {
	    return experiment.end();
	}
	
	/***************Show next trial here*************/

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

