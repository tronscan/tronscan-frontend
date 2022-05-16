#!/bin/bash
echo "-------------start yarn $@--------------" 
yarn $@
echo "-------------end yarn $@--------------" 

echo "-------------start  replace some node_modules  --------------" 
rm -rf ./node_modules/leaflet
rm -rf ./node_modules/leaflet-echarts
rm -rf ./node_modules/leaflet.markercluster

cp -r ./backuplib/leaflet ./node_modules/
cp -r ./backuplib/leaflet-echarts ./node_modules/
cp -r ./backuplib/leaflet.markercluster ./node_modules/

echo "-------------end replace some node_modules  --------------" 