import numpy as np, math, random, subprocess, wave
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W,H,FPS=1280,720,24
FONT='/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'
_fc={}
def F(s):
    if s not in _fc: _fc[s]=ImageFont.truetype(FONT,s)
    return _fc[s]
sp=Image.open('raicorn.png'); al=sp.split()[3]
border=al.filter(ImageFilter.MaxFilter(15))
st=Image.new('RGBA',sp.size,(255,255,255,0))
st.paste((60,60,60,255),(0,0),border.point(lambda v:255 if v>40 else 0)); st.alpha_composite(sp)
BASE_H=400
SPR=st.resize((int(st.width*BASE_H/st.height),BASE_H),Image.LANCZOS)
SPRF=SPR.transpose(Image.FLIP_LEFT_RIGHT)
def lerp(a,b,t): return a+(b-a)*t
def ease(t): t=max(0,min(1,t)); return t*t*(3-2*t)
def clamp(t): return max(0,min(1,t))

def sky(top,bot,w=W):
    im=Image.new('RGB',(w,H)); d=ImageDraw.Draw(im)
    for y in range(H):
        t=y/H; d.line([(0,y),(w,y)],fill=tuple(int(lerp(top[i],bot[i],t)) for i in range(3)))
    return im
DAYSKY=((120,180,235),(215,235,250)); EVESKY=((90,80,160),(255,170,110)); GRAYSKY=((120,125,140),(175,180,190))
def clouds(d,t=0,n=5,col=(255,255,255),w=W):
    for i in range(n):
        cx=(i*290+t*20)%(w+300)-150; cy=60+(i*53)%160
        d.ellipse([cx,cy,cx+150,cy+50],fill=col); d.ellipse([cx+40,cy-25,cx+120,cy+35],fill=col)
def sign(d,x,y,text,sub=None,size=40,col=(0,60,120),bg=(255,255,255)):
    f=F(size); bb=d.textbbox((0,0),text,font=f); w=bb[2]-bb[0]
    h=size+24+(26 if sub else 0)
    d.rounded_rectangle([x,y,x+w+40,y+h],12,fill=bg,outline=col,width=5)
    d.text((x+20,y+8),text,font=f,fill=col)
    if sub: d.text((x+22,y+size+16),sub,font=F(18),fill=col)

def town(evening=False,w=W,signtext='あながわえき',seed=3):
    rnd=random.Random(seed)
    im=sky(*(EVESKY if evening else DAYSKY),w=w); d=ImageDraw.Draw(im)
    if evening: d.ellipse([950,330,1090,470],fill=(255,210,130))
    gy=520
    for x in range(-40,w+200,170):
        h=rnd.randint(160,330); bw=rnd.randint(110,190)
        c=rnd.choice([(206,200,190),(180,190,200),(220,210,200),(190,175,165),(170,180,175)])
        if evening: c=tuple(int(v*0.7) for v in c)
        d.rectangle([x,gy-h,x+bw,gy],fill=c)
        for wy in range(gy-h+18,gy-20,34):
            for wx in range(x+14,x+bw-20,30):
                d.rectangle([wx,wy,wx+14,wy+18],fill=(255,230,150) if evening and rnd.random()<0.5 else (150,175,200))
    d.rectangle([0,gy,w,H],fill=(120,120,125)); d.rectangle([0,gy,w,gy+40],fill=(200,195,185))
    for x in range(0,w,120): d.rectangle([x,640,x+60,650],fill=(240,240,240))
    for px in range(180,w+100,520):
        d.rectangle([px-14,150,px+14,gy+20],fill=(150,155,160)); d.rectangle([px-14,140,px+120,165],fill=(150,155,160))
    d.rectangle([0,140,w,170],fill=(140,145,150))
    if signtext: sign(d,60,330,signtext,'ちば としものれーる')
    for tx in range(480,w,500):
        d.rectangle([tx-8,gy-60,tx+8,gy+10],fill=(110,80,50))
        d.ellipse([tx-50,gy-140,tx+50,gy-40],fill=(80,150,80) if not evening else (60,100,60))
    return im

def train(d,x,faces=False,t=0):
    d.rounded_rectangle([x,172,x+420,250],20,fill=(245,245,245),outline=(90,90,90),width=3)
    d.rectangle([x+10,232,x+410,242],fill=(0,120,200))
    for i,wx in enumerate(range(x+30,x+400,60)):
        d.rectangle([wx,185,wx+40,215],fill=(110,150,190))
        if faces:
            d.ellipse([wx+12,190,wx+28,206],fill=(250,215,185))
            d.line([(wx+5,200),(wx-2,186+math.sin(t*12+i)*4)],fill=(250,215,185),width=4)

def park(evening=False,name='てんだいこうえん',pond=False):
    im=sky(*(EVESKY if evening else DAYSKY)); d=ImageDraw.Draw(im)
    if not evening: clouds(d)
    d.rectangle([0,470,W,H],fill=(120,190,90) if not evening else (80,130,70))
    if pond: d.ellipse([-200,520,700,700],fill=(90,160,210))
    for tx in (70,1200,900):
        d.rectangle([tx-10,380,tx+10,480],fill=(110,80,50)); d.ellipse([tx-70,280,tx+70,410],fill=(70,140,70) if not evening else (50,95,55))
    sign(d,40,380,name,size=36,col=(30,100,40))
    return im

def slide(d,x=780):
    d.rectangle([x,300,x+12,600],fill=(200,60,60)); d.rectangle([x+80,300,x+92,600],fill=(200,60,60))
    for y in range(330,600,40): d.line([(x,y),(x+92,y)],fill=(200,60,60),width=6)
    d.rectangle([x-10,290,x+102,305],fill=(240,190,40))
    d.polygon([(x+92,295),(x+102,295),(x+380,580),(x+380,600),(x+350,600)],fill=(80,140,220))
def SLIDE_PATH(u,x=780):
    return (lerp(x+60,x+360,u), lerp(300,590,u))

def zoo():
    im=sky(*DAYSKY); d=ImageDraw.Draw(im); clouds(d)
    d.rectangle([0,480,W,H],fill=(190,170,120))
    d.ellipse([900,380,1180,540],fill=(150,140,130)); d.ellipse([60,410,300,540],fill=(160,150,135))
    for tx in (1150,250):
        d.rectangle([tx-10,320,tx+10,480],fill=(110,80,50)); d.ellipse([tx-80,220,tx+80,350],fill=(70,140,70))
    # giraffe far
    gx=1040
    d.rectangle([gx-30,300,gx+30,350],fill=(230,180,80)); d.line([(gx+20,310),(gx+60,200)],fill=(230,180,80),width=16)
    d.ellipse([gx+45,185,gx+85,210],fill=(230,180,80))
    for lx in (gx-25,gx+20): d.line([(lx,345),(lx,400)],fill=(230,180,80),width=8)
    for x in range(0,W,40): d.line([(x,560),(x,640)],fill=(120,90,60),width=5)
    d.line([(0,570),(W,570)],fill=(120,90,60),width=5); d.line([(0,620),(W,620)],fill=(120,90,60),width=5)
    sign(d,380,60,'ちばし どうぶつこうえん',size=38,col=(140,80,20))
    return im

def lion(d,x,y,s=1.0,t=0,roar=0,flip=False):
    k=-1 if flip else 1
    d.ellipse([x-80*s,y-90*s,x+90*s,y],fill=(220,170,90))
    for lx in (-50,-10,40,70): d.rectangle([x+lx*s,y-30*s,x+(lx+20)*s,y+20*s],fill=(210,160,80))
    d.line([(x-k*80*s,y-60*s),(x-k*140*s,y-100*s+math.sin(t*6)*10)],fill=(210,160,80),width=int(10*s))
    hx=x+k*95*s; hy=y-100*s
    for a in range(0,360,25):
        r=70*s*(1+0.15*roar)
        d.polygon([(hx+math.cos(math.radians(a))*r,hy+math.sin(math.radians(a))*r),(hx+math.cos(math.radians(a+12))*40*s,hy+math.sin(math.radians(a+12))*40*s),(hx+math.cos(math.radians(a-12))*40*s,hy+math.sin(math.radians(a-12))*40*s)],fill=(150,90,40))
    d.ellipse([hx-50*s,hy-50*s,hx+50*s,hy+50*s],fill=(150,90,40))
    d.ellipse([hx-40*s,hy-40*s,hx+40*s,hy+40*s],fill=(235,190,110))
    for ex in (-15,15): d.ellipse([hx+ex*s-5,hy-12*s-5,hx+ex*s+5,hy-12*s+5],fill=(0,0,0))
    if roar>0.3: d.ellipse([hx-16*s,hy+5*s,hx+16*s,hy+30*s],fill=(150,30,30))
    else: d.arc([hx-14*s,hy+2*s,hx+14*s,hy+22*s],0,180,fill=(0,0,0),width=3)

def redpanda(d,x,y,s=1.0,t=0,stand=0):
    c=(190,80,40)
    by=y-60*s-stand*50*s
    d.line([(x+30*s,y-30*s),(x+90*s,y-40*s+math.sin(t*5)*8)],fill=c,width=int(26*s))
    for i in range(3): d.line([(x+(45+i*15)*s,y-55*s),(x+(45+i*15)*s,y-15*s)],fill=(120,50,25),width=int(5*s))
    d.ellipse([x-35*s,by-10*s,x+35*s,y],fill=c)
    if stand>0.5:
        d.line([(x-30*s,by+10*s),(x-55*s,by-35*s)],fill=(60,30,20),width=int(12*s)); d.line([(x+30*s,by+10*s),(x+55*s,by-35*s)],fill=(60,30,20),width=int(12*s))
    hy=by-25*s
    d.ellipse([x-35*s,hy-30*s,x+35*s,hy+30*s],fill=c)
    d.ellipse([x-38*s,hy-42*s,x-15*s,hy-18*s],fill=c); d.ellipse([x+15*s,hy-42*s,x+38*s,hy-18*s],fill=c)
    d.ellipse([x-25*s,hy-5*s,x+25*s,hy+25*s],fill=(250,245,235))
    for ex in (-13,13): d.ellipse([x+ex*s-4,hy-4,x+ex*s+4,hy+4],fill=(0,0,0))
    d.ellipse([x-4,hy+10*s-3,x+4,hy+10*s+3],fill=(0,0,0))

def ballpark():
    im=sky(*DAYSKY); d=ImageDraw.Draw(im); clouds(d)
    d.rectangle([0,260,W,330],fill=(160,160,170))
    for i in range(0,W,22): d.ellipse([i,268+(i%3)*18,i+14,282+(i%3)*18],fill=random.Random(i).choice([(230,80,80),(80,120,220),(240,200,60),(250,250,250)]))
    d.rectangle([0,330,W,H],fill=(90,170,80))
    d.polygon([(640,360),(1000,520),(640,700),(280,520)],fill=(200,150,100))
    d.polygon([(640,400),(920,520),(640,650),(360,520)],fill=(90,170,80))
    for bx,by in ((640,650),(920,520),(640,400),(360,520)): d.rectangle([bx-10,by-10,bx+10,by+10],fill=(255,255,255))
    sign(d,40,40,'すぽーつせんたー やきゅうじょう',size=34,col=(20,90,40))
    d.rectangle([1050,60,1240,180],fill=(30,60,40)); d.text((1070,75),'すこあ',font=F(26),fill=(255,255,255))
    return im

def ramenshop():
    im=Image.new('RGB',(W,H),(200,160,110)); d=ImageDraw.Draw(im)
    for x in range(0,W,60): d.line([(x,0),(x,420)],fill=(180,140,95),width=3)
    d.rectangle([0,0,W,80],fill=(120,40,30))
    d.text((360,12),'らーめん がきだいしょう',font=F(54),fill=(255,230,120))
    for i,x in enumerate(range(80,W-100,180)):
        d.rectangle([x,100,x+150,180],fill=(255,250,235),outline=(120,40,30),width=3)
        d.text((x+12,122),['しょうゆ','みそ','とんこつ','しお','ぎょうざ','ちゃーはん'][i%6],font=F(26),fill=(120,40,30))
    d.rectangle([0,420,W,500],fill=(140,90,50)); d.rectangle([0,500,W,H],fill=(110,70,40))
    return im
def bowl(d,x,y,s=1.0,t=0,level=1.0,steam=True):
    if steam:
        for i in range(3):
            sx=x+(i-1)*40*s
            pts=[(sx+math.sin(t*4+i+k*0.5)*10*s,y-60*s-k*12*s) for k in range(8)]
            d.line(pts,fill=(255,255,255),width=int(4*s)+1)
    d.chord([x-100*s,y-60*s,x+100*s,y+70*s],0,180,fill=(200,40,40))
    d.ellipse([x-100*s,y-20*s,x+100*s,y+20*s],fill=(220,160,60) if level>0.05 else (230,230,230),outline=(200,40,40),width=int(6*s))
    if level>0.05:
        for k in range(int(6*level)): d.arc([x-70*s+k*18*s,y-12*s,x-10*s+k*18*s,y+10*s],0,180,fill=(250,230,150),width=int(3*s)+1)
        d.ellipse([x+30*s,y-10*s,x+60*s,y+6*s],fill=(255,255,255)); d.ellipse([x+38*s,y-6*s,x+52*s,y+2*s],fill=(240,120,150))
        d.rectangle([x-60*s,y-14*s,x-30*s,y+2*s],fill=(150,80,50))

def sogo_out():
    im=sky(*DAYSKY); d=ImageDraw.Draw(im); clouds(d)
    d.rectangle([250,80,1030,560],fill=(235,230,220)); d.rectangle([250,80,1030,120],fill=(200,190,180))
    for y in range(140,500,60):
        for x in range(280,1000,70): d.rectangle([x,y,x+45,y+40],fill=(150,180,210))
    d.rounded_rectangle([520,20,760,100],10,fill=(255,255,255),outline=(200,30,40),width=6)
    d.text((560,30),'そごう',font=F(52),fill=(200,30,40))
    d.rectangle([560,470,720,560],fill=(90,90,100))
    d.rectangle([0,560,W,H],fill=(190,185,175))
    d.text((40,600),'ちば えき の まえ',font=F(28),fill=(80,80,80))
    return im
def sogo_in():
    im=Image.new('RGB',(W,H),(245,240,232)); d=ImageDraw.Draw(im)
    d.rectangle([0,560,W,H],fill=(220,210,195))
    for x in range(0,W,80): d.line([(x,560),(x-60,H)],fill=(205,195,180),width=2)
    for sx in (30,330,980):
        d.rectangle([sx,220,sx+260,560],fill=(170,130,90))
        for r in range(3):
            d.rectangle([sx+10,240+r*105,sx+250,250+r*105],fill=(140,100,70))
            for k in range(5): d.rectangle([sx+18+k*46,262+r*105,sx+52+k*46,330+r*105],fill=random.Random(sx+r*7+k).choice([(230,90,110),(90,150,230),(250,200,70),(120,200,130),(200,120,220)]))
    d.text((360,140),'りぼん ・ ぼうし ・ おもちゃ',font=F(40),fill=(150,60,80))
    return im

def kinder():
    im=sky(*DAYSKY); d=ImageDraw.Draw(im); clouds(d)
    d.rectangle([150,200,1130,470],fill=(255,240,200)); d.polygon([(120,210),(640,90),(1160,210)],fill=(240,120,90))
    for x in range(200,1100,140): d.rectangle([x,280,x+90,380],fill=(160,210,240),outline=(255,255,255),width=4)
    d.rounded_rectangle([430,130,850,190],14,fill=(255,255,255),outline=(60,140,200),width=5)
    d.text((460,138),'こばと ようちえん',font=F(40),fill=(60,140,200))
    d.ellipse([870,140,920,180],fill=(255,255,255),outline=(120,120,120),width=2); d.polygon([(915,155),(935,160),(915,165)],fill=(250,180,60))
    d.rectangle([0,470,W,H],fill=(230,200,150))
    for i in range(5):
        fx=60+i*270; d.ellipse([fx,640,fx+18,658],fill=(240,90,120)); d.line([(fx+9,658),(fx+9,690)],fill=(60,140,60),width=3)
    return im

def kite(d,x,y,col,hx,hy,t,s=1.0,face=False):
    d.line([(hx,hy),(x,y+40*s)],fill=(90,90,90),width=2)
    d.polygon([(x,y-40*s),(x+30*s,y),(x,y+40*s),(x-30*s,y)],fill=col,outline=(60,60,60))
    pts=[(x+math.sin(t*6+k*0.8)*10*s,y+40*s+k*14*s) for k in range(7)]
    d.line(pts,fill=col,width=3)
    if face: d.text((x-12*s,y-16*s),'ら',font=F(int(26*s)),fill=(255,255,255))

def person(d,x,gy,h,col,mood,t,kid=False,wave=0,girl=False,ribbon=(230,40,60),still=False):
    hr=h*0.13; bx=x; jump=0
    if mood=='joy' and not still: jump=abs(math.sin(t*9+x))*h*0.12
    if mood=='shock': jump=max(0,math.sin(min(t,0.35)*9))*h*0.08
    gy=gy-jump; legs=gy-h*0.38
    d.line([(bx-h*0.06,legs),(bx-h*0.08,gy)],fill=(50,50,60) if not girl else (250,215,185),width=int(h*0.06))
    d.line([(bx+h*0.06,legs),(bx+h*0.08,gy)],fill=(50,50,60) if not girl else (250,215,185),width=int(h*0.06))
    top=gy-h*0.78
    if kid and not girl: d.rounded_rectangle([bx-h*0.2,top+h*0.02,bx+h*0.2,top+h*0.3],8,fill=(200,30,40) if int(x)%2 else (30,30,40))
    if girl: d.polygon([(bx-h*0.12,top),(bx+h*0.12,top),(bx+h*0.24,legs+8),(bx-h*0.24,legs+8)],fill=col)
    else: d.rounded_rectangle([bx-h*0.14,top,bx+h*0.14,legs+4],10,fill=col)
    up=mood in('shock','joy') or wave
    s=math.sin(t*12+x)*h*0.05 if (mood=='joy' or wave) else 0
    if up:
        d.line([(bx-h*0.12,top+h*0.06),(bx-h*0.28,top-h*0.18+s)],fill=col,width=int(h*0.06))
        d.line([(bx+h*0.12,top+h*0.06),(bx+h*0.28,top-h*0.18-s)],fill=col,width=int(h*0.06))
    else:
        d.line([(bx-h*0.13,top+h*0.06),(bx-h*0.18,top+h*0.34)],fill=col,width=int(h*0.06))
        d.line([(bx+h*0.13,top+h*0.06),(bx+h*0.18,top+h*0.34)],fill=col,width=int(h*0.06))
    cy=top-hr*1.05
    if girl:
        for sx in (-1,1): d.ellipse([bx+sx*hr*1.1-hr*0.35,cy-hr*0.2,bx+sx*hr*1.1+hr*0.35,cy+hr*0.9],fill=(40,30,25))
    d.ellipse([bx-hr,cy-hr,bx+hr,cy+hr],fill=(250,215,185),outline=(60,40,30),width=2)
    d.chord([bx-hr,cy-hr,bx+hr,cy+hr*0.1],180,360,fill=(40,30,25))
    if girl:
        rx,ry=bx+hr*0.6,cy-hr*0.9
        d.polygon([(rx,ry),(rx-hr*0.6,ry-hr*0.4),(rx-hr*0.6,ry+hr*0.4)],fill=ribbon); d.polygon([(rx,ry),(rx+hr*0.6,ry-hr*0.4),(rx+hr*0.6,ry+hr*0.4)],fill=ribbon)
    e=hr*0.35
    d.ellipse([bx-e-3,cy-3,bx-e+3,cy+3],fill=(0,0,0)); d.ellipse([bx+e-3,cy-3,bx+e+3,cy+3],fill=(0,0,0))
    if mood=='shock': d.ellipse([bx-hr*0.22,cy+hr*0.3,bx+hr*0.22,cy+hr*0.75],fill=(120,30,30))
    elif mood=='joy' or wave: d.chord([bx-hr*0.45,cy+hr*0.15,bx+hr*0.45,cy+hr*0.75],0,180,fill=(170,40,40))
    elif mood=='sad': d.arc([bx-hr*0.35,cy+hr*0.4,bx+hr*0.35,cy+hr*0.8],180,360,fill=(0,0,0),width=2)
    elif mood=='angry':
        d.line([(bx-e-6,cy-10),(bx-e+5,cy-5)],fill=(0,0,0),width=3); d.line([(bx+e+6,cy-10),(bx+e-5,cy-5)],fill=(0,0,0),width=3)
        d.line([(bx-hr*0.3,cy+hr*0.5),(bx+hr*0.3,cy+hr*0.5)],fill=(0,0,0),width=3)
    else: d.arc([bx-hr*0.35,cy+hr*0.2,bx+hr*0.35,cy+hr*0.55],0,180,fill=(0,0,0),width=2)
    return (bx,cy)

FUMIKA=(250,140,180)
def fumika(d,x,gy,t,mood='joy',h=135,**kw):
    return person(d,x,gy,h,FUMIKA,mood,t,kid=True,girl=True,**kw)

def put(im,x,y,scale=0.95,rot=0,flip=False,sy=1.0,sx=1.0):
    s=SPRF if flip else SPR
    w=int(s.width*scale*sx); h=int(s.height*scale*sy)
    if w<2 or h<2: return None
    t=s.resize((w,h),Image.BILINEAR)
    if rot: t=t.rotate(rot,expand=True,resample=Image.BICUBIC)
    x0,y0=int(x-t.width/2),int(y-t.height)
    im.paste(t,(x0,y0),t)
    return (x0,y0,w,h,flip)
def back_pos(bb):
    x0,y0,w,h,flip=bb
    fx=0.62 if not flip else 0.38
    return (x0+w*fx,y0+h*0.48)
def head_pos(bb):
    x0,y0,w,h,flip=bb
    fx=0.28 if not flip else 0.72
    return (x0+w*fx,y0+h*0.05)
def rider(d,bb,t):
    bx,by=back_pos(bb); fumika(d,bx,by,t,h=110,still=True,wave=1)

def bubble(im,x,y,text,size=34):
    d=ImageDraw.Draw(im); f=F(size)
    bb=d.textbbox((0,0),text,font=f); w=bb[2]-bb[0]; h=bb[3]-bb[1]
    x=max(15,min(x,W-w-30))
    d.rounded_rectangle([x-12,y-10,x+w+12,y+h+18],18,fill=(255,255,255),outline=(40,40,40),width=3)
    d.polygon([(x+16,y+h+16),(x+30,y+h+16),(x+10,y+h+36)],fill=(255,255,255),outline=(40,40,40))
    d.text((x,y),text,font=f,fill=(30,30,30))
def caption(im,text):
    d=ImageDraw.Draw(im); f=F(36)
    bb=d.textbbox((0,0),text,font=f); w=bb[2]-bb[0]
    d.rounded_rectangle([W/2-w/2-24,640,W/2+w/2+24,700],14,fill=(0,0,0))
    d.text((W/2-w/2,646),text,font=f,fill=(255,255,255))
def heart(d,x,y,s,c=(255,90,130)):
    d.ellipse([x-s,y-s,x,y],fill=c); d.ellipse([x,y-s,x+s,y],fill=c)
    d.polygon([(x-s,y-s*0.4),(x+s,y-s*0.4),(x,y+s)],fill=c)
def hearts(d,cx,t,n=8,spread=200,base=560):
    for i in range(n):
        ph=(t*0.6+i/n)%1; heart(d,cx+math.sin(i*2+t)*spread,base-ph*420,14+i%3*4)
def bigtext(d,text,y,size,col,stroke=(255,255,255)):
    f=F(size); bb=d.textbbox((0,0),text,font=f); w=bb[2]-bb[0]
    d.text((W/2-w/2,y),text,font=f,fill=col,stroke_width=6,stroke_fill=stroke)
def speedlines(d,t,col=(255,255,255)):
    for i in range(14):
        y=(i*53)%560+40; x=(W-(t*1800+i*170))%(W+300)-150
        d.line([(x,y),(x+160,y)],fill=col,width=4)

KIDCOLS=[(240,180,40),(80,160,220),(230,110,160),(120,200,120),(250,140,60),(160,120,220)]
NUMS=['いち','に','さん','よん','ご','ろく','なな','はち','きゅう','じゅう']

def title_scene(no,title):
    bgimg=sky((90,160,230),(230,240,255))
    def f(im,d,t,dur):
        im.paste(bgimg); d=ImageDraw.Draw(im)
        clouds(d,t*3)
        a=ease(t/1.2)
        put(im,W/2,H-30+int(math.sin(t*3)*8),0.9*a+0.01)
        bigtext(d,'らいこーん',30,96,(230,50,60))
        bigtext(d,f'だい{NUMS[no-1]}わ',150,44,(40,60,120))
        bigtext(d,title,210,52,(40,60,120))
    return (4,f,None)
def end_scene(text='おしまい'):
    bg=sky((70,60,150),(255,150,90))
    def f(im,d,t,dur):
        im.paste(bg); d=ImageDraw.Draw(im)
        for i in range(30):
            sx=(i*233)%W; sy=(i*137)%400
            if (i+int(t*6))%3: d.ellipse([sx,sy,sx+4,sy+4],fill=(255,255,230))
        put(im,W*0.78,300+math.sin(t*2)*10,0.25,rot=8)
        bigtext(d,text,290,76,(255,255,255),stroke=(200,60,90))
    return (3.5,f,None)

def music(path,dur,seed):
    rnd=random.Random(seed); scale=[60,62,64,67,69,72,74,76,79,81]
    notes=[]; i=rnd.randint(3,6)
    for k in range(16):
        i=max(0,min(len(scale)-1,i+rnd.choice([-2,-1,1,1,2]))); notes.append(scale[i]+12)
    sr=44100; buf=np.zeros(int(sr*dur)); beat=rnd.choice([0.26,0.3,0.34])
    for k in range(int(dur/beat)):
        n=notes[k%16]; f=440*2**((n-69)/12); s=int(k*beat*sr); L=min(int(beat*sr),len(buf)-s)
        if L<=0: break
        tt=np.arange(L)/sr; env=np.exp(-tt*6)
        buf[s:s+L]+=0.25*np.sin(2*np.pi*f*tt)*env+0.08*np.sin(4*np.pi*f*tt)*env
        if k%2==0: bf=440*2**((scale[(k//2)%4*2%len(scale)]-24-69)/12); buf[s:s+L]+=0.15*np.sin(2*np.pi*bf*tt)*np.exp(-tt*3)
    fl=int(sr*2); buf[-fl:]*=np.linspace(1,0,fl)
    buf=(buf/np.abs(buf).max()*0.8*32767).astype(np.int16)
    with wave.open(path,'w') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(buf.tobytes())

def render(scenes,out,seed,thumbs=None):
    dur=sum(s[0] for s in scenes)
    wav=out.replace('.mp4','.wav'); music(wav,dur,seed)
    cmd=['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
         '-i',wav,'-c:v','libx264','-pix_fmt','yuv420p','-crf','21','-c:a','aac','-shortest',out]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    starts=[]; acc=0
    for s in scenes: starts.append(acc); acc+=s[0]
    shots=[]
    for i in range(int(dur*FPS)):
        T=i/FPS; k=max(j for j,s0 in enumerate(starts) if s0<=T)
        sd,fn,cap=scenes[k]; t=T-starts[k]
        im=Image.new('RGB',(W,H)); d=ImageDraw.Draw(im)
        fn(im,d,t,sd)
        if cap:
            c=cap(t) if callable(cap) else cap
            if c: caption(im,c)
        if t<0.4: im=Image.blend(Image.new('RGB',(W,H)),im,t/0.4)
        if abs(t-sd*0.6)<0.5/FPS: shots.append(im.copy())
        p.stdin.write(im.tobytes())
    p.stdin.close(); p.wait()
    sheet=Image.new('RGB',(960,180*((len(shots)+2)//3)),'white')
    for j,s in enumerate(shots): sheet.paste(s.resize((320,180)),((j%3)*320,(j//3)*180))
    sheet.save(out.replace('.mp4','_sheet.png'))
    return dur
