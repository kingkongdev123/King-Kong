import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import styles from './topbar.module.css';

import {
    history as HistoryIcon,
    leaderboard as LeaderboardIcon,
    balance as BalanceIcon,
    banana as BananaIcon,
    win as WinsIcon
} from '../svgIcons'

const TopBar = () => {

    return (
        <>
            <div className={styles.container}>
                <span>
                    Logo
                </span>
                <span>
                    <span className={styles.icon}>
                        <HistoryIcon />
                    </span>
                    History
                </span>
                <span>
                    <span className={styles.icon}>
                        <LeaderboardIcon />
                    </span>
                    Leaderboard
                </span>
                <span>
                    <span className={styles.icon}>
                        <BalanceIcon />
                    </span>
                    Balance
                </span>
                <span>
                    <span className={styles.icon}>
                        <BananaIcon />
                    </span>
                    Bananas
                </span>
                <span>
                    <span className={styles.icon}>
                        <WinsIcon />
                    </span>
                    Wins
                </span>
            </div>

        </>
    )
}

export default TopBar;
