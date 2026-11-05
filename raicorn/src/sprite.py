import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd
src=Image.open('../../images/1.jpg').convert('RGB')
a=np.asarray(src).astype(float)
lum=a.mean(-1)
bg=nd.maximum_filter(nd.uniform_filter(lum,41),41)
norm=np.clip(a/np.maximum(bg[...,None],1)*255*1.04,0,255)
# whiten near-white
norm=np.where(norm.min(-1,keepdims=True)>200,255,norm)
img=Image.fromarray(norm.astype(np.uint8))
poly=[(150,90),(260,40),(400,0),(800,0),(815,250),(800,440),(830,450),(650,540),(1126,350),(1126,860),(1030,960),(1060,1000),(1000,1190),(1126,1260),(1120,1300),(1000,1310),(930,1390),(800,1395),(330,1320),(215,1280),(205,1170),(250,1110),(365,1070),(360,880),(260,830),(190,820),(70,760),(20,620),(60,540),(30,520),(50,210),(130,230)]
m=Image.new('L',src.size,0); ImageDraw.Draw(m).polygon(poly,fill=255)
m=m.filter(ImageFilter.GaussianBlur(3))
img.putalpha(m)
img=img.crop((15,0,1126,1400))
img.save('raicorn.png')
# preview on gray
p=Image.new('RGB',img.size,(120,160,200)); p.paste(img,(0,0),img); p.resize((p.width//2,p.height//2)).save('preview.png')
