#[derive(Clone)]
pub struct Driver {
    pub id: u32,
    pub latitude: f64,
    pub longitude: f64,
    pub rating: f64,
}

pub struct Rider {
    pub id: u32,
    pub latitude: f64,
    pub longitude: f64,
}

pub struct Request {
    pub rider_id: u32,
    pub destination_latitude: f64,
    pub destination_longitude: f64,
}
