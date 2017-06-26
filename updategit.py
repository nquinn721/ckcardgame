#!/usr/bin/python
import os

os.system('git add . && git ci -m "update" && git push origin master && git push heroku master')
