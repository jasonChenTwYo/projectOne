init

安裝python 3.12.1

https://flask.palletsprojects.com/en/3.0.x/installation/

Create an environment

mac:
python3 -m venv .venv

window:
py -3 -m venv .venv

Activate the environment

mac:
. .venv/bin/activate

window:
.venv\Scripts\activate

https://pip.pypa.io/en/latest/user_guide/#requirements-files

mac: 
python -m pip install -r backend/requirements.txt

window:
py -m pip install -r backend/requirements.txt

run

uvicorn app.main:app

window:

py -m uvicorn app.main:app 

目錄結構參考:

https://github.com/tiangolo/full-stack-fastapi-postgresql/tree/master


test

window:

py -m pytest