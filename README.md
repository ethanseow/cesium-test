# Satellite Visualizer
https://sat-visualizer.herokuapp.com/

## Overview
This is my work in creating a full website detailing the different functionality of SatLib, a Python library for constellation based calculations, with PhD Student Man Wei Chan from MIT.

Users can input various satellite parameters which execute the Python scripts created in the SatLib library

# What is SatLib?
SatLib is a python library for constellation based calculations. Much of it is based on Poliastro and extends it for use with satellite constellations. Fundamental functionality such as propagating constellations, determining constellation access to ground stations, and determining when satellites in the constellation have windows of opportunity to perform inter-satellite links are included in the library. The main classes are contained in satbox.py and instructions to run an example notebook that showcase some of the capabilities are included below. Note: This library is still under development.

You can find more details about the repo here:
https://github.com/manweichan/SatLib/tree/master

# Basic Functionality
## Walker Inputs
i: The inclination or tilt (in degrees) of all the orbits in the constellation

t: The number of satellites in the constellation. Make sure this number is a multiple of the number of orbital plantes (p). For example, if you have 4 planes, you cannot have 6 satellites.

p: The number of orbital planes in the constellation. Make sure the number of satellites (t) can be equally divided among the planes. For example, if you have 6 satellites, you cannot have 4 planes since 6 cannot be divided equally into 4.

f: The phasing parameter of the constellation. It describes the relative angular spacing between satellites in adjacent planes, such that the change in true anomaly (in degrees) for equivalent satellites in neighbouring planes is equal to f*360/t. Make sure this number is between 0 and p-1. For example, if the number of planes (p) is zero, f can can only be 1.

alt: The altitude or height (in kilometers) of the constellation.


## Epoch
Epoch is the period of time in which the constellation is being visualized.

Propogation Duration: How long (in days) the satellites will be propagated.

Start Date: The start date of the propagation.

## Intersatellite Communication Threshold
The maximum distance (in kilometers) between satellites for communication to be viable

## Ground Stations
The latitude and longitude (in degrees) of the ground station objects.

## Conic Sensors
The conic angle (in degrees) of the conic sensor.

## Ground Station (GS) to Satellite Communication Threshold
The minimum elevation angle (in degrees) the satellites have to make with the ground stations for communication to be viable.
