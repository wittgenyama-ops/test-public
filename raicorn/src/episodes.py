from lib import *
import sys
DAY=town(); EVE=town(True)
ADULTS=[(300,(60,70,110)),(470,(150,60,60)),(1080,(70,110,80)),(1180,(120,100,60))]
KIDS=[(120,KIDCOLS[0]),(260,KIDCOLS[1]),(1000,KIDCOLS[2]),(1150,KIDCOLS[3]),(1240,KIDCOLS[4])]
def T(s): return lambda t:s
def seq(*pairs):
    def c(t):
        r=None
        for t0,s in pairs:
            if t>=t0: r=s
        return r
    return c

# ---------- 1
def ep1():
    def a(im,d,t,dur):
        im.paste(DAY); d=ImageDraw.Draw(im); train(d,int(-500+t*230))
        x=lerp(W+250,W*0.55,ease(t/8)); put(im,x,H-130-abs(math.sin(t*5))*14,rot=math.sin(t*5)*3)
    def b(im,d,t,dur):
        im.paste(DAY); d=ImageDraw.Draw(im); train(d,int(W-t*200))
        put(im,W*0.55,H-130-abs(math.sin(t*3))*6)
        for x,c in ADULTS: person(d,x+(-1 if x<640 else 1)*min(t,1)*25,660,190,c,'shock',t)
        if t>0.5: bubble(im,230,150,'えええっ！？')
        if t>1.5: bubble(im,1010,170,'なにあれ！？')
        if t>2.5: bubble(im,420,250,'らいおん…？ゆにこーん…？',28)
        for i in range(4): d.text((ADULTS[i][0]+30,410+int(math.sin(t*10+i)*6)),'！',font=F(60),fill=(230,40,40))
    def c(im,d,t,dur):
        im.paste(DAY); d=ImageDraw.Draw(im)
        put(im,W*0.55,H-130-abs(math.sin(t*4))*16,rot=math.sin(t*4)*4)
        for x,col in KIDS: person(d,x+(W*0.55-x)*0.35*ease(t/2),665,130,col,'joy',t,kid=True)
        hearts(d,W*0.55,t)
        if t>0.6: bubble(im,60,240,'らいこーんだ！！')
        if t>1.8: bubble(im,960,230,'かっこいい〜！')
        if t>3.2: bubble(im,500,90,'いっしょに あそぼう！')
    SUN=sky((70,60,150),(255,150,90))
    def e(im,d,t,dur):
        if t<3:
            im.paste(EVE); d=ImageDraw.Draw(im)
            put(im,W*0.55,H-130,sy=1+math.sin(t*14)*0.05*ease(t/1.5))
            for x,col in KIDS: person(d,x,665,130,col,'joy',t,kid=True,wave=1)
            if t>0.4: bubble(im,80,240,'つばさを ひろげた！')
        else:
            u=t-3; im.paste(SUN); d=ImageDraw.Draw(im); off=int(u*90)
            for i,x in enumerate(range(-40,W+200,170)):
                hh=160+(i*37)%170
                if H-hh*0.6+off<H: d.rectangle([x,H-hh*0.6+off,x+130,H],fill=(60,50,80))
            for i in range(12):
                cx=(i*170+u*300)%(W+300)-150; cy=100+(i*97)%450; d.ellipse([cx,cy,cx+160,cy+40],fill=(255,200,170))
            sc=max(0.08,0.95-u*0.16); x=W*0.5+u*60; y=H-80-u*95
            put(im,x,y+sc*BASE_H/2,sc,rot=10+math.sin(u*8)*6,sy=1+math.sin(u*14)*0.06)
    return [title_scene(1,'あながわを あるく'),
            (9,a,seq((0,'あるひ、ちばけんの あながわに…'),(4,'ふしぎな「らいこーん」が あらわれた！'))),
            (7,b,T('おとなたちは びっくり！')),
            (9,c,T('でも こどもたちは おおよろこび！')),
            (9,e,seq((0,'らいこーんは おおきな つばさを ひろげて…'),(3,'おおぞらへ とびたっていった！'))),
            end_scene('またね、らいこーん！')]

# ---------- 2 fumika
def ep2():
    RAIN=town(False); RAIN=Image.blend(RAIN,Image.new('RGB',(W,H),(90,95,110)),0.45)
    def rain(d,t):
        for i in range(90):
            x=(i*137+t*120)%W; y=(i*71+t*900)%H; d.line([(x,y),(x-8,y+24)],fill=(200,210,230),width=2)
    def a(im,d,t,dur):
        im.paste(RAIN); d=ImageDraw.Draw(im)
        put(im,W*0.6,H-120,sy=0.92)
        rain(d,t)
        for x,c in ((250,(60,70,110)),(400,(150,60,60))):
            person(d,x-t*60,660,190,c,'shock',t)
        if t>1.5: bubble(im,700,170,'くすん… だれも あそんで くれない…',30)
    def b(im,d,t,dur):
        im.paste(RAIN); d=ImageDraw.Draw(im)
        put(im,W*0.6,H-120,sy=0.92)
        fx=lerp(-80,420,ease(t/3)); hx,hy=fumika(d,fx,665,t,mood='smile')
        d.chord([hx-90,hy-90,hx+90,hy+40],180,360,fill=(250,200,60)); d.line([(hx,hy-40),(hx,hy+30)],fill=(80,80,80),width=4)
        rain(d,t)
        if t>3.2: bubble(im,200,200,'だいじょうぶ？ ぬれちゃうよ。')
    SUNNY=town(False)
    def c(im,d,t,dur):
        im.paste(SUNNY); d=ImageDraw.Draw(im)
        for i in range(10):
            a_=math.radians(i*36+t*20); d.line([(1150,90),(1150+math.cos(a_)*90,90+math.sin(a_)*90)],fill=(255,220,80),width=6)
        d.ellipse([1110,50,1190,130],fill=(255,220,80))
        bb=put(im,W*0.6,H-130-abs(math.sin(t*3))*8)
        hx,hy=fumika(d,420,665,t,mood='joy',still=True)
        # candy
        d.ellipse([480,520,510,550],fill=(255,120,160)); d.polygon([(480,535),(465,525),(465,545)],fill=(255,120,160)); d.polygon([(510,535),(525,525),(525,545)],fill=(255,120,160))
        if t>0.5: bubble(im,150,180,'わたし、ふみか！ これ あげる！')
        if t>3: bubble(im,820,120,'ありがとう！ らいこーん だよ！')
    def e(im,d,t,dur):
        im.paste(SUNNY); d=ImageDraw.Draw(im); train(d,int(-500+t*200))
        x=lerp(W+200,W*0.45,ease(t/4)); bb=put(im,x,H-130-abs(math.sin(t*5))*12,rot=math.sin(t*5)*3)
        rider(d,bb,t); hearts(d,x,t)
        if t>2: bubble(im,80,230,'わたしたち、おともだち だね！')
    return [title_scene(2,'ふみかちゃんと おともだち'),
            (8,a,T('あめの ひ。らいこーんは ひとりぼっち…')),
            (7,b,T('そこへ かさを さした おんなのこが やってきた')),
            (8,c,T('おんなのこの なまえは「ふみかちゃん」')),
            (8,e,T('ふたりは なかよしの おともだちに なった！')),
            end_scene()]

# ---------- 3 monorail race
WIDE=town(False,w=W*4,signtext=None,seed=7)
def ep3():
    def a(im,d,t,dur):
        im.paste(DAY); d=ImageDraw.Draw(im); train(d,620,faces=True,t=t)
        bb=put(im,W*0.3,H-130,flip=True); rider(d,bb,t)
        if t>0.5: bubble(im,700,300,'ものれーるさん、きょうそう しよう！',30)
        if t>3: bigtext(d,'よーい…',380 if t<5 else 380,90,(230,50,60)) if t<5 else bigtext(d,'どん！！',380,110,(230,50,60))
    def b(im,d,t,dur):
        off=int((t*700)%(W*3)); im.paste(WIDE.crop((off,0,off+W,H))); d=ImageDraw.Draw(im)
        tx=620+math.sin(t*0.8)*160; train(d,int(tx),faces=True,t=t)
        rx=W*0.35+math.sin(t*0.8+1.5)*120
        bb=put(im,rx,H-120-abs(math.sin(t*12))*25,flip=True,rot=-6); rider(d,bb,t)
        speedlines(d,t)
        if 1<t<4: bubble(im,int(tx)+60,290,'まけないぞー！',30)
        if t>4.5: bubble(im,80,200,'がんばれ らいこーん！',30)
    def c(im,d,t,dur):
        off=int((t*900)%(W*3)); im.paste(WIDE.crop((off,0,off+W,H))); d=ImageDraw.Draw(im)
        train(d,int(lerp(620,820,ease(t/2))),faces=True,t=t)
        y=H-120-ease((t-1.5)/1.5)*200 if t>1.5 else H-120
        bb=put(im,lerp(W*0.3,W*0.62,ease((t-1.5)/3)),y,flip=True,rot=-12); rider(d,bb,t)
        speedlines(d,t,(255,240,150))
        if t<1.5: bubble(im,80,200,'ものれーる はやい〜！',30)
        elif t>2: bubble(im,80,200,'つばさで びゅーん！',30)
    def e(im,d,t,dur):
        im.paste(DAY); d=ImageDraw.Draw(im)
        d.rectangle([700,170,712,600],fill=(255,255,255)); d.rectangle([1000,170,1012,600],fill=(255,255,255))
        for i in range(10): d.rectangle([712+i*29,300,741+i*29,320],fill=(230,50,60) if i%2 else (255,255,255))
        train(d,610,faces=True,t=t); bb=put(im,860,H-120,flip=True); rider(d,bb,t)
        bigtext(d,'ひきわけ！',60,80,(230,50,60))
        if t>1.5: bubble(im,80,330,'たのしかったね！ また きょうそう しよう！',28)
        hearts(d,860,t,n=6)
    return [title_scene(3,'ものれーると きょうそう'),
            (6.5,a,T('ふみかちゃんを せなかに のせて、えきへ')),
            (8,b,T('ものれーると らいこーん、ならんで はしる！')),
            (7,c,seq((0,'ものれーるが どんどん はやくなる…'),(1.6,'らいこーんは つばさを ひろげて ぐいーん！'))),
            (7,e,T('ごーるは どうじ！ おきゃくさんも はくしゅ！')),
            end_scene()]

# ---------- 4 tendai park
def ep4():
    P=park(); 
    def a(im,d,t,dur):
        im.paste(P); d=ImageDraw.Draw(im); slide(d)
        bb=put(im,lerp(-200,500,ease(t/3)),H-110-abs(math.sin(t*5))*12,flip=True); 
        fumika(d,lerp(-350,330,ease(t/3)),665,t)
        if t>3: bubble(im,150,180,'すべりだい だ！ やってみよう！')
    def b(im,d,t,dur):
        im.paste(P); d=ImageDraw.Draw(im); slide(d)
        fumika(d,300,665,t,mood='joy')
        if t<2: put(im,836,330,0.45); bubble(im,880,120,'よいしょ… せまい〜',28)
        else:
            u=clamp((t-2)/1.2); x,y=SLIDE_PATH(u)
            if t>3.2: x=1140+(t-3.2)*60; y=600
            put(im,x,y+20,0.45,rot=-30 if u<1 else 0)
            if t>2.2: bigtext(d,'びゅーーん！',150,80,(230,50,60))
            if t>3.6: bubble(im,850,250,'もう いっかい！',30)
    def c(im,d,t,dur):
        im.paste(P); d=ImageDraw.Draw(im)
        n=1+min(4,int(t/1.4))
        tilt=lerp(22,22-n*8,1) if n<4 else math.sin(t*3)*8
        cx,cy=700,560; L=420; a_=math.radians(tilt)
        lx,ly=cx-L*math.cos(a_),cy+L*math.sin(a_); rx,ry=cx+L*math.cos(a_),cy-L*math.sin(a_)
        d.polygon([(cx-30,600),(cx+30,600),(cx,cy)],fill=(150,100,60))
        d.line([(lx,ly),(rx,ry)],fill=(240,180,40),width=18)
        put(im,lx+70,ly+10,0.55,flip=True)
        for k in range(n):
            px=rx-30-k*60; py=ry+(k*60)*math.sin(a_)
            if k==0: fumika(d,px,py,t,h=110,still=True,wave=1)
            else: person(d,px,py,100,KIDCOLS[k],'joy',t,kid=True,still=True)
        if t<1.4: bubble(im,820,140,'らいこーん、おもすぎ〜！',30)
        elif n<4: bubble(im,850,140,'みんな のって〜！',30)
        else: bubble(im,820,140,'ぎったん ばっこん！',32); bigtext(d,'ちょうど いい！',60,60,(40,120,60))
    E=park(True)
    def e(im,d,t,dur):
        im.paste(E); d=ImageDraw.Draw(im)
        bb=put(im,W*0.55,H-110); rider(d,bb,t)
        for k in range(3): person(d,200+k*120,665,110,KIDCOLS[k+1],'joy',t,kid=True,wave=1)
        if t>1: bubble(im,100,200,'また あそぼうね〜！',32)
    return [title_scene(4,'てんだいこうえんで あそぶ'),
            (6,a,T('きょうは てんだいこうえんに やってきた')),
            (6.5,b,seq((0,'すべりだいは らいこーんには ちょっと せまい？'),(2,'でも すべったら おおはやさ！'))),
            (8,c,seq((0,'しーそーは らいこーんが おもくて うごかない'),(4.2,'こどもたちが みんなで のったら ちょうど いい！'))),
            (6,e,T('ゆうやけ まで たくさん あそんだよ')),
            end_scene()]

# ---------- 5 zoo
def ep5():
    Z=zoo()
    def a(im,d,t,dur):
        im.paste(Z); d=ImageDraw.Draw(im)
        redpanda(d,250,520,1.0,t,stand=1 if t>2 else 0)
        bb=put(im,lerp(W+200,850,ease(t/3)),H-100,0.85); rider(d,bb,t)
        if t>2.5: bubble(im,120,250,'れっさーぱんだが たった！',30)
    def b(im,d,t,dur):
        im.paste(Z); d=ImageDraw.Draw(im)
        roar=abs(math.sin(t*3))
        lion(d,300,560,1.1,t,roar=roar if t>1 else 0)
        put(im,900+math.sin(t*20)*6*(t>3),H-100,0.85,sx=1+0.06*(t>3)*abs(math.sin(t*3)))
        if t>0.8: bubble(im,120,160,'がおー！ たてがみは おれが いちばん！',28)
        if t>3: bubble(im,720,90,'ぼくの ほうが かっこいい！ らいこーん！',28)
        if t>3: 
            for k in range(5): d.text((560+k*30,330+math.sin(t*15+k)*20),'⚡' if False else 'ぷん',font=F(30),fill=(230,40,40))
    def c(im,d,t,dur):
        im.paste(Z); d=ImageDraw.Draw(im)
        cx=640; 
        for k in range(10):
            a_=t*8+k; d.ellipse([cx+math.cos(a_)*160-60,500+math.sin(a_)*60-60,cx+math.cos(a_)*160+60,500+math.sin(a_)*60+60],fill=(235,225,200))
        bigtext(d,'どたばた どたばた！',150,70,(150,80,20))
        redpanda(d,1050,600,0.9,t)
        if t>3: fumika(d,260,665,t,mood='angry'); bubble(im,80,250,'けんか しちゃ だめー！')
    def e(im,d,t,dur):
        im.paste(Z); d=ImageDraw.Draw(im)
        lion(d,330,560,1.1,t); put(im,860,H-100,0.85); fumika(d,600,665,t)
        redpanda(d,1150,600,0.8,t,stand=1)
        if t>0.6: bubble(im,100,170,'ごめんね。',32)
        if t>1.8: bubble(im,760,100,'ぼくも ごめんね！',32)
        if t>3: bigtext(d,'なかなおり！',40,70,(230,90,130))
        hearts(d,640,t,n=6,spread=300)
    return [title_scene(5,'どうぶつこうえんで けんか'),
            (6.5,a,T('ちばし どうぶつこうえんに あそびに きたよ')),
            (7.5,b,seq((0,'らいおんさんと らいこーん、どっちが かっこいい？'),(3,'ふたりは けんかを はじめた！'))),
            (7,c,seq((0,'どたばた どたばた！'),(3,'ふみかちゃんが とめに はいった'))),
            (7,e,T('ちゃんと あやまって、なかなおり！')),
            end_scene()]

# ---------- 6 baseball
def ep6():
    B=ballpark()
    def a(im,d,t,dur):
        im.paste(B); d=ImageDraw.Draw(im)
        for k,(x,y) in enumerate(((920,560),(640,440),(360,560),(800,470))): person(d,x,y,110,KIDCOLS[k],'smile',t,kid=True)
        bb=put(im,lerp(-150,500,ease(t/3)),H-40,0.75,flip=True); fumika(d,lerp(-300,330,ease(t/3)),700,t)
        if t>2.5: bubble(im,700,320,'いっしょに やきゅう しよう！',30)
    def b(im,d,t,dur):
        im.paste(B); d=ImageDraw.Draw(im)
        person(d,640,450,110,KIDCOLS[1],'smile',t,kid=True)
        bb=put(im,560,H-20,0.75)
        bx,by=bb[0]+bb[2]*0.95,bb[1]+bb[3]*0.85
        sw=-60+ease((t-2.5)/0.3)*150 if t>2.5 else -60
        a_=math.radians(sw); d.line([(bx,by),(bx+math.cos(a_)*130,by-math.sin(a_)*130)],fill=(150,100,50),width=14)
        if t<2.6:
            u=clamp((t-1)/1.6); d.ellipse([lerp(640,bx+60,u)-9,lerp(420,by-40,u)-9,lerp(640,bx+60,u)+9,lerp(420,by-40,u)+9],fill=(255,255,255),outline=(200,0,0))
        else:
            u=t-2.6; x=bx+60-u*380; y=by-40-u*500+u*u*60
            d.ellipse([x-9,y-9,x+9,y+9],fill=(255,255,255),outline=(200,0,0))
            bigtext(d,'かきーん！',150,90,(230,50,60))
        if t<1: bubble(im,800,250,'しっぽで うつよ！',30)
    def c(im,d,t,dur):
        im.paste(B); d=ImageDraw.Draw(im)
        bigtext(d,'ほーむらん！',80,100,(230,50,60))
        u=ease(t/4); pts=[(640,650),(920,520),(640,400),(360,520),(640,650)]
        seg=min(3.999,u*4); i=int(seg); f=seg-i
        x=lerp(pts[i][0],pts[i+1][0],f); y=lerp(pts[i][1],pts[i+1][1],f)
        bb=put(im,x,y+60,0.5,flip=pts[i+1][0]>pts[i][0])
        for k in range(5): person(d,150+k*230,700,100,KIDCOLS[k],'joy',t,kid=True)
        fumika(d,1200,700,t)
    def e(im,d,t,dur):
        im.paste(B); d=ImageDraw.Draw(im)
        u=t; x=lerp(1100,700,ease(u/2)); y=lerp(130,200,ease(u/2))
        if t<2.2: d.ellipse([x-10,y-10,x+10,y+10],fill=(255,255,255),outline=(200,0,0))
        ry=lerp(H-20,330,ease(t/2)) if t<2.2 else lerp(330,H-20,ease((t-2.5)/1.5))
        bb=put(im,700,ry,0.6,rot=8)
        if t>2.2: bigtext(d,'きゃっち！',80,90,(40,120,60))
        for k in range(4): person(d,200+k*260,700,100,KIDCOLS[k+1],'joy' if t>2.2 else 'shock',t,kid=True)
        if t>3: bubble(im,80,280,'らいこーん、すごーい！',30)
    return [title_scene(6,'やきゅうを する'),
            (6,a,T('すぽーつせんたーの やきゅうじょうに きたよ')),
            (6,b,seq((0,'らいこーんの だばん！'),(2.6,'しっぽで ぼーるを かっとばした！'))),
            (6,c,T('だいやもんどを ぐるっと いっしゅう！')),
            (6.5,e,seq((0,'こんどは しゅびだ。たかい ふらいが とんできた！'),(2.2,'つばさで とんで ないすきゃっち！'))),
            end_scene()]

# ---------- 7 ramen
def ep7():
    R=ramenshop()
    def a(im,d,t,dur):
        im.paste(R); d=ImageDraw.Draw(im)
        person(d,1050,520,200,(250,250,250),'shock' if t>1.5 else 'smile',t)
        d.rectangle([985,330,1115,350],fill=(250,250,250))
        bb=put(im,lerp(-200,480,ease(t/2.5)),H-20,0.9,flip=True); fumika(d,lerp(-350,220,ease(t/2.5)),700,t)
        if t>1.5: bubble(im,820,160,'い、いらっしゃいませ〜！？',30)
        if t>3: bubble(im,150,200,'おなか ぺこぺこ〜！',30)
    def b(im,d,t,dur):
        im.paste(R); d=ImageDraw.Draw(im)
        bb=put(im,700,H-30,1.0)
        bowl(d,560,480,1.4,t,level=1-clamp((t-2)/4))
        if t>1: bigtext(d,'ずるずる〜！',110,80,(150,60,20))
        fumika(d,200,700,t,still=True); bowl(d,200,520,0.6,t)
        if t>2.5: bubble(im,880,170,'おいしい〜！',34)
    def c(im,d,t,dur):
        im.paste(R); d=ImageDraw.Draw(im)
        bb=put(im,700,H-30,1.0)
        s=lerp(1.4,3.0,ease((t-1.5)/1.5)) if t>1.5 else 1.4
        bowl(d,560,560 if t>1.5 else 480,s,t,level=1 if t>1.5 else 0)
        if t<1.5: bubble(im,850,160,'おかわり！',40)
        else:
            bigtext(d,'とくもり！',90,90,(230,50,60)); person(d,1150,620,190,(250,250,250),'joy',t)
    def e(im,d,t,dur):
        im.paste(R); d=ImageDraw.Draw(im)
        put(im,700,H-30,1.0,sx=1.12)
        bowl(d,560,480,1.4,t,level=0,steam=False); fumika(d,250,700,t)
        if t>0.5: bubble(im,800,150,'ごちそうさまでした！',34)
        if t>2: bubble(im,80,230,'おなか ぱんぱん だね！',30)
    return [title_scene(7,'らーめんを たべる'),
            (6,a,T('やきゅうの あとは、らーめん がきだいしょうへ！')),
            (7,b,T('あつあつの らーめんを ずるずる〜')),
            (6,c,T('おかわりは ばけつ みたいな とくもりだ！')),
            (5.5,e,T('ぜんぶ たべて、おなか いっぱい！')),
            end_scene()]

# ---------- 8 sogo
def ep8():
    O=sogo_out(); I=sogo_in()
    def a(im,d,t,dur):
        im.paste(O); d=ImageDraw.Draw(im)
        bb=put(im,lerp(W+200,850,ease(t/3)),H-20,0.75); rider(d,bb,t)
        if t>3: bubble(im,150,250,'おおきな でぱーとだね！',30)
    def b(im,d,t,dur):
        im.paste(I); d=ImageDraw.Draw(im)
        d.polygon([(560,620),(640,620),(1100,200),(1020,200)],fill=(180,180,190)); d.line([(560,600),(1020,180)],fill=(60,60,70),width=10)
        u=ease(t/5); x=lerp(620,1060,u); y=lerp(640,220,u)
        bb=put(im,x,y,0.5,rot=20); rider(d,bb,t)
        person(d,250,650,190,(60,70,110),'shock',t)
        if t>1: bubble(im,80,180,'えすかれーたーに らいこーんが！？',28)
    def c(im,d,t,dur):
        im.paste(I); d=ImageDraw.Draw(im)
        bb=put(im,800,H-40,0.85)
        hx,hy=head_pos(bb)
        hats=[(250,200,70),(90,150,230),(230,90,110)]; k=min(2,int(t/1.8))
        col=hats[k]; d.ellipse([hx-90,hy+20,hx+90,hy+60],fill=col); d.rectangle([hx-50,hy-50,hx+50,hy+40],fill=col); d.rectangle([hx-50,hy+15,hx+50,hy+30],fill=(255,255,255))
        fumika(d,300,690,t,mood='joy',still=True)
        if k<2: bubble(im,150,230,['きいろも いいね！','あおも いいね！'][k],30)
        else: bubble(im,150,230,'あかが いちばん にあう！',30)
    def e(im,d,t,dur):
        im.paste(I); d=ImageDraw.Draw(im)
        bb=put(im,820,H-40,0.85); hx,hy=head_pos(bb)
        col=(230,90,110); d.ellipse([hx-90,hy+20,hx+90,hy+60],fill=col); d.rectangle([hx-50,hy-50,hx+50,hy+40],fill=col); d.rectangle([hx-50,hy+15,hx+50,hy+30],fill=(255,255,255))
        rb=(240,170,40) if t>2 else (230,40,60)
        fumika(d,330,690,t,mood='joy',ribbon=rb)
        if t<2: 
            d.rectangle([540,520,600,570],fill=(255,240,120)); d.rectangle([566,520,574,570],fill=(230,40,60))
            bubble(im,600,160,'ふみかちゃんに ぷれぜんと！',30)
        else: bubble(im,100,230,'きんいろの りぼん！ ありがとう！',30); hearts(d,500,t,n=6)
    return [title_scene(8,'そごうで おかいもの'),
            (6,a,T('ちばえきの まえの「そごう」に やってきた')),
            (6.5,b,T('えすかれーたーで うえの かいへ')),
            (6,c,T('ぼうしやさんで おしゃれ しよう！')),
            (7,e,T('ふみかちゃんにも すてきな ぷれぜんと')),
            end_scene()]

# ---------- 9 kindergarten
def ep9():
    K=kinder()
    def a(im,d,t,dur):
        im.paste(K); d=ImageDraw.Draw(im)
        bb=put(im,lerp(W+200,820,ease(t/3)),H-30,0.75)
        for k in range(5): person(d,100+k*110,690,100,KIDCOLS[k],'joy' if t>2 else 'shock',t,kid=False)
        person(d,620,690,180,(240,160,120),'smile',t)
        if t>2: bubble(im,80,280,'らいこーん せんせい だー！',30)
    def b(im,d,t,dur):
        im.paste(K); d=ImageDraw.Draw(im)
        x=W/2+math.sin(t*1.2)*400; flip=math.cos(t*1.2)>0
        bb=put(im,x,H-30-abs(math.sin(t*6))*20,0.7,flip=flip)
        for k in range(6):
            kx=x-(1 if flip else -1)*(250+k*90)+math.sin(t*3+k)*20
            person(d,kx,695,100,KIDCOLS[k],'joy',t)
        bigtext(d,'まて まて〜！',120,70,(230,90,60))
    def c(im,d,t,dur):
        im.paste(K); d=ImageDraw.Draw(im)
        bb=put(im,700,H-40-abs(math.sin(t*2))*30,0.8)
        bx,by=back_pos(bb)
        for k in range(3): person(d,bx-60+k*50,by,90,KIDCOLS[k],'joy',t,still=True,wave=1)
        for k in range(3): person(d,180+k*130,695,100,KIDCOLS[k+3],'joy',t)
        if t>1: bubble(im,80,230,'たかーい！ もっと のせて〜！',30)
    def e(im,d,t,dur):
        im.paste(K); d=ImageDraw.Draw(im)
        d.rectangle([250,250,1030,600],fill=(255,255,255),outline=(120,90,60),width=8)
        pic=SPR.resize((int(SPR.width*0.7),int(SPR.height*0.7)))
        n=min(3,1+int(t/1.5))
        for k in range(n):
            im.paste(pic.rotate(k*6-6,expand=True),(300+k*240,280),pic.rotate(k*6-6,expand=True))
        d=ImageDraw.Draw(im)
        for k in range(4): person(d,150+k*330,710,100,KIDCOLS[k],'joy',t)
        if t>2.5: bubble(im,300,130,'みんなで らいこーんの え を かいたよ！',30)
    return [title_scene(9,'こばとようちえんで あそぶ'),
            (6,a,T('きょうは こばと ようちえんへ おでかけ')),
            (6.5,b,T('えんじの みんなと おにごっこ！')),
            (6,c,T('せなかに のって おうまさん ごっこ')),
            (6.5,e,T('さいごは みんなで らいこーんの え を かいた')),
            end_scene()]

# ---------- 10 kites
def ep10():
    P=park(name='ちばこうえん',pond=True); E=park(True,name='ちばこうえん',pond=True)
    def a(im,d,t,dur):
        im.paste(P); d=ImageDraw.Draw(im)
        bb=put(im,lerp(W+200,900,ease(t/3)),H-40,0.8); rider(d,bb,t)
        if t>2.5: bubble(im,150,230,'きょうは みんなで たこあげ だよ！',30)
    def b(im,d,t,dur):
        im.paste(P); d=ImageDraw.Draw(im)
        hx,hy=fumika(d,300,690,t,still=True)
        u=ease(t/3) if t<1.5 else 0.15
        if t<2.5: y=lerp(560,430,ease(t/2.5)); kite(d,380,y+math.sin(t*9)*30,(230,60,80),hx+20,hy+30,t)
        else:
            u=ease((t-2.5)/2); kite(d,lerp(380,780,u),lerp(430,120,u),(230,60,80),hx+20,hy+30,t)
        put(im,lerp(1000,800,ease(t/3)),H-60-(abs(math.sin(t*8))*20 if t>1.5 else 0),0.7)
        if t<2.5: bubble(im,80,210,'あれれ、あがらない…',30)
        else: bubble(im,820,140,'つばさで ばっさ ばっさ！',30); speedlines(d,t)
    def c(im,d,t,dur):
        im.paste(P); d=ImageDraw.Draw(im)
        cols=[(230,60,80),(80,140,230),(250,200,60),(120,200,120),(200,120,220)]
        for k in range(5):
            gx=140+k*140; gy=690
            if k==0: hx,hy=fumika(d,gx,gy,t,still=True)
            else: hx,hy=person(d,gx,gy,100,KIDCOLS[k],'joy',t,still=True)
            kite(d,200+k*200+math.sin(t*1.5+k)*30,120+(k%3)*70+math.sin(t*2+k)*20,cols[k],hx+15,hy+25,t,face=k==0)
        put(im,1080,H-60,0.7)
        if t>1: bubble(im,820,110,'そらが にぎやかだね！',30)
    def e(im,d,t,dur):
        im.paste(E); d=ImageDraw.Draw(im)
        for k in range(5):
            if k==0: fumika(d,200+k*160,690,t,wave=1)
            else: person(d,200+k*160,690,100,KIDCOLS[k],'joy',t,wave=1)
        sc=0.6-0.25*ease(t/4); x=lerp(900,950,ease(t/4)); y=lerp(H-80,380,ease(t/4))
        put(im,x,y,sc,rot=8,sy=1+math.sin(t*14)*0.05)
        if t>1.5: bubble(im,80,180,'らいこーん、だいすき！',32)
        if t>3: bubble(im,780,100,'みんな だいすき！ また あそぼうね！',28)
    return [title_scene(10,'ちばこうえんで たこあげ'),
            (6,a,T('さいごの おはなし。ちばこうえんに みんなで あつまった')),
            (7.5,b,seq((0,'ふみかちゃんの たこが なかなか あがらない'),(2.5,'らいこーんが つばさで かぜを おこした！'))),
            (6.5,c,T('みんなの たこが おおぞらに いっぱい！')),
            (7,e,T('これからも みんな ずっと おともだち')),
            end_scene('おしまい')]

EPS=[ep1,ep2,ep3,ep4,ep5,ep6,ep7,ep8,ep9,ep10]
if __name__=='__main__':
    for n in map(int,sys.argv[1:]):
        dur=render(EPS[n-1](),f'out/raicorn_{n:02d}.mp4',seed=n*11)
        print(n,round(dur,1))
