import flask
import requests

app = flask.Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Authorization is necessary for server to verify credentials to access web page
# user-agent is so that the server thinks that the program is actually a real browser
# so that it doesnt kick us out or refuse connection because we're a bot
headers = {"Authorization": "Basic emdyYWhhbTpaYWMxIWdybTEhZGFrb3Rh",
           "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) "
                         "\Chrome/57.0.2987.133 Safari/537.36"}

# payload contains the GET fields we are requesting
# ?hostgroup=arc_import_mark

payload = {"hostgroup": "arc_import_mark"}

# url
url = "https://inventory.proofpoint.com/cmdb_api/v1/system"

# full url = https://inventory.proofpoint.com/cmdb_api/v1/system?hostgroup=arc_import_mark


@app.route('/')
def index():
    return flask.render_template("table.html")


@app.route('/hgroup')
def json_function():
    hostgroup = flask.request.args.get("hostgroup")
    status = flask.request.args.get("status")
    print(status)
    payload["hostgroup"] = hostgroup

    if status is not None and status != "":
        payload["status"] = status
        json = requests.get(url=url, params=payload, headers=headers).json()
        print(requests.get(url=url, params=payload, headers=headers).url)
        del payload["status"]
    else:
        json = requests.get(url=url, params=payload, headers=headers).json()

    return flask.render_template("json.html", json=json)


if __name__ == '__main__':
    app.run()
