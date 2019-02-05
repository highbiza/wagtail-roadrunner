.PHONY: fail-if-no-virtualenv all install migrate loaddata collectstatic lint black test debug undebug

all: install migrate loaddata collectstatic

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

migrate:
	manage.py migrate --no-input

loaddata:
	# manage.py loaddata

collectstatic:
	manage.py collectstatic --no-input

lint: fail-if-no-virtualenv
	@black --check --exclude "migrations/*" ocyan
	@pylint setup.py ocyan/

black:
	@black --exclude "migrations/*" ocyan

test: fail-if-no-virtualenv
	@coverage run --source='ocyan.plugin.roadrunner.bs4' `which manage.py` test
	@coverage report
	@coverage xml
	@coverage html

debug: fail-if-no-virtualenv
	PIP_INDEX_URL=${PIP_INDEX_URL} pip install --pre ocyan.plugin.debug

undebug:
	PIP_INDEX_URL=${PIP_INDEX_URL} pip uninstall -y ocyan.plugin.debug
