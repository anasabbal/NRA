use geo::prelude::*;
use geo::point;
use crate::models::coordinates::Coordinates;
use crate::data::{Driver, Request};

fn calculate_distance(lat1: f64, lon1: f64, lat2: f64, lon2: f64) -> f64 {
    let rad = std::f64::consts::PI / 180.0;
    let dlat = (lat2 - lat1) * rad;
    let dlon = (lon2 - lon1) * rad;
    let a = (dlat / 2.0).sin() * (dlat / 2.0).sin() + lat1.to_radians().cos() * lat2.to_radians().cos() * (dlon / 2.0).sin() * (dlon / 2.0).sin();
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());
    6371.0 * c 
}

pub fn match_request(drivers: &[Driver], request: &Request) -> Option<Driver> {
    let rider_latitude = request.destination_latitude;
    let rider_longitude = request.destination_longitude;
    let mut best_driver = None;
    let mut best_distance = f64::MAX;

    for driver in drivers {
        let distance = calculate_distance(rider_latitude, rider_longitude, driver.latitude, driver.longitude);
        if distance < best_distance {
            best_distance = distance;
            best_driver = Some(driver.clone());
        }
    }

    best_driver
}