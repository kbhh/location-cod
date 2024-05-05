import axios from 'axios';
import {GRAPHHOPPER_API, GRAPHHOPPER_KEY} from './constants';

/**
 *
 * @param {LongLat[]} points
 * @param {string} vehicle
 */
export const getRoute = (points, vehicle) =>
  axios.post(`${GRAPHHOPPER_API}/route?key=${GRAPHHOPPER_KEY}`, {
    points,
    vehicle,
  });
