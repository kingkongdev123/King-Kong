import React from 'react';

import styles from './footer.module.css';

import {
    history as HistoryIcon,
    leaderboard as LeaderboardIcon,
    balance as BalanceIcon,
    banana as BananaIcon,
    win as WinsIcon
} from '../svgIcons'

const Footer = () => {

    return (

        <div className={styles.container}>
            <p className={styles.footerText}>
                © 2022, No house edge community NFT Sol gaming
            </p>
        </div>


    )
}

export default Footer;
