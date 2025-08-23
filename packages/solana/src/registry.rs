use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{program_error::ProgramError, pubkey::Pubkey};

// Registry holds global state for your program.
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Registry {
    pub acc_type: u8,
    pub matches_played: u32,
    pub matches_pending: u32,
}

impl Registry {
    pub fn load(data: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(data).map_err(|_| ProgramError::InvalidAccountData)
    }
    pub fn serialize_updates_state(&self, data: &mut [u8]) -> Result<(), ProgramError> {
        let mut serialized = Vec::with_capacity(Registry::space());
        self.serialize(&mut serialized)
            .map_err(|_| ProgramError::InvalidAccountData)?;

        if serialized.len() > data.len() {
            return Err(ProgramError::InvalidAccountData);
        }

        data[..serialized.len()].copy_from_slice(&serialized);

        Ok(())
    }
    pub fn space() -> usize {
        1 + 4 + 4
    }
    pub fn get_pda(program_id: &Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(&[Registry::seed()], program_id)
    }
    pub fn seed() -> &'static [u8] {
        b"registry"
    }
    pub fn get_acc_type() -> u8 {
        0
    }
}
