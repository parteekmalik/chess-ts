import {
  Account,
  Blockhash,
  createSolanaClient,
  createTransaction,
  getProgramDerivedAddress,
  getU64Encoder,
  Instruction,
  KeyPairSigner,
  LAMPORTS_PER_SOL,
  ProgramDerivedAddress,
  signTransactionMessageWithSigners
} from 'gill';
import { loadKeypairSignerFromFile } from 'gill/node';
import {
  ChessMatch,
  fetchChessMatch,
  fetchProfile,
  fetchRegistry,
  getCleanProfileInstructionAsync,
  getCloseChessMatchInstruction,
  getCreateChessMatchInstructionAsync,
  getInitializeProfileInstructionAsync,
  getInitializeRegistryInstruction,
  getJoinChessMatchInstructionAsync,
  getMakeMoveInstructionAsync,
  Profile,
  Registry,
  WEB3_PROGRAM_ADDRESS
} from '../src';
import { expectSome } from '../src/client/js/generated/shared';


const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: "devnet" })

describe('web3', () => {
  let whitePlayer: KeyPairSigner
  let blackPlayer: KeyPairSigner
  let registry: ProgramDerivedAddress

  beforeAll(async () => {
    whitePlayer = await loadKeypairSignerFromFile("./tests/white.json")
    blackPlayer = await loadKeypairSignerFromFile("./tests/black.json")
    console.log("whitePlayer: ", whitePlayer, "balance: ", (Number((await rpc.getBalance(whitePlayer.address).send()).value) / LAMPORTS_PER_SOL).toFixed(2))
    console.log("blackPlayer: ", blackPlayer, "balance: ", (Number((await rpc.getBalance(blackPlayer.address).send()).value) / LAMPORTS_PER_SOL).toFixed(2))
    registry = await getProgramDerivedAddress({ programAddress: WEB3_PROGRAM_ADDRESS, seeds: ["registry"] })
  })

  it('Initialize registry', async () => {
    // ARRANGE
    expect.assertions(1)
    let currentRegistry: Account<Registry, string>;
    try {
      currentRegistry = await fetchRegistry(rpc, registry[0])
    } catch {
      const ix = getInitializeRegistryInstruction({ payer: whitePlayer, registry: registry[0] })

      // ACT
      await sendAndConfirm({ ix, payer: whitePlayer })
    }

    // ASSER
    currentRegistry = await fetchRegistry(rpc, registry[0])
    console.log(currentRegistry)
    expect(currentRegistry.data.accType).toEqual(0)
  })

  let whiteProfile: Account<Profile, string>;
  let blackProfile: Account<Profile, string>;
  it('Create Profiles', async () => {
    // ARRANGE
    expect.assertions(2)

    const ix1 = await getInitializeProfileInstructionAsync({
      name: "whiteProfileName",
      payer: whitePlayer
    })
    const ix2 = await getInitializeProfileInstructionAsync({
      name: "blackProfileName",
      payer: blackPlayer
    })
    const whiteProfileAddress = ix1.accounts[1].address
    const blackProfileAddress = ix2.accounts[1].address

    try {
      whiteProfile = await fetchProfile(rpc, whiteProfileAddress)
      console.log("white profile already exists")
    } catch {
      console.log("creating white profile")
      await sendAndConfirm({ ix: ix1, payer: whitePlayer })
      whiteProfile = await fetchProfile(rpc, whiteProfileAddress)
    }

    try {
      blackProfile = await fetchProfile(rpc, blackProfileAddress)
      console.log("black profile already exists")
    } catch {
      console.log("creating black profile")
      await sendAndConfirm({ ix: ix2, payer: blackPlayer })
      blackProfile = await fetchProfile(rpc, blackProfileAddress)
    }

    console.log(whiteProfile)
    console.log(blackProfile)
    expect(whiteProfile.data.accType).toEqual(1)
    expect(blackProfile.data.accType).toEqual(1)
  }, 300000)

  it('Close ChessMatches and clean profiles', async () => {
    // ARRANGE
    // Check if profiles exist before trying to clean them
    if (!whiteProfile || !blackProfile) {
      console.log("Profiles not available, skipping cleanup")
      return
    }

    // Clean up white player's matches
    for (const id of whiteProfile.data.matches) {
      const ix = await getCloseChessMatchInstruction({
        payer: whitePlayer,
        chessMatch: (await getProgramDerivedAddress({
          programAddress: WEB3_PROGRAM_ADDRESS,
          seeds: [getU64Encoder().encode(expectSome(id))],
        }))[0]
      })
      const signature = await sendAndConfirm({ ix, payer: whitePlayer })
      console.log("closed match with id: ", id, signature)
    }
    const ix1 = await getCleanProfileInstructionAsync({
      payer: whitePlayer,
    })
    const signature1 = await sendAndConfirm({ ix: ix1, payer: whitePlayer })
    console.log("clean profile: ", whiteProfile.address, signature1)
    const ix2 = await getCleanProfileInstructionAsync({
      payer: blackPlayer,
    })
    const signature2 = await sendAndConfirm({ ix: ix2, payer: blackPlayer })
    console.log("clean profile: ", blackProfile.address, signature2)
  }, 60000)

  let chessMatch: Account<ChessMatch, string>
  it('Create ChessMatch and join', async () => {
    // ARRANGE
    if (!whiteProfile || !blackProfile) {
      console.log("Profiles not available, skipping cleanup")
      return
    }
    expect.assertions(2)
    const matchId = randomSafeMath();
    const ix1 = await getCreateChessMatchInstructionAsync({
      matchId,
      baseTimeSeconds: 60 * 5,
      incrementSeconds: 1,
      payer: whitePlayer
    })
    const signature1 = await sendAndConfirm({ ix: ix1, payer: whitePlayer })
    expect(typeof signature1).toBe("string")
    chessMatch = await fetchChessMatch(rpc, ix1.accounts[1].address)
    console.log(chessMatch)

    const ix2 = await getJoinChessMatchInstructionAsync({
      payer: blackPlayer,
      chessMatch: chessMatch.address,
    })
    const signature2 = await sendAndConfirm({ ix: ix2, payer: blackPlayer })
    chessMatch = await fetchChessMatch(rpc, ix1.accounts[1].address)
    console.log(chessMatch)
    expect(typeof signature2).toBe("string")
  }, 10000)

  it('Make move', async () => {
    // ARRANGE
    expect.assertions(1)
    const movesToBePlayed = "e4 e5 Qh5 Nc6 Bc4 Nf6 Qxf7#".split(" ");

    if (!chessMatch) {
      console.log("ChessMatch not available, skipping cleanup")
      return
    }
    let payer = chessMatch.data.white.__option === "Some" && chessMatch.data.white.value === whiteProfile.address ? whitePlayer : blackPlayer
    let opponentProfile = chessMatch.data.white.__option === "Some" && chessMatch.data.white.value === whiteProfile.address ? blackProfile : whiteProfile
    for (const mv of movesToBePlayed) {
      const ix = await getMakeMoveInstructionAsync({
        payer,
        chessMatch: chessMatch.address,
        moveFenStr: mv,
        opponentProfile: opponentProfile.address,
      })
      await sendAndConfirm({ ix, payer })
      payer = payer === whitePlayer ? blackPlayer : whitePlayer
      opponentProfile = opponentProfile === whiteProfile ? blackProfile : whiteProfile
      chessMatch = await fetchChessMatch(rpc, chessMatch.address)
      console.log(chessMatch.data)
      console.log(chessMatch.data.moves)
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 10) * 1000))
    }
    expect(chessMatch.data.moves.length).toEqual(movesToBePlayed.length)
  }, 120000)
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  try {
    const signature = await sendAndConfirmTransaction(signedTransaction)
    console.log(`✅ Transaction confirmed! Signature: ${signature}`)
    return signature
  } catch (error) {
    console.error(`❌ Transaction failed:`, error.context)
    throw error
  }
}
export function randomSafeMath(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
