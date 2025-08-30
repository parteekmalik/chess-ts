use anchor_lang::prelude::*;

#[error_code]
pub enum ChessError {
    #[msg("This is not supposed to be reachable")]
    NotReachable,
    #[msg("Match is already full")]
    MatchAlreadyFull,
    #[msg("Illegal move")]
    IllegalMove,
    #[msg("Match is not active or finished")]
    MatchNotActiveOrFinished,
    #[msg("Match is not started")]
    MatchNotStarted,
    #[msg("It's not your turn")]
    NotYourTurn,
    #[msg("Invalid profile sent not mached with player")]
    InvalidProfileSent,
    #[msg("Match time out")]
    MatchTimeOut,
    #[msg("Match abandoned")]
    MatchAbandoned,
}
