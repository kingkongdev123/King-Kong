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
import { errorAlert } from '../toastGroup';
import { getGameState } from '../../context/script';

import {
    start1 as Start1Icon,
    start2 as Start2Icon,
    start3 as Start3Icon,
    cross3 as CrossIcon
} from '../svgIcons'
import { Wallet } from '@project-serum/anchor';
const { publicRuntimeConfig } = getConfig()
const cluster = publicRuntimeConfig.SOLANA_NETWORK;
const SERVER_URL = publicRuntimeConfig.SERVER_URL;
interface Props {
    showLeaderboard: boolean,
    setShowLeaderboard: Function
}
const LeaderboardContent = (props: Props) => {
    const wallet = useWallet();

    const [menu, setMenu] = React.useState("day")
    const [tableData, setTableData] = React.useState<any[]>([])
    const [dayOrder, setDayOrder] = React.useState<any[]>([]);
    const [weekOrder, setWeekOrder] = React.useState<any[]>([]);
    const [totalOrder, setTotalOrder] = React.useState<any[]>([]);
    const [onePlayReward, setOnePlayReward] = React.useState(0)
    const loadData = async () => {
        try {
            let result = await axios.get(SERVER_URL + "/api/game_stats");
            let data = result.data;

            console.log(data)
            setDayOrder(data.day)
            setWeekOrder(data.week)
            setTotalOrder(data.total)
            let gameState = await getGameState();
            console.log(gameState)
            setOnePlayReward(gameState.rewardAmount)
        } catch (e) {
            console.log(e)
            errorAlert("Server Error")
        }
    }
    React.useEffect(() => {
        loadData()
    }, [])
    return (

        <div className={styles.container}>
            <div className={styles.content}>

                <div className={styles.menuContainer}>

                    <span className={`${menu == "day" && styles.menuActive}`} onClick={() => setMenu("day")}>
                        Daily

                    </span>
                    <span className={`${menu == "week" && styles.menuActive}`} onClick={() => setMenu("week")}>
                        Weekly

                    </span>
                    <span className={`${menu == "total" && styles.menuActive}`} onClick={() => setMenu("total")}>
                        All Time

                    </span>


                </div>
                <div className={styles.dataTable}>
                    <div className={styles.header}>
                        <span>
                            Player ID
                        </span>
                        <span>
                            Amount Won ( SOL )
                        </span>
                    </div>

                    {menu == "day" && dayOrder.length > 0 &&
                        dayOrder.map((item, idx) => {

                            return (
                                <div className={styles.row} key={idx}>
                                    <span >
                                        <img src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fbafybeigkkv6w7dbkygm7jjnxfeqkkb5lpjt7umihturkgxf7qnjt5lxtg4.ipfs.dweb.link%2F5752.png%3Fext%3Dpng'} alt="pfp" className={styles.pfp} />
                                        <span className={styles.userInfo}>
                                            <span>
                                                {
                                                    item.player.slice(0, 6) + "..." + item.player.slice(-6)
                                                }
                                            </span>
                                            <span>
                                                {item.plays} games played
                                            </span>
                                        </span>
                                    </span>
                                    {idx == 0 &&
                                        <span className={styles.firstWinMarkWrapper}>
                                            <span className={styles.star1Icon}>
                                                <Start1Icon />
                                            </span>
                                        </span>
                                    }
                                    {idx == 1 &&
                                        <span className={styles.secondWinMarkWrapper}>
                                            <span className={styles.star2Icon}>
                                                <Start2Icon />
                                            </span>
                                        </span>
                                    }
                                    {idx == 2 &&
                                        <span className={styles.thirdWinMarkWrapper}>
                                            <span className={styles.star3Icon}>
                                                <Start3Icon />
                                            </span>
                                        </span>
                                    }

                                    <span>
                                        {
                                            parseInt(item.winned) != 0 ?
                                                (parseInt(item.winned) * onePlayReward / LAMPORTS_PER_SOL).toFixed(1) : 0
                                        } SOL
                                    </span>
                                </div>
                            )
                        })
                    }

                    {menu == "week" && weekOrder.length > 0 &&
                        weekOrder.map((item, idx) => {

                            return (
                                <div className={styles.row} key={idx}>
                                    <span >
                                        <img src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fbafybeigkkv6w7dbkygm7jjnxfeqkkb5lpjt7umihturkgxf7qnjt5lxtg4.ipfs.dweb.link%2F5752.png%3Fext%3Dpng'} alt="pfp" className={styles.pfp} />
                                        <span className={styles.userInfo}>
                                            <span>
                                                {
                                                    item.player.slice(0, 6) + "..." + item.player.slice(-6)
                                                }
                                            </span>
                                            <span>
                                                {item.plays} games played
                                            </span>
                                        </span>

                                    </span>
                                    {idx == 0 &&
                                        <span className={styles.firstWinMarkWrapper}>
                                            <span className={styles.star1Icon}>
                                                <Start1Icon />
                                            </span>
                                        </span>
                                    }
                                    {idx == 1 &&
                                        <span className={styles.secondWinMarkWrapper}>
                                            <span className={styles.star2Icon}>
                                                <Start2Icon />
                                            </span>
                                        </span>
                                    }
                                    {idx == 2 &&
                                        <span className={styles.thirdWinMarkWrapper}>
                                            <span className={styles.star3Icon}>
                                                <Start3Icon />
                                            </span>
                                        </span>
                                    }
                                    <span>
                                        {
                                            parseInt(item.winned) != 0 ?
                                                (parseInt(item.winned) * onePlayReward / LAMPORTS_PER_SOL).toFixed(1) : 0
                                        } SOL
                                    </span>
                                </div>
                            )
                        })
                    }
                    {
                        menu == "total" && totalOrder.length > 0 &&
                        totalOrder.map((item, idx) => {

                            return (
                                <div className={styles.row} key={idx}>
                                    <span >
                                        <img src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fbafybeigkkv6w7dbkygm7jjnxfeqkkb5lpjt7umihturkgxf7qnjt5lxtg4.ipfs.dweb.link%2F5752.png%3Fext%3Dpng'} alt="pfp" className={styles.pfp} />
                                        <span className={styles.userInfo}>
                                            <span>
                                                {
                                                    item.player.slice(0, 6) + "..." + item.player.slice(-6)
                                                }
                                            </span>
                                            <span>
                                                {item.plays} games played
                                            </span>
                                        </span>

                                    </span>
                                    {idx == 0 &&
                                        <span className={styles.firstWinMarkWrapper}>
                                            <span className={styles.star1Icon}>
                                                <Start1Icon />
                                            </span>
                                        </span>
                                    }
                                    {idx == 1 &&
                                        <span className={styles.secondWinMarkWrapper}>
                                            <span className={styles.star2Icon}>
                                                <Start2Icon />
                                            </span>
                                        </span>
                                    }
                                    {idx == 2 &&
                                        <span className={styles.thirdWinMarkWrapper}>
                                            <span className={styles.star3Icon}>
                                                <Start3Icon />
                                            </span>
                                        </span>
                                    }

                                    <span>
                                        {
                                            parseInt(item.winned) != 0 ?
                                                (parseInt(item.winned) * onePlayReward / LAMPORTS_PER_SOL).toFixed(1) : 0
                                        } SOL
                                    </span>
                                </div>
                            )
                        })
                    }



                </div>

                <span className={styles.closeIcon} onClick={() => props.setShowLeaderboard(false)}>
                    <CrossIcon />
                </span>
            </div>


        </div>


    )
}

export default LeaderboardContent;
