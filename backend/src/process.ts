import { Connection, Keypair, LAMPORTS_PER_SOL, ParsedInnerInstruction, ParsedInstruction, PartiallyDecodedInstruction, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { resolve } from 'path';
import { Server } from 'socket.io';
import { GAME_CONFIG_VAULT_SEED, GAME_POOL, GLOBAL_AUTHORITY_SEED, PROGRAM_ID, RENT_EXEMPT_MINIMUM, SOLANA_TRX_FEE, USER_DATA_SEED, } from './config/constant';
import { loadDump, saveDump, sleep } from './util';
import fs from 'fs';
import { holdersData, SOLANA_NETWORK } from './config/config';
import * as anchor from '@project-serum/anchor';
import { IDL as KingKongGameIdl } from "./config/king_kong_game";
import { GameConfigPool, GamePool } from './types';
import { Program, Wallet, web3 } from '@project-serum/anchor';
import WalletSeed from './config/fake-wallet.json';
import HashList from './config/nft_hash_list.json';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import mysql from 'mysql2';
import * as dotenv from "dotenv";
dotenv.config();

const solConnection = new Connection(web3.clusterApiUrl(SOLANA_NETWORK), "confirmed");
const wallet = new Wallet(Keypair.fromSecretKey(Uint8Array.from(WalletSeed), { skipValidation: true }));
const newProvider = new anchor.Provider(solConnection, wallet, {});
let program = new anchor.Program(KingKongGameIdl, PROGRAM_ID, newProvider) as unknown as Program;
console.log('ProgramId: ', program.programId.toBase58());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'kkgame',
    password: ""
});
const promisePool = pool.promise();

export const getPlayerInfo = async (address: string) => {

    try {
        let query = `select * from users where address='${address}'`;
        let [rows, fields] = await promisePool.query(query);
        let result = rows as any[];
        if (result.length == 0) {
            query = `INSERT INTO users (address, pfp) VALUES ('${address}', '${process.env.defaultPfp}')`
            console.log(query)
            await promisePool.query(query)
            return {
                address: address,
                pfp: process.env.defaultPfp
            }

        } else {
            return result[0];
        }
        console.log(result)
    } catch (e) {
        console.log(e);
        return -1;
    }
}

export const registerAvatar4Game = async (address: string, avatar: string) => {
    try {
        let query = `SELECT * from users where address='${address}'`;
        let [rows, fields] = await promisePool.query(query);
        let result = rows as any[];
        if (result.length > 0) {
            query = `UPDATE users SET pfp='${avatar}' where address='${address}'`
        } else {
            query = `INSERT INTO users (address, pfp) VALUES ('${address}', '${avatar}')`
        }
        await promisePool.query(query);
        return 0;
    } catch (e) {
        console.log(e)
        return -1;
    }
}
export const getUserStats = async (address: string) => {
    try {
        let query = `SELECT * FROM users WHERE address='${address}'`;
        let [rows, fields] = await promisePool.query(query);
        let result = rows as any[];

        let playedNums = 0;
        let winnedNums = 0;
        let xp = 0;
        let winnedVolume = 0;
        let playedVolume = 0;
        if (result.length > 0) {
            playedNums = result[0].playedNums;
            winnedNums = result[0].winnedNums;
            xp = result[0].xp;
            winnedVolume = result[0].winnedVolume;
            playedVolume = result[0].playedVolume;
        }

        query = `select * from gamehistory where player='${address}'`;
        [rows, fields] = await promisePool.query(query);
        result = rows as any[];
        let finalRoundReachedNums = 0;
        if (result.length > 0) {
            finalRoundReachedNums = result[0].r4result;
        }
        return {
            playedNums: playedNums,
            winnedNums: winnedNums,
            xp: xp,
            winnedVolume: winnedVolume,
            playedVolume: playedVolume,
            finalRoundReachedNums: finalRoundReachedNums
        }
    } catch (e) {
        console.log(e)
        return {
            playedNums: 0,
            winnedNums: 0,
            xp: 0,
            winnedVolume: 0,
            playedVolume: 0,
            finalRoundReachedNums: 0
        }
    }
}

export const getGameStats = async () => {
    try {
        let query = `SELECT 
        player, 
        SUM(r1result) AS r1result, SUM(r2result) AS r2result, SUM(r3result) AS r3result, SUM(r4result) AS r4result, 
        SUM(winned) AS winned, 
        SUM(r1BnnUse) AS r1BnnUse, SUM(r2BnnUse) AS r2BnnUse, SUM(r3BnnUse) AS r3BnnUse, SUM(r4BnnUse) AS r4BnnUse,
        COUNT(player) AS plays 
         FROM gamehistory WHERE TIMESTAMP> UNIX_TIMESTAMP(NOW())-86400 GROUP BY player ORDER BY winned DESC LIMIT 100`;
        let [rows, fields] = await promisePool.query(query);
        let dayResult = rows as any[];

        query = `SELECT player, SUM(r1result) AS r1result, SUM(r2result) AS r2result, SUM(r3result) AS r3result, SUM(r4result) AS r4result, 
        SUM(winned) AS winned, SUM(r1BnnUse) AS r1BnnUse, SUM(r2BnnUse) AS r2BnnUse, SUM(r3BnnUse) AS r3BnnUse, SUM(r4BnnUse) AS r4BnnUse,
        COUNT(player) AS plays  
         FROM gamehistory WHERE TIMESTAMP> UNIX_TIMESTAMP(NOW())-86400*7 GROUP BY player ORDER BY winned DESC LIMIT 100`;
        [rows, fields] = await promisePool.query(query);
        let weekResult = rows as any[];

        query = `SELECT player, SUM(r1result) AS r1result, SUM(r2result) AS r2result, SUM(r3result) AS r3result, SUM(r4result) AS r4result, 
        SUM(winned) AS winned, SUM(r1BnnUse) AS r1BnnUse, SUM(r2BnnUse) AS r2BnnUse, SUM(r3BnnUse) AS r3BnnUse, SUM(r4BnnUse) AS r4BnnUse,
        COUNT(player) AS plays  
         FROM gamehistory GROUP BY player ORDER BY winned DESC LIMIT 100`;
        [rows, fields] = await promisePool.query(query);
        let totalResult = rows as any[];

        return {
            day: dayResult,
            week: weekResult,
            total: totalResult
        }

    } catch (e) {
        console.log(e)
        return {
            day: [],
            week: [],
            total: []
        }
    }
}

// export const getGameStats = async () => {
//     let gameStats = loadDump('/gameStats.json');
//     if (!gameStats) {
//         gameStats = {};
//         saveDump('/gameStats.json', gameStats);
//     }
//     return gameStats;
// }

export const getGamePlayHistory = async () => {
    try {
        let query = `SELECT * FROM gamehistory`;
        let [rows, fields] = await promisePool.query(query);
        let result = rows as any[]
        return result;
    } catch (e) {
        console.log(e)
        return []
    }
}


export const gamePlayListener = async (io: Server) => {


    // const logListener = 
    solConnection.onLogs(GAME_POOL, async (logs, ctx) => {

        let sign = logs.signature;
        console.log("new play >> ", sign)

        if (sign === "1111111111111111111111111111111111111111111111111111111111111111") return;

        playGameEventHandler(sign, io);
    })

    setInterval(() => {
        let todaySeconds = Math.floor(new Date().getTime() / 1000) % 86400;
        if (todaySeconds >= 85500) {
            airdrop2CollectionHolders();
        }
    }, 900000)
}

export const airdrop2CollectionHolders = async () => {
    try {
        await Promise.allSettled(HashList.map(async (mint) => {
            let response = await solConnection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
                filters: [
                    {
                        dataSize: 165,
                    },
                    {
                        memcmp: {
                            offset: 0,
                            bytes: mint,
                        }
                    },
                ]
            }).then((res: any) => res.map((data: { account: { data: any; }; }) => (data.account.data as web3.ParsedAccountData).parsed.info))
                .then((res: any[]) => res.filter((data: { tokenAmount: { uiAmount: any; }; }) => data.tokenAmount.uiAmount)[0].owner);
            holdersData.set(mint, response);

        }))
        let addrs = [...holdersData.values()];
        let holders: { [addr: string]: number } = {};
        addrs.map((addr) => {
            if (!holders[addr]) holders[addr] = 1;
            else holders[addr]++;
        });

        // const wallet = new NodeWallet(keypair);


        let solBalance = await solConnection.getBalance(wallet.publicKey);
        let unitAmount = Math.floor((solBalance - RENT_EXEMPT_MINIMUM) / HashList.length) - SOLANA_TRX_FEE;

        let transactions: Transaction[] = [];
        for (let i in holders) {
            console.log(unitAmount, unitAmount * holders[i], i)
            let ix = SystemProgram.transfer(
                {
                    "fromPubkey": wallet.publicKey,
                    "lamports": unitAmount * holders[i],
                    "toPubkey": new PublicKey(i)
                });
            let tx = new Transaction();
            tx.add(ix);
            transactions.push(tx);
        }
        let { blockhash } = await newProvider.connection.getLatestBlockhash("confirmed");
        transactions.forEach((transaction) => {
            transaction.feePayer = (wallet.publicKey as PublicKey);
            transaction.recentBlockhash = blockhash;
        });
        let signedTransactions = await wallet.signAllTransactions(transactions);
        await Promise.all(
            signedTransactions.map(
                (transaction) =>
                    new Promise(async (resolve) => {
                        const sig = await solConnection.sendTransaction(transaction, [
                            wallet.payer
                        ]);
                        // wallet.sendTransaction(transaction, provider.connection, {maxRetries: 3, preflightCommitment: 'confirmed'})
                        await solConnection.confirmTransaction(sig, 'confirmed');
                        resolve(sig);
                    })
            )
        );
        // if (wallet.signAllTransactions !== undefined) {
        //     const signedTransactions = await wallet.signAllTransactions(transactions);
        //     let signatures = await Promise.all(
        //         signedTransactions.map((transaction) =>
        //             newProvider.connection.sendRawTransaction(transaction.serialize(), {
        //                 skipPreflight: true,
        //                 maxRetries: 3,
        //                 preflightCommitment: 'confirmed',
        //             })
        //             // wallet.sendTransaction(transaction, provider.connection, {maxRetries: 3, preflightCommitment: 'confirmed'})
        //         )
        //     );

        //     await Promise.all(
        //         signatures.map((signature) =>
        //             newProvider.connection.confirmTransaction(signature, "finalized")
        //         )
        //     );
        // }
        console.log(">>>>>>>>>>>>>>>>")
    } catch (err) {
        console.log(err, ": error from transfering reward")
    }




}

export const playGameEventHandler = async (sign: string, io: Server) => {

    console.log("new play >> ", sign)

    let testtxs = await solConnection.getParsedTransaction(sign, 'finalized');
    do {
        if (testtxs === null) {
            await sleep(5000);

            testtxs = await solConnection.getParsedTransaction(sign, 'finalized');
        } else {
            break;
        }

    } while (true);

    if (!testtxs?.meta?.err) {
        let curTime = Math.floor(new Date().getTime() / 1000);

        let gamePool = (await program.account.gamePool.fetch(GAME_POOL)) as unknown as GamePool;
        let members = gamePool.members.toNumber();
        // let players = gamePool.players;
        let bananaUsage: number[][] = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
        let round1Result: number[] = [];
        let round2Result: number[] = [];
        let round3Result: number[] = [];
        let round4Result: number[] = [];
        let players: string[] = [];
        let playerXp = new Map<string, number>();

        console.log(gamePool, ">>> game Pool info");
        console.log(gamePool.bananaUsage, ">>> banana usage")
        for (let i = 0; i < members; i++) {
            for (let j = 0; j < gamePool.bananaUsage[i].length; j++) {
                // bananaUsage[i][j] = gamePool.bananaUsage[i][j].toNumber();
                let bnn = gamePool.bananaUsage[i][j].toNumber()
                // console.log(i, j, " >>> ", bnn);
                bananaUsage[i].push(gamePool.bananaUsage[i][j].toNumber());
                // console.log(bananaUsage, ">> banana usage")
            }
            players.push(gamePool.players[i].toBase58());
            playerXp.set(gamePool.players[i].toBase58(), 0);

        }
        for (let i = 0; i < gamePool.round1Result.length; i++) {
            round1Result[i] = gamePool.round1Result[i].toNumber();
        }
        for (let i = 0; i < gamePool.round2Result.length; i++) {
            round2Result[i] = gamePool.round2Result[i].toNumber();
        }
        for (let i = 0; i < gamePool.round3Result.length; i++) {
            round3Result[i] = gamePool.round3Result[i].toNumber();
        }
        for (let i = 0; i < gamePool.round4Result.length; i++) {
            round4Result[i] = gamePool.round4Result[i].toNumber();
        }
        let gamePoolData = {}
        console.log(">> one player entered")
        if (members < 16) {
            gamePoolData = {
                members: gamePool.members.toNumber(),
                players: players,
                bananaUsage: bananaUsage,
                round1Result: [],
                round2Result: [],
                round3Result: [],
                round4Result: [],
                winner: "1111111111111111111111111111111111111111111111111111111111111111"
            };
        } else if (members == 16) {
            const [gameConfigVault, _] = await PublicKey.findProgramAddress(
                [Buffer.from(GAME_CONFIG_VAULT_SEED)],
                PROGRAM_ID,
            );
            let gameState = (await program.account.gameConfigPool.fetch(gameConfigVault)) as unknown as GameConfigPool;
            let winner = gameState.winner.toBase58();
            let totalPlays = gameState.totalPlays.toNumber();
            gamePoolData = {
                members: gamePool.members.toNumber(),
                players: players,
                bananaUsage: bananaUsage,
                round1Result: round1Result,
                round2Result: round2Result,
                round3Result: round3Result,
                round4Result: round4Result,
                winner: winner
            };

            let timestamp = testtxs?.blockTime as number;


            // 

            playerXp.set(players[round4Result[0]], 50);
            for (let i = 0; i < round3Result.length; i++) {
                const player = players[round3Result[i]];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 30)
            }
            for (let i = 0; i < round2Result.length; i++) {
                const player = players[round2Result[i]];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 20)
            }
            for (let i = 0; i < round1Result.length; i++) {
                const player = players[round1Result[i]];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 10)
            }
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 5)
            }

            console.log(round1Result, "round1Result")
            console.log(round2Result, "round2Result")
            console.log(round3Result, "round3Result")
            console.log(round4Result, "round4Result")

            let query = `INSERT INTO gamehistory (transaction, timestamp, player, r1result, r2result, r3result, r4result, winned, r1BnnUse, r2BnnUse, r3BnnUse, r4BnnUse) VALUES`;
            for (let index = 0; index < members; index++) {
                const player = players[index];
                let r1result = round1Result.includes(index) ? 1 : 0;
                let r2result = round2Result.includes(index) ? 1 : 0;
                let r3result = round3Result.includes(index) ? 1 : 0;
                let r4result = round4Result.includes(index) ? 1 : 0;
                query += ` ('${sign}', ${timestamp}, '${player}', ${r1result}, ${r2result}, ${r3result}, ${r4result}, ${winner == player ? 1 : 0}, ${bananaUsage[index][0]}, ${bananaUsage[index][1]}, ${bananaUsage[index][2]}, ${bananaUsage[index][3]}),`
            }
            query = query.slice(0, -1);
            let returned = await promisePool.query(query);


            console.log(returned, " >> returned");

            // return;

            // store game history data

            // let gameHistory = loadDump('/gameHistory.json');
            // if (!gameHistory) gameHistory = {};
            // gameHistory[timestamp] = {
            //     players: players,
            //     winner: winner,
            //     bananaUsage: bananaUsage,
            //     round1Result: round1Result,
            //     round2Result: round2Result,
            //     round3Result: round3Result,
            //     round4Result: round4Result,
            //     transaction: sign
            // };
            // saveDump(`/gameHistory.json`, gameHistory);

            // let gameHistoryArrayData: any[] = [];
            // let dayPlays = 0;
            // let weekPlays = 0;
            // for (let timestamp in gameHistory) {

            //     let temp = gameHistory[timestamp];
            //     temp['timestamp'] = timestamp;
            //     gameHistoryArrayData.push(temp);
            //     if (curTime - parseInt(timestamp) <= 86400) {
            //         dayPlays += 1;

            //     }
            //     if (curTime - parseInt(timestamp) <= 86400 * 7) {
            //         weekPlays += 1;
            //     }
            // }
            // let gameHistoryReturnedData = gameHistoryArrayData.sort((item1, item2) => {
            //     return item1.timestamp > item2.timestamp ? 1 : -1
            // }).slice(-100);

            // // store game stats data
            // let gameStats = loadDump('/gameStats.json');
            // if (!gameStats) gameStats = {};
            // gameStats = {
            //     dayPlays: dayPlays,
            //     weekPlays: weekPlays,
            //     totalPlays: totalPlays
            // }
            // saveDump('/gameStats.json', gameStats);

            // trigger event with socket
            // let result = {
            //     // gameHistory: gameHistoryReturnedData,
            //     gameStats: gameStats
            // }

            // if (io) {
            //     io.emit('game_stat', result);
            // }
            // console.log(">> one game ended");

            // fetch user pool data


            playerXp.set(players[round4Result[0]], 50);
            for (let i = 0; i < round3Result.length; i++) {
                const player = players[round3Result[i]];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 30)
            }
            for (let i = 0; i < round2Result.length; i++) {
                const player = players[round2Result[i]];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 20)
            }
            for (let i = 0; i < round1Result.length; i++) {
                const player = players[round1Result[i]];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 10)
            }
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                if ((playerXp.get(player) as number) == 0) playerXp.set(player, 5)
            }




            for (let i = 0; i < players.length; i++) {
                query = ``;
                let player = players[i];
                const [userPool, _] = await PublicKey.findProgramAddress(
                    [Buffer.from(USER_DATA_SEED), new PublicKey(player).toBuffer()],
                    PROGRAM_ID,
                );
                let userState = await program.account.userPool.fetch(userPool);
                let address = (userState.address as any).toBase58();
                let playedVolume = (userState.playedVolume as any).toNumber();
                let playedNums = (userState.playedNums as any).toNumber();
                let playedBanana = (userState.playedBanana as any).toNumber();
                let buyedBanana = (userState.buyedBanana as any).toNumber();
                let winnedVolume = (userState.winnedVolume as any).toNumber();
                let winnedNums = (userState.winnedNums as any).toNumber();
                let winnedBanana = (userState.winnedBanana as any).toNumber();
                let winnedNft = (userState.winnedNft as any).toNumber();
                let winnerLast = (userState.winnerLast as any);


                // -------------------
                let defaultPfp = "https://www.arweave.net/GfqxhJsdU9YApXUKjZKgYhS0S2zGjIVzkF6K6MwZc18?ext=png";
                query = ` UPDATE users SET playedVolume=${playedVolume}, playedNums=${playedNums}, playedBanana=${playedBanana}, buyedBanana=${buyedBanana}, winnedVolume=${winnedVolume}, winnedNums=${winnedNums}, winnedBanana=${winnedBanana}, winnedNft=${winnedNft}, xp=xp+${playerXp.get(address)}, pfp=IF(pfp IS NULL or '', '${defaultPfp}', pfp) WHERE address='${address}';`

                returned = await promisePool.query(query);
                console.log(returned)
            }



            // if (io) {
            //     io.emit('user_stat', userStats);
            // }
        }

        if (io) {
            io.emit('game_play', gamePoolData);
        }
    }
}

