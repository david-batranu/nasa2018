import json


features = []

LAT_MIN = 15.9140625
LAT_MAX = 19.109375

LON_MIN = -8.2
LON_MAX = -6.109375


with open('out.txt', 'r') as fin:
    for idx, entry in enumerate(fin.readlines()):
        print(idx)
        val, lon, lat = map(float, entry.split(','))
        if val >= 2 and lat >= LAT_MIN and lat <= LAT_MAX and lon >= LON_MIN and lon <= LON_MAX:
            features.append({
                "type": "Feature",
                "properties": {
                    "value": val
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        lon,
                        lat
                    ]
                }
            })


with open('out-restricted.json', 'w') as out:
    json.dump({
        "type": "FeatureCollection",
        "features": features
    }, out, indent=2)

print('Dumped {} features'.format(len(features)))