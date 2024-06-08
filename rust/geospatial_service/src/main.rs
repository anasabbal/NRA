use actix_web::{App, HttpServer};
use env_logger;
use log::info;

mod models;
mod services;
mod handlers;



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    info!("Starting server at http://0.0.0.0:8081");

    HttpServer::new(|| {
        App::new()
            .service(handlers::distance::calculate_distance_handler)
    })
    .bind("0.0.0.0:8081")?
    .run()
    .await
}
