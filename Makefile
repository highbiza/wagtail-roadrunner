.PHONY: fail-if-no-virtualenv all install lint black test debug undebug

all: install assets

fail-if-no-virtualenv:
ifndef VIRTUAL_ENV # check for a virtualenv in development environment
ifndef PYENVPIPELINE_VIRTUALENV # check for jenkins pipeline virtualenv
$(error this makefile needs a virtualenv)
endif
endif

ifndef PIP_INDEX_URL
PIP_INDEX_URL=https://pypi.uwkm.nl/ocyan/testing/+simple/
endif

install: fail-if-no-virtualenv
	PIP_INDEX_URL=${PIP_INDEX_URL} pip install --editable .[test] --upgrade --upgrade-strategy=eager --pre

assets:
	npm install
	npm run build

lint: fail-if-no-virtualenv
	@black --check --exclude "migrations/*" rr
	@pylint setup.py roadrunner/

black:
	@black --exclude "migrations/*" rr

test: fail-if-no-virtualenv
	@coverage run --source='rr' `which manage.py` test
	@coverage report
	@coverage xml
	@coverage html

debug: fail-if-no-virtualenv
	PIP_INDEX_URL=${PIP_INDEX_URL} pip install --pre ocyan.plugin.debug

undebug:
	PIP_INDEX_URL=${PIP_INDEX_URL} pip uninstall -y ocyan.plugin.debug
