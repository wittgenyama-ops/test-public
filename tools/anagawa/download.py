import sys, math
sys.path.insert(0, sys.argv[1])
from gsi import *
LAT0,LON0=35.63956,140.11192
KX=math.cos(math.radians(LAT0))*111320.0; KZ=110574.0
def ll(x,z): return LAT0 - z/KZ, LON0 + x/KX
def tiles(z,half):
    la0,lo0=ll(-half,-half); la1,lo1=ll(half,half)
    x0,y0=tile_xy(la0,lo0,z); x1,y1=tile_xy(la1,lo1,z)
    return range(int(min(x0,x1)),int(max(x0,x1))+1),range(int(min(y0,y1)),int(max(y0,y1))+1)
jobs=[('experimental_bvmap',16,1700,'pbf'),('seamlessphoto',17,1750,'jpg'),('seamlessphoto',15,6200,'jpg'),('dem5a',15,1800,'txt'),('dem',14,6300,'txt')]
for kind,z,half,ext in jobs:
    xs,ys=tiles(z,half); n=0;miss=0
    for x in xs:
        for y in ys:
            d=fetch(kind,z,x,y,ext,'gsi'); n+=1; miss+= d is None
    print(kind,z,len(xs),'x',len(ys),'tiles',n,'missing',miss,flush=True)
