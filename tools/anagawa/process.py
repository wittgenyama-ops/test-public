import sys, math, json, io, base64, random, os
sys.path.insert(0, sys.argv[1]); OUT=sys.argv[2]
from gsi import tile_xy, tile_ll
import numpy as np
from PIL import Image
import mapbox_vector_tile as mvt
from shapely.geometry import Polygon, LineString, box, MultiPolygon
from shapely.ops import unary_union
LAT0,LON0=35.63956,140.11192
KX=math.cos(math.radians(LAT0))*111320.0; KZ=110574.0
def ll(x,z): return LAT0 - z/KZ, LON0 + x/KX
def xz(lat,lon): return (lon-LON0)*KX, -(lat-LAT0)*KZ
C='gsi'
os.makedirs(OUT,exist_ok=True)

# ---------- photos ----------
def photo(z,half,px,name,q):
    la0,lo0=ll(-half,-half); la1,lo1=ll(half,half)
    X0,Y0=tile_xy(la0,lo0,z); X1,Y1=tile_xy(la1,lo1,z)
    tx0,ty0=int(X0),int(Y0); tx1,ty1=int(X1),int(Y1)
    W=(tx1-tx0+1)*256; H=(ty1-ty0+1)*256
    im=Image.new('RGB',(W,H),(60,70,60))
    for x in range(tx0,tx1+1):
        for y in range(ty0,ty1+1):
            p=f'{C}/seamlessphoto/{z}/{x}/{y}.jpg'
            if os.path.exists(p) and os.path.getsize(p)>0: im.paste(Image.open(p).convert('RGB'),((x-tx0)*256,(y-ty0)*256))
    box=((X0-tx0)*256,(Y0-ty0)*256,(X1-tx0)*256,(Y1-ty0)*256)
    out=im.resize((px,px),Image.LANCZOS,box=box)
    out.save(f'{OUT}/{name}',quality=q,optimize=True,progressive=True)
    return out
near=photo(17,1750,3584,'photo_near.jpg',80)
far=photo(15,6000,3072,'photo_far.jpg',78)
print('photos ok',os.path.getsize(f'{OUT}/photo_near.jpg')//1024,'KB',os.path.getsize(f'{OUT}/photo_far.jpg')//1024,'KB')

# ---------- DEM ----------
demcache={}
def dem_tile(kind,z,x,y):
    k=(kind,z,x,y)
    if k not in demcache:
        p=f'{C}/{kind}/{z}/{x}/{y}.txt'; a=None
        if os.path.exists(p) and os.path.getsize(p)>0:
            rows=[r.split(',') for r in open(p).read().strip().split('\n')]
            a=np.array([[float(v) if v!='e' else np.nan for v in r] for r in rows])
        demcache[k]=a
    return demcache[k]
def elev(lat,lon,kind,z):
    X,Y=tile_xy(lat,lon,z); tx,ty=int(X),int(Y); a=dem_tile(kind,z,tx,ty)
    if a is None: return np.nan
    i=min(255,int((Y-ty)*256)); j=min(255,int((X-tx)*256)); return a[i,j]
def grid(half,step,kinds):
    n=int(round(2*half/step))+1; g=np.zeros((n,n))
    for r in range(n):
        for c in range(n):
            x=-half+c*step; z=-half+r*step; la,lo=ll(x,z); v=np.nan
            for kind,zz in kinds:
                v=elev(la,lo,kind,zz)
                if not np.isnan(v): break
            g[r,c]=v
    g[np.isnan(g)]=-3.0
    return g
gnear=grid(1750,7,[('dem5a',15),('dem',14)])
gfar=grid(6000,40,[('dem',14)])
# light smoothing to remove 5m-mesh stair steps / building-edge noise
from numpy.lib.stride_tricks import sliding_window_view
def smooth(g):
    p=np.pad(g,1,mode='edge'); return sliding_window_view(p,(3,3)).mean(axis=(2,3))
gnear=smooth(gnear)
print('dem near',gnear.shape,gnear.min(),gnear.max(),'far',gfar.shape,gfar.min(),gfar.max())
def b64(g): return base64.b64encode(np.clip(np.round(g*10),-32000,32000).astype('<i2').tobytes()).decode()

# ---------- vector tiles ----------
DH=1700
la0,lo0=ll(-DH,-DH); la1,lo1=ll(DH,DH)
X0,Y0=tile_xy(la0,lo0,16); X1,Y1=tile_xy(la1,lo1,16)
bld=[];roads=[];rails=[];labels=[];seen=set();raw=[];edge=[]
def conv(x,y,ext,c):
    return [xz(*tile_ll(x+p[0]/ext,y+1-p[1]/ext,16)) for p in c]
def simplify(pts,eps):
    if len(pts)<3: return pts
    a,b=np.array(pts[0]),np.array(pts[-1]); d=b-a; L=np.hypot(*d)
    best,bi=0,0
    for i in range(1,len(pts)-1):
        p=np.array(pts[i]); dist=abs(d[0]*(a[1]-p[1])-d[1]*(a[0]-p[0]))/L if L>1e-9 else np.hypot(*(p-a))
        if dist>best: best,bi=dist,i
    if best>eps: return simplify(pts[:bi+1],eps)[:-1]+simplify(pts[bi:],eps)
    return [pts[0],pts[-1]]
def clipl(lines,ext):
    TB=box(0,0,ext,ext);out=[]
    for l in lines:
        if len(l)<2: continue
        g=LineString(l).intersection(TB)
        for q in (g.geoms if hasattr(g,'geoms') else [g]):
            if q.geom_type=='LineString' and q.length>0: out.append(list(q.coords))
    return out
def polyarea(p):
    return 0.5*sum(p[i][0]*p[i-1][1]-p[i-1][0]*p[i][1] for i in range(len(p)))
for x in range(int(min(X0,X1)),int(max(X0,X1))+1):
    for y in range(int(min(Y0,Y1)),int(max(Y0,Y1))+1):
        p=f'{C}/experimental_bvmap/16/{x}/{y}.pbf'
        if not os.path.exists(p) or os.path.getsize(p)==0: continue
        t=mvt.decode(open(p,'rb').read())
        for f in t.get('building',{}).get('features',[]):
            ext=t['building']['extent'];g=f['geometry'];TB=box(0,0,ext,ext)
            polys=[g['coordinates']] if g['type']=='Polygon' else g['coordinates'] if g['type']=='MultiPolygon' else []
            for poly in polys:
                try: P=Polygon(poly[0]).buffer(0)
                except Exception: continue
                inside=TB.contains(P)
                P=P.intersection(TB)
                for q in (P.geoms if hasattr(P,'geoms') else [P]):
                    if q.geom_type!='Polygon' or q.area<1: continue
                    ring=conv(x,y,ext,list(q.exterior.coords))
                    (raw if inside else edge).append((f['properties'].get('ftCode',3101),ring))
        for f in t.get('road',{}).get('features',[]):
            ext=t['road']['extent'];g=f['geometry'];pr=f['properties']
            lines=[g['coordinates']] if g['type']=='LineString' else g['coordinates'] if g['type']=='MultiLineString' else []
            for l in clipl(lines,ext): roads.append((pr.get('rnkWidth',0),pr.get('rdCtg',2),pr.get('motorway',9),pr.get('lvOrder',0),conv(x,y,ext,l)))
        for f in t.get('railway',{}).get('features',[]):
            ext=t['railway']['extent'];g=f['geometry'];pr=f['properties']
            if pr.get('ftCode')!=8201: continue
            lines=[g['coordinates']] if g['type']=='LineString' else g['coordinates'] if g['type']=='MultiLineString' else []
            for l in clipl(lines,ext): rails.append((pr.get('rtCode'),conv(x,y,ext,l)))
        for f in t.get('label',{}).get('features',[]):
            ext=t['label']['extent'];g=f['geometry'];pr=f['properties']
            if g['type']!='Point': continue
            c=g['coordinates'];X,Z=xz(*tile_ll(x+c[0]/ext,y+1-c[1]/ext,16))
            labels.append((pr.get('knj',''),pr.get('annoCtg'),round(X),round(Z)))
mergedEdge=unary_union([Polygon(r).buffer(0.05) for ft,r in edge])
edgeFt={}
for ft,r in edge:
    c=Polygon(r).centroid; edgeFt[(round(c.x),round(c.y))]=ft
from shapely.strtree import STRtree
pieces=[(ft,Polygon(r)) for ft,r in edge]
for P in (mergedEdge.geoms if hasattr(mergedEdge,'geoms') else [mergedEdge]):
    P=P.buffer(-0.05)
    if P.is_empty or P.geom_type!='Polygon': continue
    ft=max(pieces,key=lambda fp: fp[1].intersection(P).area if fp[1].intersects(P) else 0)[0] if len(pieces)<50 else next((fp[0] for fp in pieces if fp[1].intersects(P)),3101)
    raw.append((ft,list(P.exterior.coords)))
for ft,ring in raw:
    if ring[0]==ring[-1]: ring=ring[:-1]
    ring=simplify(ring+[ring[0]],0.35)[:-1]
    if len(ring)<3: continue
    A=polyarea(ring)
    if abs(A)<6: continue
    if A<0: ring=ring[::-1]
    cx=sum(q[0] for q in ring)/len(ring);cz=sum(q[1] for q in ring)/len(ring)
    if abs(cx)>DH or abs(cz)>DH: continue
    bld.append((ft,ring,abs(A)))
print('buildings',len(bld),'edge pieces',len(edge),'road segs',len(roads),'rail segs',len(rails))

# merge line segments that share endpoints (tile clipping splits them)
def merge(segs,tol=1.0):
    segs=[list(s) for s in segs if len(s)>=2]
    alive=set(range(len(segs)))
    def cell(p): return (int(math.floor(p[0]/tol)),int(math.floor(p[1]/tol)))
    grid={}
    def add(i):
        for e in (0,-1): grid.setdefault(cell(segs[i][e]),set()).add(i)
    def rem(i):
        for e in (0,-1): grid.get(cell(segs[i][e]),set()).discard(i)
    for i in range(len(segs)): add(i)
    def near(p,excl):
        cx,cz=cell(p);best=None;bd=tol
        for dx in (-1,0,1):
            for dz in (-1,0,1):
                for j in grid.get((cx+dx,cz+dz),()):
                    if j==excl or j not in alive: continue
                    for e in (0,-1):
                        d=math.hypot(segs[j][e][0]-p[0],segs[j][e][1]-p[1])
                        if d<bd: bd=d;best=(j,e)
        return best
    for i in range(len(segs)):
        if i not in alive: continue
        while True:
            rem(i);grown=False
            for end in (-1,0):
                m=near(segs[i][end],i)
                if not m: continue
                j,e=m;t=segs[j]
                if end==-1: segs[i]=segs[i]+(t[1:] if e==0 else t[::-1][1:])
                else: segs[i]=(t[:-1] if e==-1 else t[::-1][:-1])+segs[i]
                rem(j);alive.discard(j);grown=True;break
            add(i)
            if not grown: break
    return [segs[i] for i in sorted(alive)]
def plen(l): return sum(math.hypot(l[i][0]-l[i-1][0],l[i][1]-l[i-1][1]) for i in range(1,len(l)))
# major roads for traffic
major={}
for w,cat,mw,lv,l in roads:
    if w>=3 or cat in (0,1) or mw==1:
        cls='exp' if mw==1 else ('wide' if w>=4 else 'mid')
        major.setdefault(cls,[]).append(l)
roadOut=[]
for cls,ls in major.items():
    for l in merge(ls):
        l=simplify(l,0.6)
        if plen(l)>150: roadOut.append({'c':cls,'p':[[round(a,1),round(b,1)] for a,b in l]})
print('major road paths',len(roadOut),{c:sum(1 for r in roadOut if r['c']==c) for c in major})
# rails by line code
railOut=[]
codes={}
for code,l in rails: codes.setdefault(code,[]).append(l)
for code,ls in codes.items():
    for l in merge(ls):
        l=simplify(l,0.5)
        if plen(l)>200: railOut.append({'code':code,'p':[[round(a,1),round(b,1)] for a,b in l]})
for r in railOut:
    d=min(math.hypot(a,b) for a,b in r['p']); print('rail',r['code'],round(plen(r['p'])),'min dist to station',round(d))

# building heights (no height data in base map: estimate from type & footprint)
random.seed(7)
B=[]
stats={}
for ft,ring,A in bld:
    xs=[q[0] for q in ring];zs=[q[1] for q in ring]
    w=max(xs)-min(xs);d=max(zs)-min(zs);elong=max(w,d)/max(1,min(w,d))
    r=random.random()
    if ft==3103: h=45+r*35; k=3
    elif ft==3102:
        if A<150: h=8+r*5; k=2
        elif A<700: h=(12+r*14) if elong<2.5 else (14+r*10); k=1
        elif A<2500: h=12+r*22 if elong>2 else 10+r*12; k=1
        else: h=12+r*10; k=4
    elif ft==3111: h=3.5+r; k=5
    else:
        if A<170: h=6+r*2.2; k=0
        elif A<600: h=7+r*4; k=0
        else: h=7+r*5; k=4
    stats[k]=stats.get(k,0)+1
    B.append([k,round(h*10)]+[round(v*10) for q in ring for v in q])
print('kinds',stats)
lab=[{'n':n,'c':c,'x':x,'z':z} for n,c,x,z in labels if c in (422,412,531,870,885,888,886,884) and abs(x)<6000 and abs(z)<6000]
dedup={};[dedup.setdefault(l['n'],l) for l in lab]
data={'origin':[LAT0,LON0],
 'near':{'half':1750,'step':7,'n':gnear.shape[0],'h':b64(gnear)},
 'far':{'half':6000,'step':40,'n':gfar.shape[0],'h':b64(gfar)},
 'buildings':B,'roads':roadOut,'rails':railOut,'labels':list(dedup.values())}
s=json.dumps(data,separators=(',',':'),ensure_ascii=False)
open(f'{OUT}/anagawa.json','w').write(s)
print('json KB',len(s)//1024)
for l in dedup.values(): print(l)

# ---------- tree mask from the aerial photo (dark, textured, green -> canopy) ----------
from numpy.lib.stride_tricks import sliding_window_view as sw
im=np.asarray(near.resize((1750,1750))).astype(float)
r,g,b=im[...,0],im[...,1],im[...,2];lum=(r+g+b)/3
std=sw(np.pad(lum,2,mode='edge'),(5,5)).std(axis=(2,3))
base=(lum<118)&(g>=r*.98)&(g>=b*.96)&(std>5)
dens=sw(np.pad(base.astype(float),4,mode='edge'),(9,9)).mean(axis=(2,3))
tree=(base&(dens>.5)).astype('uint8')*255
Image.fromarray(tree).resize((875,875),Image.BOX).point(lambda v:255 if v>100 else 0).convert('L').save(f'{OUT}/trees.png',optimize=True)
print('trees.png KB',os.path.getsize(f'{OUT}/trees.png')//1024)
