/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import styles from './content.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import LandingPage from './landingPage';
import GameStatusShow from './gameStatusShow';



const Content = () => {
    const [showStatus, setShowStatus] = React.useState('landing');
    const wallet = useWallet();
    React.useEffect(() => {
        console.log(wallet.publicKey?.toBase58())
    }, [wallet])


    return (
        <>
            <div className={styles.container}>
                <img src={'/img/BG.png'} alt='bg' className={styles.bgImg} />
                {

                    showStatus == 'landing' &&
                    <LandingPage
                        setPageStatus={(status: string) => setShowStatus(status)}
                    />
                }
                {
                    showStatus == 'gameStatus' &&
                    <GameStatusShow />
                }


            </div>

        </>
    )
}

export default Content;
