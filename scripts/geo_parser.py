import json
import os
from copy import deepcopy

cities = open("../cities.geojson", "r", encoding="utf-8")
actors = open("../actors_nomenies_wins_ratio_place_of_birth_counter.json", "r", encoding="utf-8")
fw = open("../new_cities.geojson", "w", encoding="utf-8")

raw_json = "".join(line.strip("\n") for line in cities)
parsed_json_cities = json.loads(raw_json)

raw_json = "".join(line.strip("\n") for line in actors)
parsed_json_actors = json.loads(raw_json)

placeOfBirth = list()
for i in range(1, len(parsed_json_actors)):
    placeOfBirth.append(parsed_json_actors[i]["E"].lower())
placeOfBirth = set(placeOfBirth)

aux = parsed_json_cities["features"]
fw.write("""{
"type": "FeatureCollection",
"features": [""")
for i in range(len(aux)):
    if aux[i]["properties"]["NAME"] == None:
        continue
    if aux[i]["properties"]["NAME"].lower() in placeOfBirth:
        aux[i]["properties"]["NAME"] = aux[i]["properties"]["NAME"].title()
        fw.write(json.dumps(aux[i]))
        fw.write(",\n")
    else:
        continue
fw.seek(fw.tell() - 2, os.SEEK_SET)
fw.write("\n]\n}")

cities.close()
actors.close()
fw.close()