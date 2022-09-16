/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import styles from './topbar.module.css';
import { withRouter, NextRouter, useRouter } from 'next/router'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import {
  history as HistoryIcon,
  leaderboard as LeaderboardIcon,
  balance as BalanceIcon,
  banana2 as BananaIcon,
  crown as CrownIcon,
  win as WinsIcon,
  onebnn as OneBnnIcon,
  twobnn as TwoBnnIcon,
  close as CloseIcon,
  tick as TickIcon
} from '../svgIcons'
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, web3 } from '@project-serum/anchor';

import getConfig from 'next/config'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BANANA_TOKEN_DECIMAL, BANANA_TOKEN_MINT } from '../../context/types';
import { getTokenAccount, getTokenAccountBalance, isTokenExist } from '../../context/utils';
import { getUserState } from '../../context/script';
import { errorAlert, successAlert } from '../toastGroup';
import { buyBnn } from '../../context/scripts';
import LeaderboardContent from '../leaderboard';
import StatsContent from '../stats'

const { publicRuntimeConfig } = getConfig()
const cluster = publicRuntimeConfig.SOLANA_NETWORK;

let solConnection = new web3.Connection(web3.clusterApiUrl(cluster));

interface Props {
  gameState: any
}

const TopBar = (props: Props) => {

  const router = useRouter();
  const wallet = useWallet()
  const [solbalance, setSolbalance] = React.useState(0);
  const [bnnBalance, setBnnBalance] = React.useState(0);
  const [openBuyBnnDialog, setOpenBuyBnnDialog] = React.useState(false)

  const [bnnItemSelected, setBnnItemSelected] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const [buyBnnTooltipShow, setBuyBnnTooltipShow] = React.useState(false)

  const [wins, setWins] = React.useState(0);
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [showStat, setShowStat] = React.useState(false);

  const closeBuyBnnDialog = () => {
    setOpenBuyBnnDialog(false)
  }

  const handleBuyBnnAmountChange = (value: string) => {
    setBnnItemSelected(parseFloat(value));
  }

  const setUserInfo = async () => {
    if (!wallet.publicKey) return;
    let balance = await solConnection.getBalance(wallet?.publicKey)
    let balanceFloatString =
      (balance / LAMPORTS_PER_SOL).toString().split(".").length == 2 ?
        (balance / LAMPORTS_PER_SOL).toString().split(".")[0] + "." + (balance / LAMPORTS_PER_SOL).toString().split(".")[1].slice(0, Math.min(2, (balance / LAMPORTS_PER_SOL).toString().split(".")[1].length)) :
        (balance / LAMPORTS_PER_SOL).toString()
    setSolbalance(parseFloat(balanceFloatString));

    // let bnnAmount = await solConnection.getTokenSupply(BANANA_TOKEN_MINT);
    // console.log(bnnAmount, "==============================")
    // setBnnBalance(bnnAmount.value.uiAmount as number);
    if (await isTokenExist(BANANA_TOKEN_MINT, wallet.publicKey, solConnection)) {


      let tokenAccount = await getTokenAccount(BANANA_TOKEN_MINT, wallet.publicKey, solConnection);

      let result = await getTokenAccountBalance(tokenAccount, solConnection)
      setBnnBalance(result ? result : 0);
    } else {
      setBnnBalance(0);
    }

    let userstate = await getUserState(wallet.publicKey);
    setWins(userstate ? userstate.winnedNums : 0)
  }

  const buyBnns = async () => {
    try {
      if (!bnnItemSelected || bnnItemSelected <= 0) {
        errorAlert("Token Amount Must Be Specified.");
        return;
      }
      if (!wallet || !wallet.publicKey) return;
      let tokenAmount = bnnItemSelected * Math.pow(10, BANANA_TOKEN_DECIMAL);
      setLoading(true)
      // setPrePlayDialog(false)

      let result = await buyBnn(wallet, tokenAmount)
      if (result) successAlert("Token Purchase Successed!");
      if (await isTokenExist(BANANA_TOKEN_MINT, wallet.publicKey, solConnection)) {


        let tokenAccount = await getTokenAccount(BANANA_TOKEN_MINT, wallet.publicKey, solConnection);

        let result = await getTokenAccountBalance(tokenAccount, solConnection)
        setBnnBalance(result ? result : 0);
      } else {
        setBnnBalance(0);
      }
      // else errorAlert("Token Purchase Failed")

      // setPrePlayDialog(true)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.log("error occured : ", e)
    }
  }

  React.useEffect(() => {
    console.log(router, " >> router")
    if (wallet.connected && wallet.publicKey) {
      setUserInfo()
    }
  }, [wallet.connected])

  return (
    <>
      <div className={styles.container}>
        <span className={styles.flexColume}>
          <span className={styles.totalPlayLabel}>
            TOTAL GAMES PLAYED
          </span>
          <span className={styles.totalPlayNums}>
            220
          </span>
        </span>
        <span>
          <span className={`${styles.midMenu} ${showStat && styles.menuActive}`} onClick={() => { setShowStat(true); setShowLeaderboard(false); }}>
            STATS
            {showStat &&
              <span className={styles.menuActiveSpot}>

              </span>
            }
          </span>
          <span className={`${styles.midMenu} ${showLeaderboard && styles.menuActive}`} onClick={() => {
            setShowLeaderboard(true); setShowStat(false);
          }}>
            LEADERBOARD
            {showLeaderboard &&
              <span className={styles.menuActiveSpot}>

              </span>
            }
          </span>
        </span>
        <span className={`${styles.rightMenu} ${(!wallet || (wallet && !wallet.connected)) && styles.visibilityHide}`}>
          <span className={styles.flexColume}>
            <span className={styles.solLabel}>
              SOL
            </span>
            <span className={styles.solBalance}>
              {
                solbalance
              }
            </span>
          </span>
          <span className={`${styles.bnnIcon}`} onClick={() => setOpenBuyBnnDialog(true)}>
            <span className={`${styles.icon} `} >
              {/* ${styles.bnnIcon} */}
              {/* onMouseEnter={() => setBuyBnnTooltipShow(true)} onMouseLeave={() => setBuyBnnTooltipShow(false)} */}
              <BananaIcon />
            </span>
            <span className={styles.iconLabel}>
              {
                Math.floor(bnnBalance)
              }
            </span>
            {
              <span className={styles.buyBnnTooltip}>
                <span className={styles.buyBnnTooltipBody}>
                  Buy<br />
                  Bananas
                </span>
                <span className={styles.buyBnnTooltipArrow}>
                </span>
              </span>
            }

          </span>

          <span className={styles.iconWrapper}>
            <span className={styles.icon}>
              <CrownIcon />
            </span>
            <span className={styles.iconLabel}>
              {
                wins
              }
            </span>
          </span>
        </span>
        {
          showLeaderboard &&
          <LeaderboardContent
            setShowLeaderboard={setShowLeaderboard}
            showLeaderboard
          />
        }
        {
          showStat &&
          <StatsContent
            setShowStat={setShowStat}
          />

        }
      </div>
      {
        openBuyBnnDialog &&
        <Dialog
          sx={{
            '& .MuiDialog-paper': { minWidth: 300, maxWidth: 450, maxHeight: 435 }
          }}
          maxWidth="md"
          open={openBuyBnnDialog}
          onClose={closeBuyBnnDialog}
        >
          <DialogContent >
            <div className={`${styles.prePlayWrapper2}`}>
              {
                <>
                  <span className={styles.closeIcon} onClick={closeBuyBnnDialog}>
                    <CloseIcon />
                  </span>
                  <p className={styles.dialogSubTitle}>
                    BANANAS FOR BOOST
                  </p>
                  <p className={styles.dialogDescription}>
                    Using your Banana Balance makes you more likely to be on the winning side.
                  </p>
                  <div className={styles.bnnPanel}>

                    <div className={`${styles.buyBnnItemWrapper}`} onClick={() => setBnnItemSelected(1)}>
                      <span className={styles.selectedWrapper}>
                        {
                          bnnItemSelected == 1 &&
                          <span >
                            <TickIcon />
                          </span>
                        }
                      </span>
                      <span className={styles.bnnIcon2}>
                        <span className={styles.icon2}>
                          <BananaIcon />
                          <span className={styles.iconLabel2}>
                            01
                          </span>
                        </span>


                      </span>
                      <p className={styles.buyBnnSubDescription}>
                        <span className={styles.bnnPriceLabel}>
                          {
                            props.gameState ? props.gameState.bananaPrice / LAMPORTS_PER_SOL : 0
                          } SOL
                        </span>
                      </p>
                    </div>
                    <div className={`${styles.buyBnnItemWrapper} ${bnnItemSelected === 2 && styles.bnnItemSelected}`} onClick={() => setBnnItemSelected(2)} >
                      <span className={styles.selectedWrapper}>
                        {
                          bnnItemSelected == 2 &&
                          <span >
                            <TickIcon />
                          </span>
                        }
                      </span>
                      <span className={styles.bnnIcon2}>
                        <span className={styles.icon2}>
                          <BananaIcon />
                          <span className={styles.iconLabel2}>
                            02
                          </span>
                        </span>

                      </span>
                      <p className={styles.buyBnnSubDescription}>
                        <span className={styles.bnnPriceLabel}>
                          {
                            props.gameState ? props.gameState.bananaPrice / LAMPORTS_PER_SOL * 2 : 0
                          } SOL
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className={styles.divider}>
                  </div>
                  <div className={styles.inputWrapper}>
                    <input className={styles.customBuyBnnInput}
                      type='number'
                      onChange={(e) => handleBuyBnnAmountChange(e.target.value)}
                      value={bnnItemSelected}
                      placeholder="Enter Custom"
                    />
                    <span className={styles.buyBnnAmountBtn}>
                      Bananas
                    </span>
                  </div>
                  <button className={styles.buyBnnBtn} onClick={() => buyBnns()}>
                    Buy Bananas
                  </button>

                </>
              }

            </div>

            {/* <div className={styles.startBtnWrapper}>

              {
                
                <button className={`${styles.startBtn}`} >
                  Start Game
                </button>
              }
            </div> */}

          </DialogContent>

        </Dialog>
      }
    </>
  )
}

export default TopBar;
