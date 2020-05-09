import requests
import flask

def main(request):

    # handle cors preflight request
    if request.method == 'OPTIONS':
        response = flask.Response()
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Headers', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST')
        return response


    ### main function ###

    if request.args and 'type' in request.args and 'token' in request.args:

        response = None

        if request.args['type'] == "getUserId":
            url = "https://seminar.minerva.kgi.edu/api/v1/outcome-index-item?hc-item=3976"
            response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

        if request.args['type'] == "getUserInfo":
            if 'id' in request.args:
                url = "https://seminar.minerva.kgi.edu/api/v1/users/{:s}".format(request.args['id'])
                response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

        if request.args['type'] == "getAllSections":
            url = "https://seminar.minerva.kgi.edu/api/v1/sections?state=all"
            response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

        if request.args['type'] == "getHcItems":
            url = "https://seminar.minerva.kgi.edu/api/v1/hc-trees/current?tree"
            response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

        if request.args['type'] == "getHcScores":
            url = "https://seminar.minerva.kgi.edu/api/v1/outcome-index-items?outcomeType=hc"
            response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

        if request.args['type'] == "getHcPerformances":
            if 'id' in request.args:
                url = "https://seminar.minerva.kgi.edu/api/v1/outcomeindex/performance?hc-item={:s}".format(request.args['id'])
                response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

        if request.args['type'] == "getAssignmentPage":
            if 'id' in request.args:
                url = "https://seminar.minerva.kgi.edu/api/v1/assignments/{:s}/nested_for_detail_page".format(request.args['id'])
                response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

        if request.args['type'] == "getClassPage":
            if 'id' in request.args:

                # try url variation 1
                url = "https://seminar.minerva.kgi.edu/api/v1/class/{:s}/class_edit_pag".format(request.args['id'])
                response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

                # try url variation 2
                if response.status_code == 404:
                    url = "https://seminar.minerva.kgi.edu/api/v1/classes/{:s}/class_edit_page".format(request.args['id'])
                    response = requests.get(url, headers={'Authorization': "Token {:s}".format(request.args['token'])})

                # if all url is incorrect
                if response.status_code == 404:
                    response = None

        # handle main function return
        if response != None:
            response = flask.jsonify(response.json())
        else:
            response = flask.jsonify({"error": "unmatched type"})
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Headers', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST')
        return response

    else:
        return 'Error: missing arguments'
