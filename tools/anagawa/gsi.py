import math, os, time, urllib.request, ssl
BASE='https://cyberjapandata.gsi.go.jp/xyz/'
def tile_xy(lat,lon,z):
    n=2**z; x=(lon+180)/360*n; y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n; return x,y
def tile_ll(x,y,z):
    n=2**z; lon=x/n*360-180; lat=math.degrees(math.atan(math.sinh(math.pi*(1-2*y/n)))); return lat,lon
def fetch(kind,z,x,y,ext,cache):
    p=f'{cache}/{kind}/{z}/{x}/{y}.{ext}'
    if os.path.exists(p): return open(p,'rb').read() if os.path.getsize(p)>0 else None
    os.makedirs(os.path.dirname(p),exist_ok=True)
    for i in range(4):
        try:
            with urllib.request.urlopen(f'{BASE}{kind}/{z}/{x}/{y}.{ext}',timeout=40) as r: d=r.read()
            open(p,'wb').write(d); time.sleep(0.05); return d
        except urllib.error.HTTPError as e:
            if e.code==404: open(p,'wb').close(); return None
            time.sleep(2**i)
        except Exception: time.sleep(2**i)
    return None
