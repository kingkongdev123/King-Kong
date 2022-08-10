/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import styles from './landingPage.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import {
    star as StarIcon
} from '../svgIcons'
interface Props {
    setPageStatus: Function
}

const LandingPage = (props: Props) => {

    const wallet = useWallet();

    const enterGame = async () => {

        props.setPageStatus('gameStatus');
    }
    React.useEffect(() => {
        console.log(wallet.publicKey?.toBase58())
    }, [wallet])

    return (
        <>
            <img src={'/img/King_KK 1.png'} alt='LC' className={styles.lCharacter} />
            <img src={'/img/King_KK 2.png'} alt='RC' className={styles.rCharacter} />
            {
                !wallet.connected &&
                <img src={'/img/lightning_bolt_center.png'} alt='lightning' className={styles.cLightning} />
            }
            {

            }
            {
                wallet.connected &&
                <>
                    <img src={'/img/lightning_bolt_left.png'} alt='lightning' className={styles.lLightning} />
                    <div className={styles.gradientBG}>

                    </div>
                    <img src={'/img/lightning_bolt_right.png'} alt='lightning' className={styles.rLightning} />
                </>
            }
            {
                !wallet.connected ?
                    <img src={'/img/KK_Logo_Text.png'} alt='KK_Text' className={styles.kkText} /> :
                    <img src={'/img/KK_Logo_Text.png'} alt='KK_Text' className={styles.kkText2} />
            }



            <span className={styles.wltBtnWrapper}>
                {
                    !wallet.connected && !wallet.connecting &&
                    <WalletMultiButton />
                }
                {
                    wallet.connected &&
                    <>
                        <span className={styles.landingBtn} onClick={() => enterGame()}>
                            ENTER THE JUNGLE
                        </span>
                        <span className={styles.enteryFeeLabel}>
                            1 SOL
                        </span>
                    </>
                }
            </span>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                maxWidth="xs"
                open={wallet.connecting}
                keepMounted
            >

                <DialogContent >
                    <div className={styles.starWrapper}>
                        <span className={styles.starIcon}>
                            <StarIcon />
                        </span>
                        <p className={styles.loading}>
                            Loading<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </p>
                    </div>
                </DialogContent>

            </Dialog>
        </>
    )
}

export default LandingPage;
