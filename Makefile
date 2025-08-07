# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

# Makefile for MkDocs documentation

BUILDDIR      = site

.PHONY: help clean preflight serve build

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  clean      to remove all output files"
	@echo "  deps       to rebuild Python dependencies for MkDocs"
	@echo "  install    to install Python dependencies for MkDocs"
	@echo "  serve      to run MkDocs locally, live-rebuilding content as it changes"
	@echo "  preflight 	to install Python dependencies for documentation building"

clean:
	rm -rf $(BUILDDIR)/*

deps:
	./bin/compile-requirements.sh

install:
	pip install -U uv
	uv pip install -r requirements/docs.txt

preflight:
	pip install -r ../docs.txt

serve:
	mkdocs serve --open

build:
	mkdocs build
