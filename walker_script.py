import os
import satbox as sb
import orbitalMechanics as om
import utils as utils
from poliastro.czml.extract_czml import CZMLExtractor
import CZMLExtractor_MJD as CZMLExtractor_MJD
import numpy as np
from poliastro import constants
from poliastro.earth import Orbit
from poliastro.earth.sensors import min_and_max_ground_range, ground_range_diff_at_azimuth
from poliastro.bodies import Earth
from poliastro.maneuver import Maneuver
from poliastro.twobody.propagation import propagate
from poliastro.twobody.propagation import cowell
from poliastro.core.perturbations import J2_perturbation
from poliastro.core.propagation import func_twobody
from poliastro.util import norm
import astropy
import astropy.units as u
from astropy.time import Time, TimeDelta
from astropy.coordinates import Angle
import matplotlib.pyplot as plt
from poliastro.plotting.static import StaticOrbitPlotter
from poliastro.plotting import OrbitPlotter3D, OrbitPlotter2D
from poliastro.twobody.events import(NodeCrossEvent,)
import seaborn as sns
from astropy.coordinates import EarthLocation, GCRS, ITRS, CartesianRepresentation, SkyCoord
import comms as com
from copy import deepcopy
import dill
import Interval_Finder as IF 
import sys
import json
"""
#User inputs
userInputs = sys.argv[1]
input_dict = json.loads(userInputs)

# Visualizing walker constellation and isl
i = input_dict['i'] *u.deg
t = input_dict['t'] 
p = input_dict['p']
f = input_dict['f']
alt = input_dict['alt'] *u.km
dist_threshold = input_dict['dist_threshold']
    
walker = sb.Constellation.from_walker(i, t, p, f, alt)
t2propagate = 1 * u.day
tStep = 90 * u.s
walkerSim = sb.SimConstellation(walker, t2propagate, tStep, verbose = True)
walkerSim.propagate()

relative_position_data_ISL = IF.get_relative_position_data_ISL(walkerSim, dist_threshold)
satellites = IF.find_feasible_links_ISL(t, relative_position_data_ISL)
L_avail = IF.get_availability_ISL(satellites, relative_position_data_ISL)
L_poly = IF.get_polyline_ISL(satellites, relative_position_data_ISL)

# Generating czml file
file = walker.generate_czml_file(prop_duration=1,sample_points=100, satellites=satellites, L_avail=L_avail, L_poly=L_poly, show_polyline_isl=True)
print(file)
"""
print('hello world')