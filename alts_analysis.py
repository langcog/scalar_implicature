import os
import json
import collections
import copy
from nltk import metrics

path = "production-results/e9/"

# fill this in with functionality we want to run
toDo = "read_data edit_data"

#################################################################################
#################################################################################
# Helpers
# -------
def convertLower(lst):
	"""
	convert each item in lst to lower case
	"""
	lower_list = [x.strip().lower() for x in lst]
	return lower_list

def combineIncorrectSpellings(input_list, dist, cached): 
	"""
	Given input lst of alternatives and dist (numeric) calculate edit distance.
	If edit distance is greater than 0 and less than 'dist' manually update data
	"""
	
	lst = copy.deepcopy(input_list)
	n = len(lst)
	# All pairwise comparisons
	for i in range(n - 1):
		for j in range(i, n):
			print("i: %s, j: %s" % (i, j))
			edit_distance = metrics.distance.edit_distance(lst[i], lst[j])	# store edit distance

			if ((edit_distance > 0 and edit_distance < dist) or\
				(abs(len(lst[i]) - len(lst[j])) == 1) and lst[i][0] == lst[j][0]):	# single representation
				combine_strings = str(lst[i]+'_'+lst[j])

				# first check cache for existing values
				if combine_strings in cached.keys():
					if (cached[combine_strings] == "do-not-change"):
						print("***Don't change pair: %s" % combine_strings)
						continue
					else:
						print("cache[%s] =  %s" % (combine_strings, cached[combine_strings]))
						lst[i] = cached[combine_strings]
						lst[j] = cached[combine_strings]
						continue
				else:
					print("--------------------------------------------------")
					print("Editing... %s and %s" % (lst[i], lst[j]))
					make_edit = raw_input("Make an edit here? ('y'/'n'): ")

				# go into manual edit
				if make_edit == 'y':
					print("--------------------------")
					print("*%s*,*%s*" % (lst[i], lst[j]))
					print("--------------------------")
					change = raw_input("'left word' is correct press 1; " +\
						"'right word' is correct press 2; " + \
						"Type correct spelling (or 0 for not a match): ")

					if change == '1':
						lst[j] = lst[i]
						cached.update({combine_strings : lst[i]})
						print("stored in cache")

					elif change == '2':
						lst[i] = lst[j]
						cached.update({combine_strings : lst[j]})
						print("stored in cache")
					else:
						lst[i] = change
						lst[j] = change
						cached.update({combine_strings : change})
						print("stored in cache")
				else:
					cached.update({combine_strings : "do-not-change"})
	return lst, cached


#################################################################################
#################################################################################
# Process data
# ------------
files = os.listdir(path)

# data org
# --------
scalars = {"memorable_unforgettable":	{"hi": "unforgettable", "low": "memorable"},
		   "liked_loved": 			  	{"hi": "loved", "low": "liked" },
		   "some_all": 					{"hi": "all", "low": "some" },
		   "palatable_delicious": 		{"hi": "delicious", "low": "palatable" },
		   "good_excellent": 			{"hi": "excellent", "low": "good" },
		   "training1": 				{"hi": "high", "low": "low"}}

scalar_data = { "liked":[],
				"loved":[],
				"memorable":[],
				"unforgettable":[],
				"liked":[],
				"loved":[],
				"good":[],
				"excellent":[],
				"palatable":[],
				"delicious":[],
				"some":[],
				"all":[],
				"high":[],
				"low":[] }

# read in for each respondent
# ---------------------------
if "read_data" in toDo:
	print "Reading in data..."
	for f in files:
		with open(path + f) as data_file:    
			data = json.load(data_file)

			scales = data['answers']['data']['scale']    			# get scale
			degree = data['answers']['data']['degree']				# get degree

			# Get alts and convert to lower case
			alt1 = convertLower(data['answers']['data']['alt1'])	# alternative 1
			alt2 = convertLower(data['answers']['data']['alt2'])	# alternative 2
			alt3 = convertLower(data['answers']['data']['alt3'])  	# alternative 3

			# store alts in 'scalar_data'
			for i in range(len(scales)):
				scale = scales[i]
				d = degree[i]
				a1 = alt1[i]
				a2 = alt2[i]
				a3 = alt3[i]

				scalar_data[scalars[scale][d]].extend((a1, a2, a3))

# Output to .json to for R
# ------------------------
if "output_rawData" in toDo:
	print "Raw data output..."
	with open('analysis/raw_alts.json', 'w') as fp:
		json.dump(scalar_data, fp)

#################################################################################
#################################################################################
# Editing / cleaning data
# -----------------------
if "edit_data" in toDo:
	print "Editing data..."

	# check combineIncorrectSpellings is working
	# ------------------------------------------
	# lst = ['despised', 'dispised', 'despised', 'dispised', 'rospised']

	data_edited = {}
	cache = {}
	for key in scalar_data:
		edited_altList, cache = combineIncorrectSpellings(scalar_data[key], 2, cache)
		data_edited.update({key : edited_altList})


if "output_editedData" in toDo:
	print "edited data output..."

	with open('analysis/edited_alts.json', 'w') as fp:
		json.dump(data_edited, fp)

#################################################################################
#################################################################################
# Printing
# -------
if "print" in toDo:
	for i in range(len(scalar_data["liked"])):
		print scalar_data["liked"][i]
		print data_edited["liked"][i]
		print scalar_data["liked"][i] == data_edited["liked"][i]