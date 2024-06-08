use actix_web::{get, web, Responder};
use crate::models::coordinates::Coordinates;
use crate::models::distance_response::DistanceResponse;
use crate::services::distance_service::calculate_distance;
use log::info;



#[get("/calculate-distance")]
pub async fn calculate_distance_handler(web::Query((start, end)): web::Query<(Coordinates, Coordinates)>) -> impl Responder {
    info!("Received request to calculate distance");
    let distance = calculate_distance(start, end);
    web::Json(DistanceResponse { distance })
}
