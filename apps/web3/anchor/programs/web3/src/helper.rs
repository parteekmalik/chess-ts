use crate::state::MoveRecord;
use anchor_lang::prelude::*;

pub fn calculate_time_left(
    base_time_seconds: u32,
    increment_seconds: u32,
    moves: &[MoveRecord],
    start_time: i64,
) -> (u32, u32) {
    let mut white_time_left = base_time_seconds;
    let mut black_time_left = base_time_seconds;

    for (index, mv) in moves.iter().enumerate() {
        let prev = if index > 0 {
            &moves[index - 1]
        } else {
            &MoveRecord {
                ts: start_time,
                san: "".to_string(),
            }
        };
        if index % 2 == 0 {
            white_time_left -= (mv.ts - prev.ts) as u32;
            white_time_left += increment_seconds;
        } else {
            black_time_left -= (mv.ts - prev.ts) as u32;
            black_time_left += increment_seconds;
        }
    }
    (white_time_left, black_time_left)
}

pub fn time_before_game_ends(
    base_time_seconds: u32,
    increment_seconds: u32,
    moves: &[MoveRecord],
    start_time: i64,
) -> i64 {
    let (white_time_left, black_time_left) =
        calculate_time_left(base_time_seconds, increment_seconds, moves, start_time);
    let mut current_time = Clock::get().unwrap().unix_timestamp;
    if moves.len() % 2 == 0 {
        current_time += white_time_left as i64;
    } else {
        current_time += black_time_left as i64;
    }
    current_time
}

#[test]
fn test_calculate_time_left() {
    // Test with two moves
    let mut moves = vec![
        MoveRecord {
            ts: 1010,
            san: "e4".to_string(),
        },
        MoveRecord {
            ts: 1030,
            san: "e5".to_string(),
        },
    ];
    let (white_time_left, black_time_left) = calculate_time_left(1000, 1, &moves, 1000);
    assert_eq!(white_time_left, 991);
    assert_eq!(black_time_left, 981);

    moves = vec![MoveRecord {
        ts: 1010,
        san: "e4".to_string(),
    }];
    let (white_time_left, black_time_left) = calculate_time_left(1000, 0, &moves, 1000);
    assert_eq!(white_time_left, 990);
    assert_eq!(black_time_left, 1000);

    moves = vec![];
    let (white_time_left, black_time_left) = calculate_time_left(1000, 0, &moves, 1000);
    assert_eq!(white_time_left, 1000);
    assert_eq!(black_time_left, 1000);
}
