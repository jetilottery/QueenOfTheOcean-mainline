/**
 * @module control some game config
 * @description control the customized data of paytable&help page and other customized config
 */
define({
    style: {
        "ticketCostLevelIcon": {
            "_width": "22",
            "_height": "4",
            "_top": "82"
        }
    },
    textAutoFit: {
        "autoPlayText": {
            "isAutoFit": true
        },
        "autoPlayMTMText": {
            "isAutoFit": true
        },
        "buyText": {
            "isAutoFit": true
        },
        "tryText": {
            "isAutoFit": true
        },
        "warningExitText": {
            "isAutoFit": true
        },
        "warningContinueText": {
            "isAutoFit": true
        },
        "errorExitText": {
            "isAutoFit": true
        },
        "errorTitle": {
            "isAutoFit": true
        },
        "exitText": {
            "isAutoFit": true
        },
        "winBoxErrorExitText": {
            "isAutoFit": true
        },
        "winBoxErrorText": {
            "isAutoFit": true
        },
        "playAgainText": {
            "isAutoFit": true
        },
        "playAgainMTMText": {
            "isAutoFit": true
        },
        "MTMText": {
            "isAutoFit": true
        },
        "win_Text": {
            "isAutoFit": true
        },
        "win_Try_Text": {
            "isAutoFit": true
        },
        "win_Value": {
            "isAutoFit": true
        },
        "closeWinText": {
            "isAutoFit": true
        },
        "nonWin_Text": {
            "isAutoFit": true
        },
        "closeNonWinText": {
            "isAutoFit": true
        },
        "win_Value_color": {
            "isAutoFit": true
        },
        "ticketCostText": {
            "isAutoFit": true
        },
        "ticketCostValue": {
            "isAutoFit": true
        },
        "tutorialTitleText": {
            "isAutoFit": true
        },
        "closeTutorialText": {
            "isAutoFit": true
        },
        "winUpToText": {
            "isAutoFit": true
        },
        "winUpToValue": {
            "isAutoFit": true
        },
        "MTMText": {
            "isAutoFit": true
        }
    },
    audio: {
        "gameInit": {
            "name": "GameInit",
            "channel": "3"
        },
        "gameLoop": {
            "name": "BaseMusicLoop",
            "channel": "0"
        },
        "gameWin": {
            "name": "BaseMusicLoopTermWin",
            "channel": "0"
        },
        "gameNoWin": {
            "name": "BaseMusicLoopTermLose",
            "channel": "0"
        },
        "ButtonGeneric": {
            "name": "ButtonGeneric",
            "channel": "4"
        },
        "HelpPageOpen": {
            "name": "HelpPageOpen",
            "channel": "1"
        },
        "HelpPageClose": {
            "name": "HelpPageClose",
            "channel": "2"
        },
        "ButtonBetMax": {
            "name": "ButtonBetMax",
            "channel": "5"
        },
        "ButtonBetUp": {
            "name": "ButtonBetUp",
            "channel": "2"
        },
        "ButtonBetDown": {
            "name": "ButtonBetDown",
            "channel": "1"
        },
        "Match": {
            "name": "Match",
            "channel": "3"
        }
    },
    gladButtonImgName: {
        //audioController
        "buttonAudioOn": "buttonAudioOn",
        "buttonAudioOff": "buttonAudioOff",
        //buyAndTryController
        "buttonTry": "buttonBuy",
        "buttonBuy": "buttonBuy",
        //errorWarningController
        "warningContinueButton": "buttonBuy",
        "warningExitButton": "buttonBuy",
        "errorExitButton": "buttonBuy",
        //exitAndHomeController
        "buttonExit": "buttonBuy",
        "buttonHome": "buttonHome",
        //playAgainController
        "buttonPlayAgain": "buttonBuy",
        "buttonPlayAgainMTM": "buttonBuy",
        //playWithMoneyController
        "buttonMTM": "buttonBuy",
        //resultController
        "buttonWinClose": "buttonBuy",
        "buttonNonWinClose": "buttonBuy",
        //ticketCostController
        "ticketCostPlus": "arrowPlus",
        "ticketCostMinus": "arrowMinus",
        //tutorialController
        "iconOff": "tutorialPageIconOff",
        "iconOn": "tutorialPageIconOn",
        "tutorialButtonClose": "buttonBuy",
        //revealAllController
        "buttonAutoPlay": "buttonBuy",
        "buttonAutoPlayMTM": "buttonBuy"
    },
    gameParam: {
        //tutorialController
        "pageNum": 2
    },
    // helpClickList: {
    //     "titleList":"titleList",
    //     "titleContent": {
    //         "howToBet":"howToBet",
    //         "revealAll":"revealAll",
    //         "howToPlay":"howToPlay",
    //         "rules":"rules",
    //         "intellectualProperty":"intellectualProperty"
    //     }
    // },
    dropShadow: {
        padding: 2,
        dropShadow: true,
        dropShadowDistance: 2.5
    },
	predefinedStyle: {
		landscape:{
			loadDiv:{
				width:960,
				height:600,
				position:'absolute',
				left: "50%",
				top: "50%"
			},
			gameLogoDiv:{
				width:612,
				height:232,
				top: 87,
				left: 174,
				position:'absolute',
				backgroundCover:"contain"
			},
			progressBarDiv:{
				top: 480,
				left: 205,
				width:550,
				height:51,
				padding:0,
				position:'absolute'
			},
			progressDiv:{
				height:51,
				width:"0%",
				position:'absolute'
			},
			copyRightDiv:{
				width:'100%',
				textAlign : 'center',
				bottom:20,
				fontSize:20,
				fontFamily: '"Roboto Condenced"',
				position:'absolute'
			}
		},
		portrait:{
			loadDiv:{
				width:600,
				height:818,
				position:'absolute',
				left: "50%",
				top: "50%"
			},
			gameLogoDiv:{
				width:550,
				height:232,
				top: 160,
				left: 25,
				position:'absolute',
				backgroundSize:"contain",
				backgroundRepeat:"no-repeat"
			},
			progressBarDiv:{
				top:680,
				left:25,
				width:550,
				height:51,
				padding:0,
				position:'absolute'
			},
			progressDiv:{
				height:51,
				width:"0%",
				position:'absolute'
			},
			copyRightDiv:{
				width:'100%',
				textAlign : 'center',
				bottom:20,
				fontSize:20,
				fontFamily: '"Roboto Condenced"',
				position:'absolute'
			}
		}
	}
});