use geo::prelude::*;
use geo::point;
use crate::models::coordinates::Coordinates;

pub fn calculate_distance(start: Coordinates, end: Coordinates) -> f64 {
    let start_point = point!(x: start.longitude, y: start.latitude);
    let end_point = point!(x: end.longitude, y: end.latitude);
    start_point.haversine_distance(&end_point)
}
