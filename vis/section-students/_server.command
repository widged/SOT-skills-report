#!/bin/bash
cd "$(dirname "$0")"
open http://0.0.0.0:8080/
http-server 
