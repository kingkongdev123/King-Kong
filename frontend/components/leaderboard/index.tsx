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



const LeaderboardContent = () => {
    const [menu, setMenu] = React.useState("day")
    return (

        <div className={styles.container}>
            <div className={styles.content}>
                <p className={styles.title}>
                    Leaderboard
                </p>
                <div className={styles.menuContainer}>
                    <div className={styles.menuWrapper}>
                        <span className={`${menu == "day" && styles.menuActive}`} onClick={() => setMenu("day")}>
                            Daily
                            <div className={styles.menuBorder}>
                            </div>
                        </span>
                        <span className={`${menu == "week" && styles.menuActive}`} onClick={() => setMenu("week")}>
                            Weekly
                            <div className={styles.menuBorder}>
                            </div>
                        </span>
                        <span className={`${menu == "all" && styles.menuActive}`} onClick={() => setMenu("all")}>
                            All Time
                            <div className={styles.menuBorder}>
                            </div>
                        </span>
                    </div>

                </div>
                <div className={styles.dataTable}>
                    <div className={styles.header}>
                        <span>
                            Player ID
                        </span>
                        <span>
                            Amount Won
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span>
                            <img src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fbafybeigkkv6w7dbkygm7jjnxfeqkkb5lpjt7umihturkgxf7qnjt5lxtg4.ipfs.dweb.link%2F5752.png%3Fext%3Dpng'} alt="pfp" className={styles.pfp} />
                            <span className={styles.userInfo}>
                                <span>
                                    G42V1DfQKKHrxxfdjDrRphPStZx5Jqu2JwShfN3WoKmK
                                </span>
                                <span>
                                    612 games played
                                </span>
                            </span>

                        </span>
                        <span>
                            200 SOL
                        </span>
                    </div>
                </div>
            </div>


        </div>


    )
}

export default LeaderboardContent;
