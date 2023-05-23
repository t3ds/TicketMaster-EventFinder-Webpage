from flask import Flask,request,render_template
from flask_cors import CORS
import json
import requests
from geolib import geohash
import sys

app = Flask(__name__, static_url_path = "/static/", static_folder= 'static/')
CORS(app)
apikey = '' ##ADD OWN APIKEY
ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/"

@app.route('/')
def index():

    return Flask.send_static_file(app,'events.html')

@app.route('/tmdetails', methods = ['GET'])
def get_event_details():

    segments = {
        "music": "KZFzniwnSyZfZ7v7nJ",
        "sports": "KZFzniwnSyZfZ7v7nE",
        "arts": "KZFzniwnSyZfZ7v7na",
        "film": "KZFzniwnSyZfZ7v7nn",
        "miscellaneous": "KZFzniwnSyZfZ7v7n1"
    }

    coords = request.args.get('point').split(',')
    #print(request.args.get('point'), file=sys.stderr)
    #print(request.args.get('keyword'), file=sys.stderr)
    #print(request.args.get('category'), file=sys.stderr)
    #print(coords, file=sys.stderr)

    geopoint = geohash.encode(coords[0],coords[1],7)

    
    uri = f"{ticketmasterURL}events.json?apikey={apikey}&keyword={request.args.get('keyword')}&segmentID={segments.get(request.args.get('category'),'')}\
        &radius={request.args.get('distance')}&unit=miles&geoPoint={geopoint}"
    
    

    try:
        data = requests.get(uri)
    except requests.ConnectionError:
        return "Connection Error"

    return data.json()
    #return json.loads(data.text)

    #print(data)

@app.route('/venueinfo', methods = ['GET'])

def venueinfo():

    uri = f"{ticketmasterURL}/venues?apikey={apikey}&keyword={request.args.get('id')}"
    print(uri)
    try:
        data = requests.get(uri)
    except requests.ConnectionError:
       return "Connection Error"

    return data.json()

@app.route('/eventinfo', methods = ['GET'])

def eventinfo():

    uri = f"{ticketmasterURL}/events/{request.args.get('id')}?apikey={apikey}"
    
    try:
        data = requests.get(uri)
    except requests.ConnectionError:
       return "Connection Error"

    return data.json()

if __name__ == "__main__":
    app.run(debug=True)