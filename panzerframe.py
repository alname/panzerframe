# -*- coding: utf-8 -*-
#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#		 http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_app]
import os,binascii,string,random
from flask import Flask, render_template, Blueprint
from flask import abort, jsonify, request, redirect, make_response, Response

panzerframe = Blueprint('panzerframe', __name__, template_folder='templates', static_folder='./static')

@panzerframe.route('/')
def MainHandler():
	output = render_template(
		'Main.html',
		subtitle = "MAIN"
		)
	response = make_response(output)
	return response


@panzerframe.route('/customize/<path:title>')
def CustomizeHandler(title):
	output = render_template(
		'customize/%s.html' % title,
		)
	response = make_response(output)
	return response
	
	
@panzerframe.route('/partsdata/<path:title>')
def PartsdataHandler(title):
	head = dict(
		SLPM62339 = "2序章篇",
		SLPM65033 = "本篇",
		SLPM65123 = "BT",
		SLPM65199 = "コバルト小隊篇",
		SLPM65343 = "2本篇",
		SLPS20075 = "序章篇"
		)
	output = render_template(
		'parts/%s.html' % title,
		disk = title,
		head = head[title],
		)
	response = make_response(output)
	return response


@panzerframe.route('/salvage/<path:title>')
def SalvageHandler(title):
	head = dict(
		SLPM62339 = "2序章篇",
		SLPM65033 = "本篇",
		SLPM65123 = "BT",
		SLPM65199 = "コバルト小隊篇",
		SLPM65343 = "2本篇",
		SLPS20075 = "序章篇"
		)
	output = render_template(
		'salvage/Base.html',
		disk = title,
		head = head[title],
		)
	response = make_response(output)
	return response


@panzerframe.route('/input')
def InputHandler():
	return "ok"
