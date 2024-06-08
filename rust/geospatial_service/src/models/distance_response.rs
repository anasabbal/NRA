use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DistanceResponse {
    pub distance: f64,
}
