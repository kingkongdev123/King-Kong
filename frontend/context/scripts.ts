import { Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';

import fs from 'fs';
import path from 'path';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

import {
    BANANA_TOKEN_DECIMAL,
    BANANA_TOKEN_MINT,
    GLOBAL_AUTHORITY_SEED,
    ESCROW_VAULT_SEED,
    GAME_VAULT_SEED,
    USER_DATA_SEED,
    PROGRAM_ID,
    GamePool
} from './types';
import { IDL as KingKongGameIdl } from "./king_kong_game";
import { isInitializedUser } from './utils';
import {
    PublicKey,
    Connection,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    Keypair
} from '@solana/web3.js';
import { createBuyTokenTx, createClaimBananaForNftHoldersTx, createClaimXprewardTx, createDepositNftEscrowTx, createGamePoolTx, createInitGamePoolTx, createInitializeTx, createInitUserTx, createWithdrawEscrowNftTx, createWithdrawEscrowVolumeTx, gamePlayTx, getClaimRewardTx, getGameState, getUserState } from './script';
import { WalletContextState } from '@solana/wallet-adapter-react';
import getConfig from 'next/config'
import { IDL } from './king_kong_game';

const { publicRuntimeConfig } = getConfig()
const cluster = publicRuntimeConfig.SOLANA_NETWORK;

let solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
// let solConnection: Connection| null = null;
// let payer: any = null;
// let program: Program| null = null;
// let programId = new anchor.web3.PublicKey(PROGRAM_ID);


const main = async () => {
    // setClusterConfig('devnet');
    // await initProject();
    // await createGamePool();
    // await initGamePool(100000000, 4, 1600000000, "AsACVnuMa5jpmfp3BjArmb2qWg5A6HBkuXePwT37RrLY", 110000000, 1000000000, 1);
    // await initUserPool();

    // await playGame(1, 0, 0, 0);
    // await buyBnn(1000000000)

    // await depositNftEscrow(new PublicKey("5J6UyFFr3xjidyzjKfmDQxL8oaqsVV7rUGQgGTBXYk59"));
    // await withdrawEscrowVolume();
    // await withdrawEscrowNft();
    // await claimBananaForNftHolders(new PublicKey("3rKjzUqCg2R3vzS4b5waXNew5jwe7hKWB9iZjp2k2XXW"));

    // await claimReward();

    // await claimXpreward(500);

    await getGameState()
    // await getUserState(payer.publicKey, program);
}


export const claimXpreward = async (
    xp: number,
    wallet: WalletContextState,

) => {
    if (wallet.publicKey === null) return;

    let token_mint = BANANA_TOKEN_MINT;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const tx = await createClaimXprewardTx(xp, wallet.publicKey, token_mint, program, solConnection);
    // const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
    // tx.feePayer = user;
    // tx.recentBlockhash = blockhash;
    // user.signTransaction(tx);
    // let txId = await solConnection.sendTransaction(tx, [(payer as NodeWallet).payer]);
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "confirmed");
    console.log("txHash =", txId);
}

export const initUserPool = async (
    wallet: WalletContextState,
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const tx = await createInitUserTx(wallet.publicKey, program);
    // const { blockhash } = await solConnection.getRecentBlockhash('finalized');
    // tx.feePayer = payer.publicKey;
    // tx.recentBlockhash = blockhash;
    // payer.signTransaction(tx);
    // let txId = await solConnection.sendTransaction(tx, [(payer as NodeWallet).payer]);
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    console.log("Your transaction signature", txId);
}

export const playGame = async (
    wallet: WalletContextState,

    round1Banana: number = 0,
    round2Banana: number = 0,
    round3Banana: number = 0,
    round4Banana: number = 0,
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    if (!await isInitializedUser(wallet.publicKey, solConnection)) {
        console.log('User PDA is not Initialized. Should Init User PDA for first usage');
        return;
    }



    const tx = await gamePlayTx(round1Banana, round2Banana, round3Banana, round4Banana, wallet.publicKey, program, solConnection);
    // const { blockhash } = await solConnection.getRecentBlockhash('finalized');
    // tx.feePayer = payer.publicKey;
    // tx.recentBlockhash = blockhash;
    // payer.signTransaction(tx);
    // let txId = await solConnection.sendTransaction(tx, [(payer as NodeWallet).payer]);
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    console.log("Your transaction signature", txId);
}

export const claimReward = async (
    wallet: WalletContextState,

) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);


    let gamePool = await getGameState();

    let userPool = await getUserState(wallet.publicKey);

    if (gamePool.winner == wallet.publicKey.toBase58() || userPool?.winnerLast == 1) {
        // get mint address from the game vault
        let nft_mint = gamePool.escrowNftMints[0];
        let token_mint = BANANA_TOKEN_MINT;

        const tx = await getClaimRewardTx(token_mint, nft_mint, wallet.publicKey, program, solConnection);
        let txId = await wallet.sendTransaction(tx, solConnection);
        await solConnection.confirmTransaction(txId, "finalized");
        console.log("Your transaction signature", txId);
    } else {
        console.log("No reward to claim!")
    }
}

export const buyBnn = async (
    wallet: WalletContextState,
    tokenAmount: number
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const tx = await createBuyTokenTx(tokenAmount, BANANA_TOKEN_MINT, wallet.publicKey, program, solConnection);
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    console.log("Your transaction signature", txId);
}

/**
 * Deposit one NFT of the king-kong collection to the game escrow vault PDA for rewarding
 * @param nft_mint : mint address of king-kong nft to be deposited to the escrow vault PDA
 */
export const depositNftEscrow = async (
    wallet: WalletContextState,
    nft_mint: PublicKey
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const tx = await createDepositNftEscrowTx(wallet.publicKey, nft_mint, program, solConnection);
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    console.log("Your transaction signature", txId);
}

export const withdrawEscrowVolume = async (
    wallet: WalletContextState,
    solAmount: number = 1000000000,
    tokenAmount: number = 1000000000
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let token_mint = BANANA_TOKEN_MINT;
    const tx = await createWithdrawEscrowVolumeTx(solAmount, tokenAmount, token_mint, wallet.publicKey, program, solConnection);
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    console.log("Your transaction signature", txId);
}

export const withdrawEscrowNft = async (
    wallet: WalletContextState,
    nft_mint: string | null = null
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let game_data = await getGameState();

    if (!nft_mint) nft_mint = game_data.escrowNftMints[0].toBase58();
    if (!nft_mint) return;
    const tx = await createWithdrawEscrowNftTx(new PublicKey(nft_mint), wallet.publicKey, program, solConnection);
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    console.log("Your transaction signature", txId);
}

export const claimBananaForNftHolders = async (
    wallet: WalletContextState,
    nft_mint: PublicKey
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;

    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let token_mint = BANANA_TOKEN_MINT;

    const tx = await createClaimBananaForNftHoldersTx(
        wallet.publicKey,
        nft_mint,
        token_mint,
        program,
        solConnection
    );
    let txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    console.log("Your transaction signature", txId);
}

main();