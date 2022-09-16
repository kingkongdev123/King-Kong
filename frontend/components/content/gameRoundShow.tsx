/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import styles from './gameRoundShow.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import {
    lock as LockIcon
} from '../svgIcons'
import { getGamePoolData } from '../../context/script';
import axios from 'axios';
import socketIOClient from "socket.io-client";

import getConfig from 'next/config'
import { sleep } from '../../context/utils';
import { Wallet } from '@project-serum/anchor';
import * as PIXI from "pixi.js-legacy";
import { Spine } from 'pixi-spine';

const { publicRuntimeConfig } = getConfig()
const SERVER_URL = publicRuntimeConfig.SERVER_URL;




interface Props {
    setPageStatus: Function,
    gameData: any,
    round: number,
    pfps: any[],
    setCurGameResult: Function
}

const GameRoundShow = (props: Props) => {
    const wallet = useWallet()

    const [player1Address, setPlayer1Address] = React.useState("")
    const [player2Address, setPlayer2Address] = React.useState("")
    const [player1Pfp, setPlayer1Pfp] = React.useState("")
    const [player2Pfp, setPlayer2Pfp] = React.useState("")

    const [health1, setHealth1] = React.useState(100);
    const [health2, setHealth2] = React.useState(100);

    const [roundResult, setRoundResult] = React.useState("")

    const gamePlay = async () => {

        if (!props.gameData) {
            props.setPageStatus("landing");
            return;
        }
        let currentRoundResult = "";
        let idx = props.gameData.players.indexOf(wallet.publicKey?.toBase58())

        let idx2 = 0;
        setPlayer1Address(props.gameData.players[idx])
        setPlayer1Pfp(props.pfps[idx])
        if (props.round == 1) {
            if (idx % 2 == 1) {
                setPlayer2Address(props.gameData.players[idx - 1])
                setPlayer2Pfp(props.pfps[idx - 1])
                idx2 = idx - 1;
            } else {
                setPlayer2Address(props.gameData.players[idx + 1])
                setPlayer2Pfp(props.pfps[idx + 1])
                idx2 = idx + 1;
            }

            if (props.gameData.round1Result.indexOf(idx) < 0) {
                props.setCurGameResult("lost");
            }

            // await sleep(1000)
            if (props.gameData.round1Result.indexOf(idx) >= 0) {
                // setRoundResult("win");
                currentRoundResult = 'win';
            } else {
                // setRoundResult("lost");
                currentRoundResult = 'lost';

            }
        } else if (props.round == 2) {
            if (props.gameData.round1Result.indexOf(idx) >= 0) {
                let round2idx = props.gameData.round1Result.indexOf(idx);
                let round2player2idx = round2idx % 2 == 1 ? props.gameData.round1Result[round2idx - 1] : props.gameData.round1Result[round2idx + 1]

                idx2 = round2player2idx;

                setPlayer2Address(props.gameData.players[round2player2idx])
                setPlayer2Pfp(props.pfps[round2player2idx])

                if (props.gameData.round2Result.indexOf(idx) < 0) {
                    props.setCurGameResult("lost");
                }
                await sleep(1000)
                if (props.gameData.round2Result.indexOf(idx) >= 0) {
                    // setRoundResult("win");
                    currentRoundResult = "win";
                } else {
                    // setRoundResult("lost");
                    currentRoundResult = "lost"
                }
            } else {
                props.setPageStatus("landing")
            }
        } else if (props.round == 3) {
            if (props.gameData.round2Result.indexOf(idx) >= 0) {
                let round3idx = props.gameData.round2Result.indexOf(idx);
                let round3player2idx = round3idx % 2 == 1 ? props.gameData.round2Result[round3idx - 1] : props.gameData.round2Result[round3idx + 1]

                idx2 = round3player2idx;

                setPlayer2Address(props.gameData.players[round3player2idx])
                setPlayer2Pfp(props.pfps[round3player2idx])

                if (props.gameData.round3Result.indexOf(idx) < 0) {
                    props.setCurGameResult("lost");
                }
                await sleep(1000)
                if (props.gameData.round3Result.indexOf(idx) >= 0) {

                    // setRoundResult("win");
                    currentRoundResult = "win";
                }
                else {
                    // setRoundResult("lost");
                    currentRoundResult = "lost";
                }
            } else {
                props.setPageStatus("landing")
            }
        } else if (props.round == 4) {
            if (props.gameData.round3Result.indexOf(idx) >= 0) {
                let round4idx = props.gameData.round3Result.indexOf(idx);
                let round4player2idx = round4idx % 2 == 1 ? props.gameData.round3Result[round4idx - 1] : props.gameData.round3Result[round4idx + 1]

                idx2 = round4player2idx;

                setPlayer2Address(props.gameData.players[round4player2idx])
                setPlayer2Pfp(props.pfps[round4player2idx])

                if (props.gameData.round4Result.indexOf(idx) >= 0) {
                    props.setCurGameResult("win");
                } else {
                    props.setCurGameResult("lost");
                }
                await sleep(1000)
                if (props.gameData.round4Result.indexOf(idx) >= 0) {
                    // setRoundResult("win");
                    currentRoundResult = "win"
                } else {
                    // setRoundResult("lost");
                    currentRoundResult = "lost"
                }

            } else {
                props.setPageStatus("landing")
            }
        } else if (props.round == 5) {
            if (props.gameData.round4Result.indexOf(idx) >= 0) {
                let round5idx = props.gameData.round4Result.indexOf(idx);
                let round5player2idx = round5idx % 2 == 1 ? props.gameData.round4Result[round5idx - 1] : props.gameData.round4Result[round5idx + 1]

                idx2 = round5player2idx;

                setPlayer2Address(props.gameData.players[round5player2idx])
                setPlayer2Pfp(props.pfps[round5player2idx])
            } else {
                props.setPageStatus("landing")
            }
        }
        console.log(idx, idx2, props.round)
        // animation

        const app = new PIXI.Application({
            backgroundAlpha: 0,
        });

        console.log(props.gameData, ":: game data")
        document.getElementById("gameRoundCanvasWrapper")?.appendChild(app.view);
        let height = document.getElementById("gameRoundCanvasWrapper")?.clientHeight;
        let width = document.getElementById("gameRoundCanvasWrapper")?.clientWidth;



        app.loader.add('kingkong', '/_2skeletonAnimsAndFx/kong.json').add('fighting', '/anim/FX.json').load(async (loader, resources) => {
            const container = new PIXI.Container();
            if (!resources.kingkong.spineData) return;
            let character = new Spine(resources.kingkong.spineData);
            character.skeleton.setSkinByName('fullBody');

            // character.stateData.setMix('attack_1', 'Idle_1', 0);
            // character.stateData.setMix('Idle_1', 'attack_1', 0);
            // character.position.set(width ? width / 2 - 220 : 0, height ? height - 150 : 0)
            character.position.set(app.screen.width / 2 - 25, app.screen.height - 50);

            if (currentRoundResult == "win") {
                // player1 win
                character.state.setAnimation(0, 'Idle_1', true);
                // character.state.addAnimation(0, 'attack_3', false, 0);
                // character.state.addAnimation(0, 'attack_2', false, 0);
                // character.state.addAnimation(0, 'attack_1', false, 0);
                // character.position.set(app.screen.width / 2, app.screen.height - 50);
                setTimeout(async () => {
                    for (let i = 0; i < 50; i++) {
                        await sleep(40)
                        character.position.set(app.screen.width / 2 - 25 + i * 2, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 1000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 - 100, app.screen.height - 50)
                    for (let i = 0; i < 50; i++) {
                        await sleep(20)
                        character.position.set(app.screen.width / 2 + 75 - i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 3000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 + 100, app.screen.height - 50)
                    for (let i = 0; i < 50; i++) {
                        await sleep(20)
                        character.position.set(app.screen.width / 2 - 75 + i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 4000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 - 100, app.screen.height - 50)

                    for (let i = 0; i < 50; i++) {
                        await sleep(20)
                        character.position.set(app.screen.width / 2 + 75 - i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 5000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 + 100, app.screen.height - 50)
                    for (let i = 0; i < 50; i++) {
                        await sleep(30)
                        character.position.set(app.screen.width / 2 - 75 + i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 6000);

                // character.position.set(width ? width / 2 - 120 : 0, height ? height - 150 : 0)
                // await sleep(500);
                // character.position.set(width ? width / 2 - 220 : 0, height ? height - 150 : 0)
                // await sleep(500);
                // character.position.set(width ? width / 2 - 120 : 0, height ? height - 150 : 0)

                character.state.addAnimation(0, 'attack_3', false, 0);


                character.state.addAnimation(0, 'attack_2', false, 0);

                character.state.addAnimation(0, 'attack_1', false, 0);

                // character.state.addAnimation(0, 'powerAttack', false);
                // character.state.addAnimation(0, 'attack_3', false);
                character.state.addAnimation(0, 'win&pose1', false, 0);
                character.state.addAnimation(0, 'Idle_3', true, 0);
            } else {
                character.state.setAnimation(0, 'Idle_2', false);
                character.state.addAnimation(0, 'defend 1', false, 0);
                setTimeout(() => {
                    setHealth1(90);
                }, 3500);
                character.state.addAnimation(0, 'defend 2', false, 0);
                setTimeout(() => {
                    setHealth1(60);
                }, 5500);
                character.state.addAnimation(0, 'Fail&Fall1', false, 0);
                setTimeout(() => {
                    setHealth1(0);
                }, 9000);
            }


            // character.state.setAnimation(2, 'Idle_2', false);
            // character.state.setAnimation(3, 'Idle_3', false);


            if (props.gameData.bananaUsage[idx][props.round - 1] == 0) {
                character.scale.x = 0.3
                character.scale.y = 0.5
            } else {
                character.scale.x = 0.3 * 1.25
                character.scale.y = 0.5 * 1.25
            }


            // character.stateData.setMix('Fail&Fall1', 'attack_1')
            container.addChild(character);
            // 
            let character2 = new Spine(resources.kingkong.spineData);

            character2.skeleton.setSkinByName('baseSkin');
            // character2.position.set(width ? width / 2 - 220 : 0, height ? height - 150 : 0);
            character2.position.set(app.screen.width / 2 + 25, app.screen.height - 50);

            if (currentRoundResult == "win") {
                // player2 lose
                character2.state.setAnimation(0, 'Idle_2', false);
                character2.state.addAnimation(0, 'defend 1', false, 0);
                setTimeout(() => {
                    setHealth2(90);
                }, 3500);
                character2.state.addAnimation(0, 'getHit1', false, 0);
                setTimeout(() => {
                    setHealth2(60);
                }, 6500);
                // character2.state.addAnimation(0, 'Idle_2', false, 0);
                // character2.state.addAnimation(0, 'attack_1', false, 0);
                // character2.state.addAnimation(0, 'Idle_3', false, 0);
                // character2.state.addAnimation(0, 'defend 1', false, 0);
                // character2.state.addAnimation(0, 'defend 2', false, 0);
                character2.state.addAnimation(0, 'Fail&Fall1', false, 2.2);

                setTimeout(() => {
                    setHealth2(0);
                }, 9000);
            } else {
                // player2 win
                character2.state.setAnimation(0, 'Idle_1', true);
                // character2.position.set(width ? width / 2 - 240 : 0, height ? height - 150 : 0);
                setTimeout(async () => {
                    for (let i = 0; i < 50; i++) {
                        await sleep(40)
                        character2.position.set(app.screen.width / 2 + 25 - i * 2, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 1000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 - 100, app.screen.height - 50)

                    for (let i = 0; i < 50; i++) {
                        await sleep(20)
                        character2.position.set(app.screen.width / 2 - 75 + i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 3000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 + 100, app.screen.height - 50)
                    for (let i = 0; i < 50; i++) {
                        await sleep(20)
                        character2.position.set(app.screen.width / 2 + 75 - i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 4000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 - 100, app.screen.height - 50)

                    for (let i = 0; i < 50; i++) {
                        await sleep(20)
                        character2.position.set(app.screen.width / 2 - 75 + i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 5000);
                setTimeout(async () => {
                    // character.position.set(app.screen.width / 2 + 100, app.screen.height - 50)
                    for (let i = 0; i < 50; i++) {
                        await sleep(30)
                        character2.position.set(app.screen.width / 2 + 75 - i * 3, app.screen.height - 50)
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                }, 6000);

                character2.state.addAnimation(0, 'attack_3', false, 0);
                character2.state.addAnimation(0, 'attack_2', false, 0);
                character2.state.addAnimation(0, 'attack_1', false, 0);
                // character.state.addAnimation(0, 'powerAttack', false);
                // character.state.addAnimation(0, 'attack_3', false);
                character2.state.addAnimation(0, 'win&Pose2', false, 0);
                character2.state.addAnimation(0, 'Idle_3', true, 0);
            }
            // character2.state.addAnimation(0, 'getHit1', false);
            // character2.state.addAnimation(0, 'getHit2', false);
            // character2.state.addAnimation(0, 'getHit3', false);
            // character2.state.addAnimation(0, 'getHit4', false);
            // character2.state.addAnimation(0, 'defend 1', false);
            // character2.state.addAnimation(0, 'defend 2', false);
            // character2.state.addAnimation(0, 'react1', false);
            // character2.state.addAnimation(0, 'react2', false);
            // character2.state.addAnimation(0, 'react3', false);



            if (props.gameData.bananaUsage[idx2][props.round - 1] == 0) {
                character2.scale.x = -0.3;
                character2.scale.y = 0.5;
            } else {
                character2.scale.x = -0.3 * 1.25;
                character2.scale.y = 0.5 * 1.25;
            }
            // character.
            container.addChild(character2);

            // const container = new PIXI.Container();
            if (!resources.fighting.spineData) return;
            let effect = new Spine(resources.fighting.spineData);
            // effect.state.addAnimation(0, 'Idle_1', false, 1);
            // effect.state.addAnimation(0, 'attack1FX', false, 2);
            effect.state.setAnimation(0, 'react1FX', false);
            effect.position.set((width ? width - 350 : 0) / 2, height ? height : 0);
            effect.state.addAnimation(0, 'attack2FX', false, 3);
            effect.position.set((width ? width - 650 : 0) / 2, height ? height : -100);
            // effect.state.addAnimation(0, 'failFall1FX', false, 6);

            effect.scale.set(0.4);
            container.addChild(effect);

            let effect2 = new Spine(resources.fighting.spineData);
            // effect2.state.addAnimation(0, 'Idle_1', false, 1);
            // effect2.state.addAnimation(0, 'defend1FX', false, 2);
            effect2.state.setAnimation(0, 'react1FX', false);
            effect2.state.addAnimation(0, 'winPose2FX', false, 6);
            effect2.position.set((width ? width - 750 : 0) / 2, height ? height - 50 : 0);
            effect2.scale.set(0.4);

            container.addChild(effect2);
            // app.stage.addChild(container);



            app.stage.addChild(container);
        })
    }

    React.useEffect(() => {
        setRoundResult("")
        if (wallet.connected) {
            //props.gameData && wallet.connected
            gamePlay();

            if (false) {


                const app = new PIXI.Application({
                    backgroundAlpha: 0,
                });

                console.log(props.gameData, ":: game data")
                document.getElementById("gameRoundCanvasWrapper")?.appendChild(app.view);
                let height = document.getElementById("gameRoundCanvasWrapper")?.clientHeight;
                let width = document.getElementById("gameRoundCanvasWrapper")?.clientWidth;



                app.loader.add('kopose', '/_WinAnim&KO/treasure.json').add('kingkong', '/_2skeletonAnimsAndFx/kong.json').add('fighting', '/anim/FX.json').load(async (loader, resources) => {
                    const container = new PIXI.Container();
                    if (!resources.kingkong.spineData) return;
                    let character = new Spine(resources.kingkong.spineData);
                    character.skeleton.setSkinByName('fullBody');

                    // character.stateData.setMix('attack_1', 'Idle_1', 0);
                    // character.stateData.setMix('Idle_1', 'attack_1', 0);
                    // character.position.set(width ? width / 2 - 220 : 0, height ? height - 150 : 0)
                    character.position.set(app.screen.width / 2 - 25, app.screen.height - 50);

                    // if (currentRoundResult == "win") {

                    character.state.setAnimation(0, 'Idle_1', true);
                    // character.state.addAnimation(0, 'attack_3', false, 0);
                    // character.state.addAnimation(0, 'attack_2', false, 0);
                    // character.state.addAnimation(0, 'attack_1', false, 0);

                    // setTimeout(async () => {
                    //     for (let i = 0; i < 50; i++) {
                    //         await sleep(40)
                    //         character.position.set(app.screen.width / 2 - 25 + i * 2, app.screen.height - 50)
                    //     }
                    //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                    // }, 1000);
                    // setTimeout(async () => {
                    //     // character.position.set(app.screen.width / 2 - 100, app.screen.height - 50)

                    //     for (let i = 0; i < 50; i++) {
                    //         await sleep(20)
                    //         character.position.set(app.screen.width / 2 + 75 - i * 3, app.screen.height - 50)
                    //     }
                    //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                    // }, 3000);
                    // setTimeout(async () => {
                    //     // character.position.set(app.screen.width / 2 + 100, app.screen.height - 50)
                    //     for (let i = 0; i < 50; i++) {
                    //         await sleep(20)
                    //         character.position.set(app.screen.width / 2 - 75 + i * 3, app.screen.height - 50)
                    //     }
                    //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                    // }, 4000);
                    // setTimeout(async () => {
                    //     // character.position.set(app.screen.width / 2 - 100, app.screen.height - 50)

                    //     for (let i = 0; i < 50; i++) {
                    //         await sleep(20)
                    //         character.position.set(app.screen.width / 2 + 75 - i * 3, app.screen.height - 50)
                    //     }
                    //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                    // }, 5000);
                    // setTimeout(async () => {
                    //     // character.position.set(app.screen.width / 2 + 100, app.screen.height - 50)
                    //     for (let i = 0; i < 50; i++) {
                    //         await sleep(30)
                    //         character.position.set(app.screen.width / 2 - 75 + i * 3, app.screen.height - 50)
                    //     }
                    //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                    // }, 6000);

                    // character.position.set(width ? width / 2 - 120 : 0, height ? height - 150 : 0)
                    // await sleep(500);
                    // character.position.set(width ? width / 2 - 220 : 0, height ? height - 150 : 0)
                    // await sleep(500);
                    // character.position.set(width ? width / 2 - 120 : 0, height ? height - 150 : 0)
                    character.state.addAnimation(0, 'walkForward', false, 0);
                    setTimeout(() => {
                        character.position.set(app.screen.width / 2 + 25, app.screen.height - 50);
                    }, 3000);
                    character.state.addAnimation(0, 'attack_3', false, 0);
                    character.state.addAnimation(0, 'walkBackward', false, 0);
                    character.state.addAnimation(0, 'walkForward', false, 0);
                    character.state.addAnimation(0, 'attack_2', false, 0);
                    character.state.addAnimation(0, 'walkBackward', false, 0);
                    character.state.addAnimation(0, 'walkForward', false, 0);
                    character.state.addAnimation(0, 'attack_1', false, 0);





                    // character.state.addAnimation(0, 'powerAttack', false);
                    // character.state.addAnimation(0, 'attack_3', false);
                    character.state.addAnimation(0, 'win&pose1', false, 0);
                    character.state.addAnimation(0, 'Idle_3', true, 0);
                    // } else {
                    //     character.state.setAnimation(0, 'Idle_2', false);
                    //     character.state.addAnimation(0, 'defend 1', false, 0);
                    //     character.state.addAnimation(0, 'defend 2', false, 0);
                    //     character.state.addAnimation(0, 'Fail&Fall1', false, 0);
                    // }



                    character.scale.x = 0.3
                    character.scale.y = 0.5



                    // character.stateData.setMix('Fail&Fall1', 'attack_1')
                    container.addChild(character);
                    // 
                    let character2 = new Spine(resources.kingkong.spineData);

                    character2.skeleton.setSkinByName('baseSkin');
                    // character2.position.set(width ? width / 2 - 220 : 0, height ? height - 150 : 0);
                    character2.position.set(app.screen.width / 2 + 25, app.screen.height - 50);

                    character2.state.setAnimation(0, 'Idle_2', false);
                    character2.state.addAnimation(0, 'defend 1', false, 0);
                    character2.state.addAnimation(0, 'getHit1', false, 0);
                    // character2.state.addAnimation(0, 'Idle_2', false, 0);
                    // character2.state.addAnimation(0, 'attack_1', false, 0);
                    // character2.state.addAnimation(0, 'Idle_3', false, 0);
                    // character2.state.addAnimation(0, 'defend 1', false, 0);
                    // character2.state.addAnimation(0, 'defend 2', false, 0);
                    character2.state.addAnimation(0, 'Fail&Fall1', false, 0);


                    // character2.state.addAnimation(0, 'getHit1', false);
                    // character2.state.addAnimation(0, 'getHit2', false);
                    // character2.state.addAnimation(0, 'getHit3', false);
                    // character2.state.addAnimation(0, 'getHit4', false);
                    // character2.state.addAnimation(0, 'defend 1', false);
                    // character2.state.addAnimation(0, 'defend 2', false);
                    // character2.state.addAnimation(0, 'react1', false);
                    // character2.state.addAnimation(0, 'react2', false);
                    // character2.state.addAnimation(0, 'react3', false);




                    character2.scale.x = -0.3;
                    character2.scale.y = 0.5;

                    // character.
                    container.addChild(character2);

                    // const container = new PIXI.Container();
                    if (!resources.fighting.spineData) return;
                    let effect = new Spine(resources.fighting.spineData);
                    // effect.state.addAnimation(0, 'Idle_1', false, 1);
                    // effect.state.addAnimation(0, 'attack1FX', false, 2);
                    effect.state.setAnimation(0, 'react1FX', false);
                    effect.position.set((width ? width - 350 : 0) / 2, height ? height : 0);
                    effect.state.addAnimation(0, 'attack2FX', false, 3);
                    effect.position.set((width ? width - 650 : 0) / 2, height ? height : -100);
                    // effect.state.addAnimation(0, 'failFall1FX', false, 6);

                    effect.scale.set(0.4);
                    container.addChild(effect);

                    let effect2 = new Spine(resources.fighting.spineData);
                    // effect2.state.addAnimation(0, 'Idle_1', false, 1);
                    // effect2.state.addAnimation(0, 'defend1FX', false, 2);
                    effect2.state.setAnimation(0, 'react1FX', false);
                    effect2.state.addAnimation(0, 'winPose2FX', false, 6);
                    effect2.position.set((width ? width - 750 : 0) / 2, height ? height - 50 : 0);
                    effect2.scale.set(0.4);

                    container.addChild(effect2);
                    // app.stage.addChild(container);

                    if (!resources.kopose.spineData) return;
                    let koeffects = new Spine(resources.kopose.spineData);
                    koeffects.state.setAnimation(0, 'KO', false);
                    koeffects.state.addAnimation(0, 'winAnim', false, 0);
                    koeffects.state.addAnimation(0, 'doubleKO', false, 0);
                    koeffects.scale.set(0.1);
                    koeffects.position.set(app.screen.width / 2 - 25, app.screen.height - 50);

                    container.addChild(koeffects);


                    app.stage.addChild(container);
                })
            }
        }
    }, [wallet.connected])

    return (
        <div className={styles.container}>
            <span className={styles.leftHealthbarWrapper}>
                {/* <span className={styles.leftHealthbar}> */}
                <div className={styles.leftReducingBar} style={{ width: `${health1}%` }}>
                </div>
                <div className={styles.leftRealBar} style={{ width: `${health1}%` }}>
                </div>
                {/* </span> */}
            </span>
            <span className={styles.rightHealthbarWrapper}>
                <div className={styles.rightReducingBar} style={{ width: `${health2}%` }}>
                </div>
                <div className={styles.rightRealBar} style={{ width: `${health2}%` }}>
                </div>
            </span>
            <span className={styles.roundLabel} >
                Round&nbsp;
                {
                    props.round
                }
            </span>
            <div id='gameRoundCanvasWrapper'>

            </div>
            {/* <img src={player1Pfp} alt="player1" className={styles.leftPlayer} />
            <img src={player2Pfp} alt="player2" className={styles.rightPlayer} /> */}
            {
                roundResult != "" &&
                <span className={`${styles.showResultLabel} ${roundResult == "win" && styles.successResult} ${roundResult == "lost" && styles.failResult}`}>
                    {
                        roundResult
                    }
                </span>
            }

        </div>
    )
}

export default GameRoundShow;
