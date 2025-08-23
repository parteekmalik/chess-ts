use solana_program::{clock::Clock, program_error::ProgramError, sysvar::Sysvar};

pub fn rating_change(rating_a: u32, rating_b: u32, score_a: f32, k: u32) -> u8 {
    let expected_a = 1.0 / (1.0 + 10f32.powf((rating_b - rating_a) as f32 / 400.0));
    (k as f32 * (score_a - expected_a)).round() as u8
}

pub fn calculate_rating_changes(white_rating: u32, black_rating: u32, k: u32) -> (u8, u8) {
    (
        rating_change(white_rating, black_rating, 1.0, k),
        rating_change(white_rating, black_rating, -1.0, k),
    )
}

pub fn random_bool() -> Result<bool, ProgramError> {
    let clock = Clock::get().map_err(|_| ProgramError::InvalidArgument)?;
    Ok((clock.slot & 1) == 1)
}
