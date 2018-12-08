import json
import os
from copy import deepcopy

fr = open("../actors_wins_nominees_years.json", "r", encoding="utf-8")
fw = open("../final_results.json", "w", encoding="utf-8")

raw_json = "".join(line.strip("\n") for line in fr)
parsed_json = json.loads(raw_json)

years = list()
for i in range(1949, 2018):
    years.append(i)

fw.write("[\n")
i = 0
while i < len(parsed_json):
    actorName = parsed_json[i]["nominee"]
    yearsNom = [parsed_json[i]["year"]]
    toWrite = [json.dumps(parsed_json[i])]
    copy = deepcopy(parsed_json[i])
    newYears = deepcopy(years)
    resNom = list()
    if i + 1 <= len(parsed_json) - 1:
        i += 1
        while (parsed_json[i]["nominee"] == actorName):
            yearsNom += [parsed_json[i]["year"]]
            toWrite += [json.dumps(parsed_json[i])]
            if i + 1 <= len(parsed_json) - 1:
                i += 1
    else:
        yearsNom += [parsed_json[i]["year"]]
        toWrite += [json.dumps(parsed_json[i])]
        i += 1
    if (len(yearsNom) != len(set(yearsNom))):
        seen = set()
        dup = []
        for x in yearsNom:
            if x not in seen:
                seen.add(x)
            else:
                dup.append(x)
        for k in dup:
            searchable = years.index(k)
            newYears.insert(searchable, k)
    for k in newYears:
        if k in yearsNom:
            resNom.append(True)
        else:
            resNom.append(False)
    it = 0
    for k in range(len(resNom)):
        if resNom[k] == True:
            fw.write(toWrite[it])
            it += 1
        else:
            copy["year"] = newYears[k]
            copy["winner"] = 2
            fw.write(json.dumps(copy))
        fw.write(",\n")
fw.seek(fw.tell() - 2, os.SEEK_SET)
fw.write("\n]")

fr.close()
fw.close()