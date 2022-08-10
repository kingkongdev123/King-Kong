/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import styles from './gameStatusShow.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import {
    lock as LockIcon
} from '../svgIcons'


const GameStatusShow = () => {
    const wallet = useWallet();
    React.useEffect(() => {
        console.log(wallet.publicKey?.toBase58())
    }, [wallet])

    return (
        <div className={styles.container}>
            <img src={'/img/KK_Logo_Text.png'} alt='kkMark' className={styles.gameMark} />
            <img src={'/img/GrandPrize.png'} alt='PrizeBox' className={styles.prizeBox} />
            <div className={styles.leftPanel}>
                <img src={'/img/LHS_Lines.png'} alt='lhs' className={styles.lhsLine} />
                {/* <div className={styles.leftR4Line}></div> */}
                <div className={`${styles.r4Player1} ${styles.r4Player}`}>
                    <span className={styles.r4LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r3PlayerL1}`}>
                    <span className={styles.r3LockIcon}>

                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r3PlayerL2}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerL1}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerL2}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>

                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerL3}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerL4}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>

                {/* r1 players */}
                <div className={`${styles.r1Player} ${styles.r1PlayerL1}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerL2}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerL3}`}>

                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerL4}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>

                <div className={`${styles.r1Player} ${styles.r1PlayerL5}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerL6}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerL7}`}>

                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerL8}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>


            </div>

            <div className={styles.rightPanel}>
                <img src={'/img/RHS_Lines.png'} alt='lhs' className={styles.rhsLine} />

                <div className={`${styles.r4Player2} ${styles.r4Player}`}>
                    <span className={styles.r4LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r3PlayerR1}`}>
                    <span className={styles.r3LockIcon}>

                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r3PlayerR2}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerR1}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerR2}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>

                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerR3}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>
                <div className={`${styles.r3Player} ${styles.r2PlayerR4}`}>
                    <span className={styles.r3LockIcon}>
                        <LockIcon />
                    </span>
                </div>

                {/* r1 players */}
                <div className={`${styles.r1Player} ${styles.r1PlayerR1}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerR2}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerR3}`}>

                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerR4}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>

                <div className={`${styles.r1Player} ${styles.r1PlayerR5}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerR6}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerR7}`}>

                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
                <div className={`${styles.r1Player} ${styles.r1PlayerR8}`}>
                    <img src={'/img/avatar.png'} alt='avatar' className={styles.r1Avatar} />
                </div>
            </div>
        </div>
    )
}

export default GameStatusShow;
