/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import styles from './index.module.css';
import { useWallet } from '@solana/wallet-adapter-react';

import { sleep } from '../../context/utils';
import axios from 'axios';
import getConfig from 'next/config'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import {
    cross3 as CloseIcon
} from '../svgIcons'
const { publicRuntimeConfig } = getConfig()
const cluster = publicRuntimeConfig.SOLANA_NETWORK;
const SERVER_URL = publicRuntimeConfig.SERVER_URL;
interface Props {
    setShowStat: Function
}
const StatsContent = (props: Props) => {
    const wallet = useWallet();
    const [menu, setMenu] = React.useState("day")
    const [tableData, setTableData] = React.useState<any[]>([])

    const [xp, setXp] = React.useState(0)
    const [profit, setProfit] = React.useState(0)
    const [playedNums, setPlayedNums] = React.useState(0)
    const [winnedNums, setWinnedNums] = React.useState(0)
    const [finalRound, setFinalRound] = React.useState(0)

    const loadData = async () => {

        if (!wallet || !wallet.publicKey) {
            return;
        }
        let result = await axios.get(SERVER_URL + `/api/user_stats?address=${wallet.publicKey?.toBase58()}`);
        console.log(result, ">>>>>>>>>>>>>>>>>>>>>>>>>")
        setXp(result.data.xp)
        setProfit(((result.data.winnedVolume - result.data.playedVolume) / LAMPORTS_PER_SOL))
        setPlayedNums(result.data.playedNums)
        setWinnedNums(result.data.winnedNums)
        setFinalRound(result.data.finalRoundReachedNums)
    }
    React.useEffect(() => {
        loadData()
    }, [])
    return (

        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.content}>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <span className={styles.numberLabel}>
                                {
                                    xp
                                }
                            </span>
                            <span className={styles.textLabel}>
                                XP
                            </span>
                        </div>
                        {/* <div className={styles.item}>
                            <span className={styles.numberLabel}>
                                5000
                            </span>
                            <span className={styles.textLabel}>
                                XP
                            </span>
                        </div> */}
                        <div className={styles.item}>
                            <span className={styles.numberLabel}>
                                {
                                    profit
                                }
                            </span>
                            <span className={styles.textLabel}>
                                SOL P&L
                            </span>
                        </div>
                    </div>
                    <div className={styles.gradientLine}>

                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <span className={styles.numberLabel}>
                                {
                                    playedNums
                                }
                            </span>
                            <span className={styles.textLabel}>
                                games played
                            </span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.numberLabel}>
                                {
                                    winnedNums
                                }
                            </span>
                            <span className={styles.textLabel}>
                                games won
                            </span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.numberLabel}>
                                {
                                    finalRound
                                }
                            </span>
                            <span className={styles.textLabel}>
                                reached final round
                            </span>
                        </div>
                    </div>

                </div>

                <span className={styles.closeIconWrapper} onClick={() => props.setShowStat(false)}>
                    <span className={styles.closeIcon}>
                        <CloseIcon />
                    </span>
                </span>
            </div>


        </div>


    )
}

export default StatsContent;
