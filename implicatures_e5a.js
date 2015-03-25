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


//sent_materials = doSentSubs(scale, type, degree);
// substitution function - do we want to save all these factors to a data object?
//Pass a trial object in to be populated?
// function doSentSubs (group_type, scale, degree) {
// 	//TODO: work with this function

//     //inference = sents["scales"][scale]["sent_inference"];
//     //question = sents["scales"][scale]["sent_question"];
//     //manipulation = sents["domains"][domain][manip];
//     //manipulation = sents["scales"][scale]["sent_manipulation"];

//     main_sent = sents["group_type"][group_type]["sent_question"];
//     target = sents["scale"][group_type][scale][degree];

//     // SP = sents["domains"][domain]["SP"]; //Plural
//     // SS = sents["domains"][domain]["SS"]; //Singular
//     // P1 = sents["domains"][domain]["P1"]; //Predicate 1
//     // P2 = sents["domains"][domain]["P2"]; //Predicate 2
//     // V1 = sents["domains"][domain]["V1"]; //Past
//     // V2 = sents["domains"][domain]["V2"]; //Present

//     //inference = inference.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);


//     //question = question.replace("SP",SP).replace("SS",SS).replace("P1",P1).replace("P2",P2).replace("V1",V1).replace("V2",V2);
//     main_sent = main_sent.replace("ADJ", target).replace("VP", target);

//     return main_sent;
// }

//Replace speaker name in manipulation
// function doSpeakerSub(speaker, manip) {
// 	manip = manip.replace("SPEAKER", speaker);
// 	return manip;
// }
//############################## Helper functions ##############################	

//3.24.25
//1. Change "scale" to "type"
//2. Change "domain" to "scale"
var sents = {
    scale: {
		training1: {
		    hi:  "thought the restaurant deserved a high rating?",
		    low:  "thought the restaurant deserved a low rating?"
		},
		training2: {
		    hi:  "thought the restaurant deserved a low rating?",
		    low:  "thought the restaurant deserved a low rating?"
		},	
		liked_loved: {		   
		    hi:  "loved the restaurant?",
		    low:  "loved the restaurant?"
		},
		good_excellent: {
			hi:  "thought the restaurant was excellent?",
		    low:  "thought the restaurant was good?"
		},
		palatable_delicious: {
			hi:  "thought the restaurant was delicious?",
		    low:  "thought the restaurant was palatable?"
		},
		memorabe_unforgettable: {
			hi:  "thought the restaurant was unforgettable?",
		    low:  "thought the restaurant was memorable?"
		},
		some_all: {
			hi: "enjoyed all of the food",
			low: "enjoyed some of the food"
		}
    },
};

//dislike_horrible
//adequate_good
//loathed_dislike


//###:-----------------CONDITION PARAMETERS-------------------:###
//var speakers = ["John","Bob"];
var scales = Object.keys(sents.scale);
//var group_types = Object.keys(sents.group_type);
var scale_degrees = ["hi", "low"];
//scale rating appearance
var manipulation =  shuffle(["60", "80", "100"]);
//domains.shift(); This was for training
//domains.shift(); This was for training
//domains = shuffle(domains);

//TODO: have manipulation be high/medium/low here and in other parts of experiment


// now put the training trials up front and shuffle the rest of the trials.
//var scales = ["training1","like_love","training2","good_excellent"];
//var domains = ["training1", domains[0], "training2", domains[1]];
//var manipulation_levels = ["training", manipulation[0], "training", manipulation[1]];

//###:-----------------CONDITION PARAMETERS-------------------:###
var totalTrials = scales.length; //One trial for each domain

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

//###:-----------------MAIN EVENT-------------------:###
var experiment = {

    //Data object for logging responses, etc
    data: {
		scale: [],
		degree: [],
		manipulation_level: [],
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
		if (window.self == window.top || turk.workerId.length > 0) {
		    //Clear the test message and adjust progress bar
		    $("#testMessage").html('');  
		    $("#prog").attr("style","width:" +
				    String(100 * (1 - scales.length/totalTrials)) + "%");
		    
		    //#####:---Get the current trial parameters - scale, domain, speaker---:#####
		    var current_scale = scales.shift();
		    if (typeof current_scale == "undefined") {
				return experiment.debriefing();
		    }
		    console.log("current_scale:", current_scale);
		    // if (scale != "training1" && group_type != "training2") {
		    // 	var scale = scales.shift();
		    // }
		    var degree = shuffle(scale_degrees)[0];
		    sent_materials = sents.scale[current_scale][degree];
		    console.log("degree:", degree);

		    console.log("sent_materials", sent_materials);
			//var group_type = group_types.shift();
		    //speaker = shuffle(speakers)[0]; //Randomize speaker

		    // If the current trial domain is undefined, move to debrief
		    

		    //###:---------Manipulation code----------:###
		    manipulation_level = shuffle(manipulation)[0]; //Randomize manipulation
		    //Set manipulation sentence
		    // if (manipulation_level == "high") {
		    // 	sent_manipulation = sents["domains"][domain]["sent_manipulation_high"];
		    // } else {
		    // 	sent_manipulation = sents["domains"][domain]["sent_manipulation_low"];
		    // }
		    //Replace speaker in manipulation
		    //sent_manipulation = doSpeakerSub(speaker, sent_manipulation);

		    //###:---------Manipulation code----------:###
		    //sent_context = sents["domains"][domain]["sent_context_plural"];


		    //Main substitition function (everything but manipulation)
		    //console.log("scale: ", current_scale);
		    //console.log("group_type", group_type);
		    //console.log("degree", degree);
		    // if (group_type != "training1" && group_type != "training2") {
		    // 	sent_materials = //doSentSubs(scale, group_type, degree);		
		    // } else {
		    // 	sent_materials = sents["group_type"][group_type];
		    // }
		    
		    //console.log("sent_materials: ", sent_materials);
		    
		    //###:-----------------Display trial-----------------:###
		    // $("#sent_context").html(sent_context);
		    // //adding in manipulation
		    // $("#speaker").html(speaker);
		    // $("#sent_manipulation").html(sent_manipulation);
		    // $("#speaker").html("<b>" + speaker + " said:</b>");
		    // $("#sent_inference").html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp\"" +
					 //      sent_materials[0] + "\"");
			$(".rating-stars").attr("style","width: " +
							    manipulation_level + "%");
		    $("#sent_question").html("Do you think that the person "+
					     sent_materials);
		    //###:-----------------Display trial-----------------:###
		    
		    //###:-------------Log trial data (push to data object)-------------:###
		    experiment.data.scale.push(current_scale);
		    experiment.data.degree.push(degree);
		    //experiment.data.group_type.push(group_type);
		    experiment.data.manipulation_level.push(manipulation_level);
		    //experiment.data.domain.push(domain);
		    //experiment.data.sent_context.push(sent_context);
		    //experiment.data.sent_inference.push(sent_materials[0]);
		    //experiment.data.sent_question.push(sent_materials);
		    
		    //experiment.data.sent_manipulation.push(sent_manipulation);
		    //experiment.data.speaker.push(speaker); 
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
