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

// shuffle function
function shuffle (a) 
{ 
    var o = [];
    for ( var i=0; i < a.length; i++) { o[i] = a[i]; }
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), 
	 x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


// substitution function
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

var contrastOrder = shuffle([contrasts.lower, contrasts.upper, contrasts.full]).concat(
    shuffle([contrasts.lower, contrasts.upper, contrasts.full]));

for (i = 0; i < contrastOrder.length; i++) {
    contrastOrder[i] = shuffle(contrastOrder[i]);
}

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");


// ############################## The main event ##############################

var experiment = {
    
    // Parameters for this sequence.
    scales: shuffle(Object.keys(sents.scales)),
    domains: shuffle(Object.keys(sents.domains)),
    orders: contrastOrder,
    
    // An array to store the data that we're collecting.
    data: [],
    
    end: function() {
	showSlide("finished");
	setTimeout(function() { turk.submit(experiment) }, 1500);
    },
    
    // The work horse of the sequence - what to do on every trial.
    next: function() {
	
	if (document.getElementsByName("judgment") != null) {
	    experiment.data.push(document.getElementsByName("judgment").value);
	  //$("[name='judgment']").checked = false;
	var els = document.getElementsByName("judgment")
	for (i = 0; i < els.length; i++) {
    	  if (els[i].type == "radio") {
            els[i].checked = false;
    	  }
	}
           
	}
	
	// Get the current trial - <code>shift()</code> removes the first element
	var scale = experiment.scales.shift();
	var domain = experiment.domains.shift();
	var order = experiment.orders.shift();
	
	// If the current trial is undefined, call the end function.
	if (typeof scale == "undefined") {
	    return experiment.end();
	}
    
	showSlide("stage");

	// Construct the sentences
	sent1 = doSentSubs(sents, scale, domain, order[0])
	sent2 = doSentSubs(sents, scale, domain, order[1])
	
	// Display the sentence stimuli
	$("#sentence1").html(sent1);
	$("#sentence2").html(sent2);
    
	// Get the current time so we can compute reaction time later.
	// var startTime = (new Date()).getTime();
        
        // Wait 500 milliseconds before starting the next trial.
        // setTimeout(experiment.next, 500);
  
    }
}
