# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

# Makefile for MkDocs documentation

BUILDDIR      = site

.PHONY: help clean preflight serve build

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  build      to build the output site"
	@echo "  clean      to remove all output files"
	@echo "  deps       to hash Python dependencies after version bump"
	@echo "  install    to install Python dependencies for MkDocs"
	@echo "  serve      to run MkDocs locally, live-rebuilding content as it changes"

build:
	mkdocs build -d $(BUILDDIR)

clean:
	rm -rf $(BUILDDIR)/*

deps:
	pip install -U uv
	rm -f requirements.txt
	uv pip compile --generate-hashes --no-strip-extras --python-version 3.13 requirements.in -o requirements.txt

install:
	pip install -U uv
	uv pip install -r requirements.txt

serve:
	mkdocs serve --open
