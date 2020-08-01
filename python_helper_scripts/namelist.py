import csv


def beautify(entry):
    newentry = entry.strip().lower()
    newentry = newentry.replace("'", "")
    newentry = newentry.replace("\"", "")
    if entry.strip() == "N" or entry.strip() == "Tr" or entry.strip() == "":
        newentry = "0"
    return newentry


# specific IDs of foods, used to create a curated list of food items. Use an empty array to get all food items.
desired_ids = [
    8, 50, 75, 87, 93, 94, 95, 112, 113, 118, 132, 143, 196, 215, 222, 235, 242, 370, 452, 456, 459, 461, 484, 486, 487,
    490, 493, 495, 497, 498, 539, 541, 542, 543, 544, 555, 557, 559, 573, 580, 591, 602, 603, 604, 674, 677, 678, 696,
    725, 740, 745, 747, 793, 803, 805, 845, 846, 847, 861, 865, 880, 881, 887, 893, 907, 908, 914, 916, 917, 922, 923,
    944, 950, 1039, 1041, 1051, 1055, 1087, 1093, 1094, 1095, 1111, 1120, 1124, 1133, 1134, 1174, 1175, 1176, 1178,
    1205, 1207, 1208, 1219, 1220, 1247, 1286, 1287, 1299, 1332, 1443, 1466, 1467, 1513, 1515, 1526, 1556, 1612, 1625,
    1672, 1678, 1680, 1684, 1694, 1695, 1696, 1697, 1726, 1737, 1744, 1747, 1749, 1750, 1774, 1793, 1794, 1806, 1811,
    1814, 1818, 1820, 1828, 1829, 1840, 1867, 1870, 1871, 1874, 1882, 1883, 1889, 1894, 1896, 1900, 1912, 1916, 1919,
    1941, 1955, 1956, 1959, 1962, 1963, 1964, 1965, 1970, 1971, 1975, 1977, 1979, 1980, 1981, 1984, 1985, 1987, 1997,
    2009, 2011, 2012, 2013, 2014, 2027, 2029, 2030, 2053, 2054, 2055, 2057, 2058, 2059, 2060, 2142, 2160, 2169, 2208,
    2210, 2212, 2223, 2224, 2226, 2230, 2231, 2236, 2248, 2251, 2252, 2254, 2256, 2262, 2361, 2363, 2368, 2374, 2375,
    2380, 2381, 2409, 2414, 2415, 2420, 2421, 2422, 2424, 2459, 2479, 2492, 2506, 2507, 2509, 2510, 2517, 2518, 2549,
    2554, 2555, 2556, 2605, 2607, 2608, 2609, 2611, 2612, 2613, 2619, 2625, 2634, 2636, 2640, 2641, 2643, 2652, 2658,
    2660, 2671, 2675, 2678, 2680, 2700, 2710, 2711, 2731, 2732, 2737, 2745, 2746, 2748, 2749, 2753, 2803, 2814, 2817,
    2819, 2835, 2836, 2843, 2846, 2890, 2898, 2901, 2905, 2908, 2913
]


# Returns True if the passed row number is one of the desired ids entered in the above array
def get_only_desired_ids(rownum):
    if rownum in desired_ids:
        return True
    return False


filenames = ["db", "dbinorg", "dbvits"]
if desired_ids:
    for i in range(len(filenames)):
        # Add suffix to use full dataset when using desired ids
        filenames[i] = filenames[i] + "Full"

# Get the following nutrient scores from DB:
# name, calories, carbs, fats, protein, sugar, saturatedfat, fibre, omega3, group, calcium, vita, vitb1, vitb9, vitc
macro_array = []
with open(filenames[0]+".csv") as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    bigtext = "db.insert(["
    linenum = 1
    for row in readCSV:
        if linenum > 4:
            if get_only_desired_ids(linenum):
                totalfibre = (float(beautify(row[24])) + float(beautify(row[25])))
                totalfibre = "%.2f" % round(totalfibre,2)

                macro_dict = {
                    "name": beautify(row[1]),
                    "calories": beautify(row[12]),
                    "carbs": beautify(row[11]),
                    "fats": beautify(row[10]),
                    "protein": beautify(row[9]),
                    "sugar": beautify(row[16]),
                    "satfat": beautify(row[27]),
                    "fibre": totalfibre,
                    "omega3": beautify(row[31]),
                    "group": beautify(row[3])
                }
                macro_array.append(macro_dict)
        linenum += 1

inorganics_array = []
with open(filenames[1]+".csv") as csvfileinorg:
    readCSVinorg = csv.reader(csvfileinorg, delimiter=',')
    linenum = 1
    for row in readCSVinorg:
        if linenum > 4:
            if get_only_desired_ids(linenum):

                inorganics_dict = {
                    "calcium": beautify(row[9]),
                }
                inorganics_array.append(inorganics_dict)
        linenum += 1

vitamin_array = []
with open(filenames[2]+".csv") as csvfilevits:
    readCSVvits = csv.reader(csvfilevits, delimiter=',')
    linenum = 1
    for row in readCSVvits:
        if linenum > 4:
            if get_only_desired_ids(linenum):
                totalvitA = (float(beautify(row[7])) + float(beautify(row[8])))
                totalvitA = "%.2f" % round(totalvitA, 2)

                vitamin_dict = {
                    "vitA": totalvitA,
                    "vitB1": beautify(row[13]),
                    "vitB9": beautify(row[20]),
                    "vitC": beautify(row[23])
                }
                vitamin_array.append(vitamin_dict)
        linenum += 1

food_array = []
# Merge all dicts (per food) together
for i in range(len(macro_array)):
    food_array.append({**macro_array[i], **inorganics_array[i], **vitamin_array[i]})

# Write beautified items to output files
# populateDatabase
with open('populateNameList.js', 'w') as output:
    output.write("/*\n"
                 "Populates a local JSON array with every (curated) food's name.\n"
                 "*/\n\n"
                 "import React from 'react';\n"
                 "export default class PopulateNameList extends React.Component {\n"
                 "	constructor(){\n"
                 "		super();\n\n"
                 "global.nameList = [\n\n")

    # To prevent a trailing comma (JSON doesn't like these) we put a comma above every food, except for the first food
    first_element = True
    for food in food_array:
        if first_element:
            first_element = False
        else:
            output.write(",\n")
        output.write("  \"" + food["name"] + "\"")
    output.write("\n]}}\n")

# populateNameList
with open('populateDatabase.js', 'w') as output:
    output.write("/*\n"
                 "Populates a mongodb database with all foods and their nutritional info\n"
                 "*/\n\n"
                 "import React from 'react';\n"
                 "var Datastore = require('react-native-local-mongodb'),\n"
                 "db = new Datastore({ filename: 'foods', autoload: true });\n\n"
                 "export default class PopulateDatabase extends React.Component {\n"
                 "	constructor(){\n"
                 "		super();\n\n"
                 "		//db.remove({}, { multi: true }, function (err, numRemoved) {\n"
                 "		//});\n\n"
                 "db.insert([")

    first_element = True
    for food in food_array:
        if first_element:
            first_element = False
        else:
            output.write(",\n")
        output.write("{\n")

        # The name and group values are strings, so need to be treated specially
        for key in food.keys():
            if key is "name":
                output.write("  _id: \"" + food["name"] + "\",\n")
            elif key is "group":
                output.write("  group: \"" + food["group"] + "\",\n")
            else:
                output.write("  " + key + ": " + food[key] + ",\n")
        output.write("}\n")
    output.write("], function (err, newDocs) {\n"
                 "		console.log('Errors: ' + err);\n"
                 "		}); \n"
                 "	}\n"
                 "}")

# populateArray
with open('populateArray.js', 'w') as output:
    output.write("/*\n"
                 "Populates a local JSON array with every (curated) food and their nutritional info\n"
                 "*/\n\n"
                 "import React from 'react';\n"
                 "export default class PopulateArray extends React.Component {\n"
                 "	constructor(){\n"
                 "		super();\n\n"
                 "global.foods = {\n\n")

    first_element = True
    for food in food_array:
        if first_element:
            first_element = False
        else:
            output.write(",\n")

        output.write("\"" + food["name"] + "\": {\n")
        for key in food.keys():
            if key is "name" or key is "group":
                output.write("  \"" + key + "\": \"" + food[key] + "\",\n")
            else:
                output.write("  \"" + key + "\": " + food[key] + ",\n")
        output.write("}\n")
    output.write("}}}\n")

print("Output written to files. Please move the populateArray.js and populateNameList.js files to the "
      "./nutriplotterapp directory.")
print("(NOT RECOMMENDED:) If you want to update the mongodb DB with the same subset of foods, also copy the "
      "populateDatabase.js file. This will likely cause old versions of the app to crash as it may refer to foods that "
      "no longer exist.")
