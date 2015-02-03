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

// ############################## Configuration settings ##############################
// var allKeyBindings = [
//       {"p": "odd", "q": "even"},
//       {"p": "even", "q": "odd"} ],
//     allTrialOrders = [
//       [1,3,2,5,4,9,8,7,6],
//       [8,4,3,7,5,6,2,1,9] ],
//     myKeyBindings = allKeyBindings.random(),
//     myTrialOrder = allTrialOrders.random(),
//     pOdd = (myKeyBindings["p"] == "odd");
    
var sentences = [["Some of the horses jumped over the fence.",
		  "All of the horses jumped over the fence."],
		 ["Some of the movies were comedies.",
		  "Some but not all of the movies were comedies."],
		  ["Some of the horses jumped over the fence.",
		  "All of the horses jumped over the fence."],
		  ["Some of the movies were comedies.",
		  "Some but not all of the movies were comedies."]];

var myTrialOrder = [0, 1, 2, 3];

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");


// ############################## The main event ##############################

var experiment = {
    // Parameters for this sequence.
    trials: myTrialOrder,
    
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
	var sents = sentences[experiment.trials.shift()];
	
	// If the current trial is undefined, call the end function.
	if (typeof sents == "undefined") {
	    return experiment.end();
	}
    
	showSlide("stage");
	
	// Display the sentence stimuli
	$("#sentence1").html(sents[0]);
	$("#sentence2").html(sents[1]);
    
	// Get the current time so we can compute reaction time later.
	// var startTime = (new Date()).getTime();
        
        // Wait 500 milliseconds before starting the next trial.
        // setTimeout(experiment.next, 500);
  
    }
}
