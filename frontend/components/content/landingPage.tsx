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
  crown as CrownIcon
} from '../svgIcons'
import {
  rightArrow as RightArrowIcon,
  leftArrow as LeftArrowIcon,
  star as StarIcon,
  cross2 as Cross2Icon
} from '../svgIcons'
import { gamePlayTx, getGamePoolData, getGameState, getUserState } from '../../context/script';
import { buyBnn, claimReward, initUserPool, playGame } from '../../context/scripts';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import {
  successAlert,
  errorAlert
} from "../toastGroup";


import {
  getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";
import { web3 } from '@project-serum/anchor';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BANANA_TOKEN_DECIMAL, BANANA_TOKEN_MINT } from '../../context/types';
import { resourceLimits } from 'worker_threads';
import getConfig from 'next/config'
import { getTokenAccount, getTokenAccountBalance, isTokenExist } from '../../context/utils';
const { publicRuntimeConfig } = getConfig()
const cluster = publicRuntimeConfig.SOLANA_NETWORK;
const SERVER_URL = publicRuntimeConfig.SERVER_URL;

let solConnection = new web3.Connection(web3.clusterApiUrl(cluster));

interface Props {
  setPageStatus: Function,
  gameState: any
}

const LandingPage = (props: Props) => {

  const wallet = useWallet();
  const [prePlayDialog, setPrePlayDialog] = React.useState(false);
  const [userNFTInfo, setUserNFTInfo] = React.useState<any[]>([]);
  const [userNFTInfoIdx, setUserNFTInfoIdx] = React.useState(0);
  const [showSelectAvatarDialog, setShowSelectAvatarDialog] = React.useState(false);
  const [bnnRoundSelected, setBnnRoundSelected] = React.useState(0);

  const [loading, setLoading] = React.useState(false);
  const [showRewardDialog, setShowRewardDialog] = React.useState(false);
  const [gamePoolData, setGamePoolData] = React.useState<any>()

  const [userNftLoading, setUserNftLoading] = React.useState(false);
  const [openBuyBnnDialog, setOpenBuyBnnDialog] = React.useState(false)

  const enterGame = () => {
    setPrePlayDialog(true);
  }

  const closePrePlayDialog = () => {
    setPrePlayDialog(false);
  }

  const setCharacterSelected = (index: number) => {
    setUserNFTInfoIdx(index);
    setShowSelectAvatarDialog(false);
  }

  async function get_nft_api_rec(url: any, mint: any) {

    try {
      const response = await axios.get(url);
      // console.log(response.data.collection.name + '-' + response.status)
      if (response.status == 200) {
        let ColName = '';
        let collectionName = '';
        let familyName = '';
        if (response.data.collection) {
          if (typeof (response.data.collection) === 'string') {
            collectionName = response.data.collection;
          } else if (response.data.collection.name) {
            collectionName = response.data.collection.name;
          }
          if (response.data.collection.family) {
            familyName = response.data.collection.family;
          }
        }

        if (ColName == '') {
          const colArray = response.data.name.split(" #");
          ColName = colArray['0'];
        }

        const nftArray = response.data.name.split("#");
        let nftName = nftArray['1'] ? nftArray['1'] : response.data.name;

        return {
          mint: mint,
          projectname: ColName ? ColName : '',
          collectionname: collectionName,
          familyname: familyName,
          nftname: nftName,
          image: response.data.image,
          symbol: response.data.symbol,
          url: url
        };
      }
    } catch (error) {
      console.error(error);
    }

  }

  const getNFTInfo = async () => {
    setUserNftLoading(false);
    var holderAccount: any[] = [];
    holderAccount.push({
      image: "/img/defaultApe.png",
      nftname: "Default"
    })
    if (!wallet.connected || !wallet.publicKey)
      return;
    var address = wallet.publicKey?.toBase58();
    const nftAccounts = await getParsedNftAccountsByOwner({ publicAddress: address, connection: solConnection });
    await Promise.allSettled(
      nftAccounts.map(async (holder) => {
        try {
          let res = await get_nft_api_rec(holder.data.uri, holder.mint);
          if (res?.image.indexOf("http") >= 0)
            holderAccount.push({
              // ...res,
              // nftname: nftAccounts[j].data.name,
              // nftname: holder.data.name,
              // nfturi: holder.data.uri,
              // mint: holder.mint
              image: res?.image,
              nftname: holder.data.name
            });

        } catch (e) {
          console.log(`   error occured ${e}`);
        };
      })
    );

    console.log(holderAccount)
    setUserNFTInfo(holderAccount);
    setUserNftLoading(true);
  }

  const go2nextImg = () => {
    console.log(userNFTInfoIdx)
    if (userNFTInfoIdx < userNFTInfo.length - 1) setUserNFTInfoIdx(userNFTInfoIdx + 1);
  }

  const go2PrevImg = () => {
    console.log(userNFTInfoIdx)
    if (userNFTInfoIdx > 0) setUserNFTInfoIdx(userNFTInfoIdx - 1)
  }



  const enterRound = async () => {

    if (!userNftLoading) {
      errorAlert("Select Charactor First To Enter The Game!");
      return;
    }
    if (!wallet.connected || !wallet.publicKey) return;


    if (!props.gameState) {
      errorAlert("Game Loading Failed. Plz Contact With Admin")
    }

    let solBalance = await solConnection.getBalance(wallet?.publicKey)
    if (solBalance <= props.gameState.entryFee) {
      errorAlert("Too Low Sol Balance.")
      return;
    }

    let bnnBalance = 0;

    if (await isTokenExist(BANANA_TOKEN_MINT, wallet.publicKey, solConnection)) {


      let tokenAccount = await getTokenAccount(BANANA_TOKEN_MINT, wallet.publicKey, solConnection);

      let result = await getTokenAccountBalance(tokenAccount, solConnection)
      bnnBalance = result ? result : 0;
    }


    if (bnnBalance < (bnnRoundSelected > 0 ? 1 : 0)) {
      errorAlert("Low Token Balance");
      return;
    }



    await axios.post(`${SERVER_URL}/register_avatar_game`, {
      user: wallet.publicKey?.toBase58(),
      avatar: userNFTInfo[userNFTInfoIdx].image
    })

    console.log(userNFTInfo[userNFTInfoIdx].image)

    // userNFTInfo
    setPrePlayDialog(false)
    setLoading(true);
    let result = await playGame(wallet, bnnRoundSelected == 1 ? 1 : 0, bnnRoundSelected == 2 ? 1 : 0, bnnRoundSelected == 3 ? 1 : 0, bnnRoundSelected == 4 ? 1 : 0);
    console.log("game enter result : ", result);
    setLoading(false);
    if (result === 0) {
      successAlert("Game Entered Successfully!");
      props.setPageStatus('gameStatus');
      localStorage.setItem("gameStatus", "running")
    } else {
      errorAlert("Game Entering Failed!");
    }

  }

  const checkUserStatus = async () => {
    let gamePoolDataTmp = await getGamePoolData();
    // let gameStateTmp = await getGameState();
    setGamePoolData(gamePoolDataTmp)
    // setGameState(gameStateTmp)
    // console.log("game state: ", gameStateTmp);
    console.log("gamepooldata :", gamePoolDataTmp)

    if (!wallet.publicKey) return;
    let userState = await getUserState(wallet.publicKey);

    if (userState?.winnerLast == 1 || (props.gameState && props.gameState.winner && props.gameState.winner == wallet.publicKey.toBase58())) {
      // claim reward
      setShowRewardDialog(true)
    }

    console.log("userState  >> ", userState)

    // enter the game if already entered.
    if (gamePoolDataTmp && gamePoolDataTmp.players && gamePoolDataTmp.players.includes(wallet.publicKey.toBase58()) && (localStorage.getItem("gameStatus") == "running" || !localStorage.getItem("gameStatus"))) {

      props.setPageStatus('gameStatus');
    }
  }

  const claimGameReward = async () => {
    setShowRewardDialog(false)
    setLoading(true);
    let result = await claimReward(wallet);
    if (result?.result == 0) {
      successAlert(result?.msg)
    } else {
      errorAlert(result?.msg)
      setShowRewardDialog(true)
    }
    setLoading(false);
    // setShowRewardDialog(true)
  }


  React.useEffect(() => {
    checkUserStatus();
    if (wallet.connected) {
      getNFTInfo();
    }

  }, [wallet.connected])

  return (
    <>
      {/* <span className={`${styles.buyBnnBtn}`} onClick={() => setOpenBuyBnnDialog(true)}>
                Buy <br />Bananas
            </span> */}
      <img src={'/img/King_KK 1.png'} alt='LC' className={styles.lCharacter} />
      <img src={'/img/King_KK 2.png'} alt='RC' className={styles.rCharacter} />
      {/* {
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
            } */}
      {
        !wallet.connected ?
          <img src={'/img/KK_Logo_Text.png'} alt='KK_Text' className={styles.kkText} /> :
          <img src={'/img/KK_Logo_Text.png'} alt='KK_Text' className={styles.kkText2} />
      }
      <img src={'/img/Chest.png'} alt='Chest' className={styles.chest} />


      <span className={styles.wltBtnWrapper}>
        {
          !wallet.connected && !wallet.connecting &&
          <WalletMultiButton />
        }
        {
          wallet.connected &&
          <span className={styles.landingBtnWrapper}>
            <span className={styles.entryFeeLabelWrapper}>
              <span className={styles.enteryFeeLabel}>
                {props.gameState ?
                  (props.gameState.entryFee / LAMPORTS_PER_SOL) : 0
                } SOL
              </span>
            </span>
            <span className={styles.landingBtn} onClick={() => enterGame()}>
              ENTER THE JUNGLE
            </span>

          </span>
        }
      </span>

      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        open={wallet.connecting || loading}
        keepMounted
      >

        <DialogContent >
          <div className={styles.starWrapper}>
            <span className={styles.starIcon}>
              <CrownIcon />

            </span>
            <div className={styles.loading}>
              Loading<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </DialogContent>

      </Dialog>
      <Dialog
        sx={{ '& .MuiDialog-paper': { maxWidth: 1200, maxHeight: 435 } }}
        maxWidth="md"
        open={prePlayDialog}
        onClose={closePrePlayDialog}
      >

        <DialogContent >
          <div className={styles.playDialogContainer}>
            <div className={`${styles.prePlayWrapper} `}>
              <div>
                {

                  <>
                    <p className={styles.dialogSubTitle}>
                      <span className={styles.orderNumWrapper}>
                        <span className={styles.orderNum}>
                          1
                        </span>
                      </span>
                      <span className={styles.subTitle}>
                        Choose Character
                      </span>
                    </p>
                    {
                      !userNftLoading ?
                        <div className={styles.loadingWrapper}>
                          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div> :
                        <div className={styles.userNftsSelectPanel}>
                          {
                            userNFTInfoIdx > 0 &&
                            <span className={styles.selectNftLeftArrow} onClick={() => go2PrevImg()}>
                              <LeftArrowIcon />
                            </span>
                          }
                          {
                            userNFTInfoIdx < userNFTInfo.length - 1 &&
                            <span className={styles.selectNftRightArrow} onClick={() => go2nextImg()}>
                              <RightArrowIcon />
                            </span>
                          }

                          {
                            userNFTInfo.length > 0 &&
                            <div className={`${styles.userNFTsImgWrapper}`}>
                              <img src={`${userNFTInfo[userNFTInfoIdx].image}`} className={`${styles.imgAvatar}`} alt="nft" />
                            </div>
                          }
                          <p className={styles.nftNameLabel}>
                            {
                              userNFTInfo.length > 0 &&
                              userNFTInfo[userNFTInfoIdx].nftname
                            }
                          </p>



                          {/* {
                            userNFTInfo.map((value, index) => {
                                return (
                                    <div key={index} className={`${styles.userNFTsImgWrapper}`}>
                                        <img src={`${value.image}`} className={`${styles.imgAvatar}`} alt="nft" />
                                    </div>
                                )
                            })
                          } */}
                        </div>
                    }
                  </>
                }
              </div>
              {
                <>
                  <div className={styles.verticalDivider}>
                  </div>
                  <div>
                    <p className={styles.dialogSubTitle}>
                      <span className={styles.orderNumWrapper}>
                        <span className={styles.orderNum}>
                          2
                        </span>
                      </span>
                      <span className={styles.subTitle}>

                        Choose a Round to Play Banana
                      </span>
                    </p>
                    <div className={styles.roundSelectPanel}>
                      <span className={`${styles.roundSelectItem} ${bnnRoundSelected == 1 && styles.bnnRoundSelected}`} onClick={() => setBnnRoundSelected(1)}>
                        1
                      </span>
                      <span className={`${styles.roundSelectItem} ${bnnRoundSelected == 2 && styles.bnnRoundSelected}`} onClick={() => setBnnRoundSelected(2)}>
                        2
                      </span>
                      <span className={`${styles.roundSelectItem} ${bnnRoundSelected == 3 && styles.bnnRoundSelected}`} onClick={() => setBnnRoundSelected(3)}>
                        3
                      </span>
                      <span className={`${styles.roundSelectItem} ${bnnRoundSelected == 4 && styles.bnnRoundSelected}`} onClick={() => setBnnRoundSelected(4)}>
                        4
                      </span>
                      <span className={`${styles.roundSelectItem} ${bnnRoundSelected == 0 && styles.bnnRoundSelected}`} onClick={() => setBnnRoundSelected(0)}>
                        <span className={styles.closeIcon}>
                          <Cross2Icon />
                        </span>
                        <span className={styles.noneLabel}>
                          NONE
                        </span>
                      </span>
                    </div>
                    <div className={styles.note}>
                      Note: You cannot add the Banana Power-up once the game starts.
                    </div>
                  </div>
                </>
              }
            </div>

            <div className={styles.startBtnWrapper} onClick={closePrePlayDialog}>
              {
                !showSelectAvatarDialog &&
                <button
                  onClick={() => enterRound()}
                  className={`${styles.startBtn} ${!userNftLoading && styles.diabledBtn}`}>
                  Start
                </button>
              }
            </div>

          </div>
        </DialogContent>

      </Dialog>

      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, display: showRewardDialog ? "block" : "none" } }}
        maxWidth="xs"
        open={showRewardDialog}
        keepMounted
      >
        <DialogContent >
          {/* <p className={styles.claimGameRewardDialogTitle}>
                        Claim Game Reward
                    </p> */}
          <div className={styles.claimGameRewardDialogContent}>
            <span className={styles.rewardImgWrapper}>
              <img src="/img/GrandPrize.png" alt="prize" className={styles.claimGameRewardImg} />
            </span>
            <button onClick={claimGameReward} className={styles.claimGameRewardBtn}>
              Claim Reward
            </button>
          </div>
        </DialogContent>

      </Dialog>
    </>
  )
}

export default LandingPage;
