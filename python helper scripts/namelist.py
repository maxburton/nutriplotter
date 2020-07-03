import csv

def beautify(entry):
    newentry = entry.strip().lower()
    newentry = newentry.replace("'", "")
    newentry = newentry.replace("\"", "")
    if entry.strip() == "N" or entry.strip() == "Tr" or entry.strip() == "":
        newentry = "0"
    return newentry

array = []
with open('db.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    bigtext = "db.insert(["
    linenum = 0
    for row in readCSV:
        if linenum < 3:
            linenum = linenum + 1
        else:
            line = "name, calories, carbs, fats, protein, sugar, saturatedfat, fibre, omega3, group, calcium, vita, vitb1, vitb9, vitc) values (\""
            totalfibre = (float(beautify(row[24])) + float(beautify(row[25])))
            totalfibre = "%.2f" % round(totalfibre,2)
            line = "\"" + beautify(row[1]) + "\","
            array.append(line)
with open('dbinorg.csv') as csvfileinorg:
    readCSVinorg = csv.reader(csvfileinorg, delimiter=',')
    linenum = 0
    for row in readCSVinorg:
        if linenum < 3:
            linenum = linenum + 1
        else:
            #array[linenum-3] = array[linenum-3] + "\"group\": \"" + beautify(row[3]) + "\", \"calcium\": " + beautify(row[7])
            linenum = linenum + 1

with open('dbvits.csv') as csvfilevits:
    readCSVvits = csv.reader(csvfilevits, delimiter=',')
    linenum = 0
    for row in readCSVvits:
        if linenum < 3:
            linenum = linenum + 1
        else:
            totalvitA = (float(beautify(row[7])) + float(beautify(row[8])))
            totalvitA = "%.2f" % round(totalvitA, 2)
            #array[linenum - 3] = array[linenum - 3] + ", \"vitA\": " + totalvitA + ", \"vitB1\": " + beautify(row[13]) + ", \"vitB9\": " + beautify(row[20]) + ", \"vitC\": " + beautify(row[23]) + "},"
            linenum = linenum + 1

    print("[")
    for i in range(len(array)):
        print(array[i])
    print("]")

