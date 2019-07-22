import requests
import flask

def cors_proxy(request):

    if request.method == 'OPTIONS':
        response = flask.Response()
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Headers', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST')
        return (response)

    request_json = request.get_json()

    if request.args and 'url' in request.args and 'token' in request.args:
        url = request.args['url']
        token = request.args['token']
        response = requests.get(url, headers={'Authorization': token})
        response = response.json()

        response = flask.jsonify(response)
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Headers', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST')
        return response

    else:
        return '500'
