from flask import Flask, jsonify
from flask import request
from pytube import YouTube
import cv2, eyed3, os

def get_video_length(url):

    try:
        if('youtube' in url or 'youtu.be' in url):
            yt = YouTube(url)
            video_length = yt.length
            return video_length
        if(url.startswith('/')):
            # Join Relative Path With Full Path 
            root = os.getcwd().replace('/','\\')
            
            root= [i for i in root.replace('/','\\').split('\\') if i!='']
            relative= [i for i in url.replace('/','\\').split('\\') if i!='']
            
            print(relative, '-'*5, root)
            full = []
            for i in range(len(relative)):
                try:
                    intersect = root.index(relative[i])
                    full = root[:intersect]+relative[i:]
                except Exception as e:
                    pass
            if(full):
                url = '\\'.join(full)
                print(url)
                duration = int(eyed3.load(url).info.time_secs)+1
                return duration
            return 0
        data = cv2.VideoCapture(url) 
        fps = data.get(cv2.CAP_PROP_FPS)
        frame_count = data.get(cv2.CAP_PROP_FRAME_COUNT)
        video_length = int(frame_count//fps) + 1
        return video_length
    except Exception as e:
        return 0

app = Flask(__name__)
# app.config['CORS_HEADERS'] = 'Content-Type'



@app.route("/", methods=["POST"])
def hello_world():
    print(request.get_json())
    url = request.get_json()['url']
    l = {'Length': get_video_length(url)}    
    return  jsonify(l)#0 #get_video_length(url)