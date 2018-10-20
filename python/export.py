import json
from itertools import product

from netCDF4 import Dataset

res = []

root = Dataset('swbp.nc', 'r')
c_sw = root['swbp']
c_lat = root['lat']
c_lon = root['lon']

# len_xy = c_lon.size * c_lat.size


LAT_MIN = 9.9140625
LAT_MAX = 20.109375

LON_MIN = -9.6328125
LON_MAX = 2.109375

#
# s_lon_idx = 0
# e_lon_idx = 0
#
# for idx, x in enumerate(c_lon):
#     if not s_lon_idx and x > LON_MIN:
#         s_lon_idx = idx
#
#     if x > LON_MAX:
#         e_lon_idx = idx
#         break

x_y = product(range(4976, 10613), range(c_lat.size))


# print(s_lon_idx, e_lon_idx)


def extract():
    for xx, yy in x_y:
        val = float(c_sw[yy, xx])
        if val != 10 and val != 0:
            lon = float(c_lon[xx])
            lat = float(c_lat[yy])

            yield (val, lon, lat)


with open('out2.txt', 'w') as out:
    idx = 0
    for r in extract():
        idx += 1
        out.write('{},{},{}\n'.format(*r))
        print(idx)

root.close()

# with open('out.json', 'w+') as out:
#     json.dump(res, out)