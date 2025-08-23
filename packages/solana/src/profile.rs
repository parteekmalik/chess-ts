use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{msg, program_error::ProgramError, pubkey::Pubkey};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct Profile {
    pub acc_type: u8,
    pub wallet: Pubkey,
    pub rating: u32,
    pub wins: u32,
    pub losses: u32,
    pub draws: u32,
    pub display_name: String,
    pub matches: Vec<Pubkey>,
}

impl Profile {
    pub fn load(data: &[u8]) -> Result<Self, ProgramError> {
        if data.len() < 1 {
            msg!(
                "Profile::load: ERROR - Data too short ({} bytes)",
                data.len()
            );
            return Err(ProgramError::InvalidAccountData);
        }

        let result = Self::try_from_slice(data).map_err(|_| ProgramError::InvalidAccountData);

        match result {
            Ok(profile) => {
                Ok(profile)
            }
            Err(e) => {
                msg!(
                    "Profile::load: ERROR - Borsh deserialization failed: {:?}",
                    e
                );
                Err(ProgramError::InvalidAccountData)
            }
        }
    }
    pub fn serialize_updates_state(&self, data: &mut [u8]) {
        let mut serialized = Vec::new();
        self.serialize(&mut serialized).unwrap();

        data[..serialized.len()].copy_from_slice(&serialized);
    }
    pub fn space(&self) -> usize {
        let mut serialized = Vec::new();
        self.serialize(&mut serialized).unwrap();
        serialized.len()
    }
    pub fn get_acc_type() -> u8 {
        1
    }
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct ProfilePayload {
    pub name: String,
}
impl ProfilePayload {
    pub fn load(data: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(data).map_err(|_| ProgramError::InvalidAccountData)
    }
}
