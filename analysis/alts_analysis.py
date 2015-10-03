import os
import json


# read in data
# ------------
path = "production-results/e9/"
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
for f in files:
	with open(path + f) as data_file:    
		data = json.load(data_file)

		scales = data['answers']['data']['scale']    	# get scale
		degree = data['answers']['data']['degree']		# get degree
		alt1 = data['answers']['data']['alt1']			# alternative 1
		alt2 = data['answers']['data']['alt2']			# alternative 2
		alt3 = data['answers']['data']['alt3']  		# alternative 3
		
		# if True:
		# 	print("----------------------------------------")
		# 	print f
		# 	print("scales: %s" % scales)
		# 	print("degree: %s" % degree)
		# 	print("alt1: %s" % alt1)
		# 	print("alt2: %s" % alt2)
		# 	print("alt3: %s" % alt3)
		# 	print("----------------------------------------")

		for i in range(len(scales)):
			scale = scales[i]
			d = degree[i]
			a1 = alt1[i]
			a2 = alt2[i]
			a3 = alt3[i]

			scalar_data[scalars[scale][d]].extend((a1, a2, a3))

# print scalar_data
# print scalar_data["liked"]
# print len(scalar_data["liked"])
# print scalar_data["some"]
# print len(scalar_data["some"])

# Output to .json to for R
# ------------------------
with open('alts.json', 'w') as fp:
    json.dump(scalar_data, fp)

