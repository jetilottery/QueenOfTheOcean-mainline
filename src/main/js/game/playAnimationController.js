/**
 * @module game/playAnimationController
 * @description 
 */
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'skbJet/component/SKBeInstant/SKBeInstant',
    "skbJet/component/gladPixiRenderer/Sprite",
    'skbJet/componentCRDC/IwGameControllers/gameUtils'
], function(msgBus, audio, gr, loader, SKBeInstant, Sprite, gameUtils) {
    var resultData;
    var resultGemstone;
    var resultMoney;
    var gemstoneRow = [],
        scenarioDataMatrix = [];
    var gemstoneTypeList = ["blueGemAni_0000", "greenGemAni_0000", "orangeGemAni_0000", "purpleGemAni_0000", "redGemAni_0000", "yellowGemAni_0000", "poolBlueGemAni_0000", "whiteGemAni_0000", "bonusGemAni_0026"];
    var noWinDelay;
    var winValueCheck = 0;
    var winValue = [];
    var winMap = {};
    var winMoneyPlaying = false;
    var gemstoneList = ["A", "B", "C", "D", "E", "F", "G", "H"];
    var symbolResidue = 30;
    var winSymbolResidue = 6;
    var clickedNum = 0;

    var winChannel = 0;
    var symbolChannel = 0;
    var noWinDelayInterval = null;
    var sunTimeInterval = null;
    var flashTimeInterval = null;
    var newGame = false;
    var rowNumberNoWin = true;

    var flashLight = [];
	var symbolResidueDisableUI = 30;
    function flashingLight() {
        var randomNumber = Math.floor(Math.random() * flashLight.length);
		var currentNumber;
        if(flashLight.length > 0){
            currentNumber = flashLight[randomNumber];
        }else{
            clearTimeout(flashTimeInterval);
            return;
        }
        gr.lib["_ironLight_" + currentNumber].show(true);
        gr.lib["_ironLight_" + currentNumber].gotoAndPlay("ironLight", 0.4);
        gr.lib["_ironLight_" + currentNumber].onComplete = function() {
            this.show(false);
        };
        flashTimeInterval = gr.getTimer().setTimeout(flashingLight, 4000);
    }

    function initGame() {
        if (SKBeInstant.config.customBehaviorParams) {
            noWinDelay = SKBeInstant.config.customBehaviorParams.noWinInterval || 250;
        } else {
            noWinDelay = 250;
        }
        for (var i = 0; i < 6; i++) {
            gemstoneRow[i] = [];
            scenarioDataMatrix[i] = [];
            //Light of money
            gr.lib["_winLight_0" + i].show(false);
            gr.lib["_StoneBG_0" + i].show(false);
            gr.lib["_light_II_0" + i].show(false);
            gr.lib["_loseNumber_value_0" + i].show(false);
        }
        for (i = 0; i < 30; i++) {
            i = addZero(i);
            flashLight.push(i);
            gr.lib["_gemStone_" + i].pixiContainer.$sprite.alpha = 0;
            gr.lib["_star_" + i].show(false);
            gr.lib["_light_I_" + i].show(false);
            gr.lib["_stoneDim_" + i].show(false);
            gr.lib["_star_light_" + i].show(false);
            gr.lib["_ironLight_" + i].show(false);
        }
        gr.lib._sun.show(false);
        gr.lib._sun.onComplete = function() { gr.lib._sun.show(false); };
        gr.lib._ocean.gotoAndPlay("oceanAni", 0.5, true);
        gr.lib._BG_dim.on("click", function(event) {
            event.stopPropagation();
        });
    }
    // resetAll function for reStart and moveToManey
    function resetAll() {
        newGame = false;
        gr.lib._queen.stopPlay();
        gr.lib._sun.show(false);
        if (noWinDelayInterval) { clearTimeout(noWinDelayInterval); }
		if(flashTimeInterval){ clearTimeout(flashTimeInterval); }
        // Gem layer covering
        for (var i = 0; i < 30; i++) {
            i = addZero(i);
            flashLight.push(i);
            gr.lib["_slabstone_" + i].stopPlay();
            gr.lib["_slabstone_" + i].off("click", this.clickListner);
            gr.lib["_slabstone_" + i].setImage("slideWood_" + i + "_0000");
            gr.lib["_slabstone_" + i].pixiContainer.$sprite.interactive = false;
            gr.lib["_slabstone_" + i].pixiContainer.$sprite.cursor = "auto";
            gr.lib["_light_I_" + i].stopPlay();
            gr.lib["_light_I_" + i].show(false);
            gr.lib["_stoneDim_" + i].show(false);
            gr.lib["_gemStone_" + i].pixiContainer.$sprite.alpha = 0;
            gr.lib["_star_" + i].show(false);
            gr.lib["_star_light_" + i].show(false);
            gr.lib["_ironLight_" + i].show(false);
        }
        for (i = 0; i < 6; i++) {
            gemstoneRow[i] = [];
            scenarioDataMatrix[i] = [];
            gr.lib["_light_II_0" + i].stopPlay();
            gr.lib["_light_II_0" + i].show(false);
            gr.lib["_breakStones_0" + i].stopPlay();
            gr.lib["_winLight_0" + i].stopPlay();
            gr.lib["_winLight_0" + i].show(false);
            gr.lib["_breakStones_0" + i].setImage("woodDisappear_0000");
            gr.lib["_breakStones_0" + i].pixiContainer.$sprite.interactive = false;
            gr.lib["_breakStones_0" + i].pixiContainer.$sprite.cursor = "auto";
            gr.lib["_breakStones_0" + i].show(true);
            gr.lib["_winNumber_value_0" + i].setText("");
            gr.lib["_winNumber_value_0" + i].show(true);
            gr.lib["_loseNumber_value_0" + i].setText("");
            gr.lib["_loseNumber_value_0" + i].show(false);
            gr.lib["_StoneBG_0" + i].show(false);
        }
        winChannel = 0;
        symbolChannel = 0;
        symbolResidue = 30;
        winSymbolResidue = 6;
		symbolResidueDisableUI = 30;
        clickedNum = 0;
        winMap = {};
        winMoneyPlaying = false;
        noWinDelayInterval = null;
        sunTimeInterval = null;
    }

    function addZero(par) {
        par = par < 10 ? "0" + par : par;
        return par;
    }

    function clearTimeout(timeout) {
        if (timeout !== null) {
            gr.getTimer().clearTimeout(timeout);
            timeout = null;
        }
    }

    function checkAllRevealed() {
        var isAllRevealed = true;
        if (symbolResidue === 0) {
            msgBus.publish("allFortuneRevealed");
        } else {
            isAllRevealed = false;
        }
        return isAllRevealed;
    }

    function checkAllMoneyRevealed() {
        var isAllMoneyRevealed = true;
        if (winSymbolResidue === 0) {
            if (winValueCheck !== resultData.prizeValue) {
                msgBus.publish('winboxError', {errorCode: '29000'});
                return;
            }
            msgBus.publish("allMoneyRevealed");
        } else {
            isAllMoneyRevealed = false;
        }
        return isAllMoneyRevealed;
    }

    function updateWinValue() {
        var result = 0;
        for (var symbol in winMap) {
            result += Number(winMap[symbol]);
        }
        winValueCheck = result;
        if (winValueCheck > resultData.prizeValue) {
            msgBus.publish('winboxError', {errorCode: '29000'});
            return;
        }
        gr.lib._winsValue.setText(SKBeInstant.formatCurrency(result).formattedAmount);
        gameUtils.fixMeter(gr);
    }

    function winBehavior(rowNumber) {
        var spriteCurrentNumber = null;
        updateWinValue();
        gr.lib["_light_II_0" + rowNumber].show(true);
        gr.lib["_StoneBG_0" + rowNumber].show(true);
        for (var i = 0; i < 6; i++) {
            if (gr.lib["_light_II_0" + i] && gr.lib["_light_II_0" + i].pixiContainer.$sprite.playing) {
                spriteCurrentNumber = gr.lib["_light_II_0" + i].pixiContainer.$sprite.currentFrame;
                break;
            }
        }
        gr.lib["_light_II_0" + rowNumber].onComplete = function() {
            for (i = 0; i < 6; i++) {
                if (gr.lib["_light_II_0" + i] && gr.lib["_light_II_0" + i].pixiContainer.$sprite.visible) {
                    gr.lib["_light_II_0" + i].stopPlay();
                    gr.lib["_light_II_0" + i].gotoAndPlay("light_II", 0.5, true);
                }
            }
        };
        if (spriteCurrentNumber) {
            gr.lib["_light_II_0" + rowNumber].gotoAndPlay("light_II", 0.5, false, spriteCurrentNumber);
        } else {
            gr.lib["_light_II_0" + rowNumber].gotoAndPlay("light_II", 0.5, false);
        }
        audio.play("Win", 4);
    }

    function ligthAnimation(num, currentSymbolAnimName) {
        gr.lib["_gemStone_" + num].onComplete = function() {
            gr.lib["_light_I_" + num].show(true);
            gr.lib["_light_I_" + num].gotoAndPlay(currentSymbolAnimName, 0.5, true);
        };
    }

    function gemstoneAnimation(nameNum, clickCurrentData) {
        var symbolRevealCount = 0;
        var symbolThreeSame = 0;
        var rowNumber = Math.floor(nameNum / 5);
        var index = nameNum - 5 * rowNumber;
        var rowMoneyHaveRevealed = gr.lib["_breakStones_0" + rowNumber].revealFlag;
        gemstoneRow[rowNumber][index] = clickCurrentData;
        for (var i = 0; i < 5; i++) {
            if (gemstoneRow[rowNumber][i] !== undefined) {
                symbolRevealCount++;
            }
        }
        if (clickCurrentData === "X") {
            audio.play("WinInstant", 5);
            //eInstant win
            nameNum = addZero(nameNum);
            // X animation
            gr.lib["_stoneDim_" + nameNum].show(false);
            gr.lib["_star_" + nameNum].show(true);
            gr.lib["_star_" + nameNum].gotoAndPlay("bonusGemAni", 0.6, false);
            gr.lib["_star_" + nameNum].onComplete = function() {
                gr.lib["_star_light_" + nameNum].show(true);
                gr.lib["_star_light_" + nameNum].gotoAndPlay("bonusLighting", 0.3, true);
            };
        } else {
            // symbol win
            var j;
            // Determine whether won when each line have three revealFlag
            if (symbolRevealCount > 2) {
                for (i = 0; i < 5; i++) {
                    if (gemstoneRow[rowNumber][i] === clickCurrentData) {
                        symbolThreeSame++;
                    }
                }
                // When three same symbol have been revealed.
                if (symbolThreeSame === 3) {
                    var currentSymbolAnimName = getCurrentAnimName(clickCurrentData);
                    for (i = 0; i < gemstoneRow[rowNumber].length; i++) {
                        if (gemstoneRow[rowNumber][i] === clickCurrentData) {
                            j = addZero(i + (rowNumber * 5));
                            gr.lib["_gemStone_" + j].gotoAndPlay(currentSymbolAnimName.animation_1, 0.7, false);
                            ligthAnimation(j, currentSymbolAnimName.animation_2);
                        }
                    }
                    audio.play("Match", 3);
                }
            }
        }
        // When symbol of a row have been revealed.
        if (symbolRevealCount === 5) {
            var symbolNoWin = true;
            var eInstantNoWin = true;
            var c;
            for (i = 0; i < 5; i++) {
                c = i + (rowNumber * 5);
                c = addZero(c);
                if (gr.lib["_light_I_" + c].pixiContainer.visible ||
                    gr.lib["_gemStone_" + c].pixiContainer.$sprite.playing) {
                    symbolNoWin = false;
                } else if (!gr.lib["_stoneDim_" + c].visible) {
                    gr.lib["_stoneDim_" + c].show(true);
                }
            }
            if (symbolNoWin) {
                for (i = 0; i < gemstoneRow[rowNumber].length; i++) {
                    c = i + (rowNumber * 5);
                    c = addZero(c);
                    if (gemstoneRow[rowNumber][i] === "X") {
                        eInstantNoWin = false;
                        gr.lib["_stoneDim_" + c].show(false);
                    } else {
                        gr.lib["_stoneDim_" + c].show(true);
                    }
                }
            }
            if (symbolNoWin && eInstantNoWin) {
                gr.lib["_winNumber_value_0" + rowNumber].show(false);
                gr.lib["_loseNumber_value_0" + rowNumber].show(true);
            }
            // Auto reveal money
            if (gr.lib._buttonAutoPlay) {
                noWinDelayInterval = gr.getTimer().setTimeout(function() {
                    if (!rowMoneyHaveRevealed && newGame) {
                        gr.lib["_breakStones_0" + rowNumber].reveal();
                    }
                }, noWinDelay);
            }
        }
        //If row money have been revealed,then judge how to animation.
        if (rowMoneyHaveRevealed) {
            if (symbolRevealCount >= 3 && symbolThreeSame === 3) {
                winMap[rowNumber] = winValue[rowNumber];
                winBehavior(rowNumber);
            } else {
                checkEinstantWin(rowNumber);
            }
            if (rowNumberNoWin && symbolRevealCount === 5 && symbolRevealCount < 3) {
                gr.lib["_winNumber_value_0" + rowNumber].show(false);
                gr.lib["_loseNumber_value_0" + rowNumber].show(true);
            }
        }
        //gr.getTimer().setTimeout(checkAllRevealed,1000);
        symbolResidue--;
        checkAllRevealed();
    }

    function queenAnim() {
        if (!gr.lib._queen.pixiContainer.$sprite.playing) {
            gr.lib._queen.gotoAndPlay("womanAni", 0.7, true);
        }
    }

    function sunAnimLoop() {
        var middleRandom = Math.floor(Math.random() * (10000 - 7000) + 7000);
        gr.lib._sun.show(true);
        gr.lib._sun.gotoAndPlay("sunAni", 0.7, false);
        sunTimeInterval = gr.getTimer().setTimeout(sunAnimLoop, middleRandom);
    }

    function getCurrentAnimName(result) {
        switch (result) {
            case "A":
                return {
                    "animation_1": "blueGemAni",
                    "animation_2": "blueLighting"
                };
            case "B":
                return {
                    "animation_1": "greenGemAni",
                    "animation_2": "GreenLighting"
                };
            case "C":
                return {
                    "animation_1": "orangeGemAni",
                    "animation_2": "orangeLighting"
                };
            case "D":
                return {
                    "animation_1": "purpleGemAni",
                    "animation_2": "purpleLighting"
                };
            case "E":
                return {
                    "animation_1": "redGemAni",
                    "animation_2": "redLighting"
                };
            case "F":
                return {
                    "animation_1": "yellowGemAni",
                    "animation_2": "yellowLighting"
                };
            case "G":
                return {
                    "animation_1": "poolBlueGemAni",
                    "animation_2": "poolBlueLighting"
                };
            case "H":
                return {
                    "animation_1": "whiteGemAni",
                    "animation_2": "whiteLighting"
                };
        }
    }

    function checkEinstantWin(rowNumber) {
        var k;
        for (var i = 0; i < gemstoneRow[rowNumber].length; i++) {
            k = i + (rowNumber * 5);
            if (resultGemstone[k] === "X") {
                rowNumberNoWin = false;
                k = addZero(k);
                if (gr.lib["_slabstone_" + k].revealFlag) {
                    winMap[rowNumber] = winValue[rowNumber];
                    winBehavior(rowNumber);
                    break;
                }

            }
        }
    }

    function moneyRewardsAnimation(nameNum) {
        var symbolRevealCount = 0;
        var rowMoneyHaveRevealed = gr.lib["_breakStones_0" + nameNum].revealFlag;
        for (var i = 0; i < 5; i++) {
            if (gemstoneRow[nameNum][i] !== undefined) {
                symbolRevealCount++;
            }
        }
        if (symbolRevealCount >= 3) {
            for (i = 0; i < symbolRevealCount; i++) {
                var j = i + (5 * nameNum);
                j = addZero(j);
                var rowHaveVisible = gr.lib["_light_I_" + j].pixiContainer.visible;
                if (rowHaveVisible) {
                    winMap[nameNum] = winValue[nameNum];
                    winBehavior(nameNum);
                    break;
                }
            }
        }
        if (rowMoneyHaveRevealed) {
            checkEinstantWin(nameNum);
        }
        winSymbolResidue--;
        checkAllMoneyRevealed();
    }

    function setGemstoneRevealAction(gemstoneSymbol, func, animationName) {
        var gemstone = gemstoneSymbol;
        var nameNum = gemstone.getName().match(/(\d+)/g).join();

        // gemstone animation
        var animation;
        var audioReveal;
        var channel;
        var clickCurrentData = null;
        if (animationName === "woodDisappear") {
            animation = animationName;
            audioReveal = "Reveal2";
            channel = "2";
        } else {
            animation = animationName + nameNum;
            audioReveal = "Reveal1";
            channel = "1";
        }
        gemstone.reveal = function() {
            if (!gemstone.revealFlag) {
                if (!gr.lib._buttonAutoPlay.pixiContainer.visible) {
                    clearTimeout(flashTimeInterval);
                }
                gemstone.pixiContainer.$sprite.cursor = "default";
                gemstone.revealFlag = true;
                gemstone.off("click", this.clickListner);
                audio.play(audioReveal, channel);
                if (animation === "woodDisappear") {
                    gemstone.gotoAndPlay(animation);
                } else {
                    clickCurrentData = scenarioDataMatrix[Math.floor(nameNum/5)].shift();
                    setGemstoneType(clickCurrentData, nameNum);
					symbolResidueDisableUI--;
					if(symbolResidueDisableUI === 0){
						msgBus.publish('disableUI');
					}
                    flashLight.forEach(function(item, index, array) {
                        if (Number(nameNum) === Number(item)) {
                            array.splice(index, 1);
                        }
                    });
                    gemstone.gotoAndPlay(animation, 0.6);
                }
                gemstone.pixiContainer.$sprite.onComplete = function() {
                    nameNum = nameNum < 10 ? nameNum.substr(1) : nameNum;
                    func(nameNum, clickCurrentData);
                };
            }
        };
    }

    function handlerRevealAction(gemstoneSymbol, func, animationName) {
        var gemstone = gr.lib[gemstoneSymbol];
        gemstone.revealFlag = false;
        setGemstoneRevealAction(gemstone, func, animationName);
        gemstone.clickListner = gemstone.on("click", function(event) {
            event.stopPropagation();
            gemstone.reveal();
        });
		gemstone.pixiContainer.$sprite.interactive = true;
		gemstone.pixiContainer.$sprite.cursor = "pointer";
        gemstone.mouseEnabled = true;
    }

    function setRevealAction() {
        for (var i = 0; i < 30; i++) {
            i = addZero(i);
            handlerRevealAction("_slabstone_" + i, gemstoneAnimation, "slideWood_");
        }
        for (i = 0; i < 6; i++) {
            handlerRevealAction("_breakStones_0" + i, moneyRewardsAnimation, "woodDisappear");
        }
    }
    // Set gemstones's type   
    function setGemstoneType(clickCurrentData, index) {
        for (var i = 0; i < gemstoneList.length; i++) {
            if (clickCurrentData === gemstoneList[i]) {
                gr.lib["_gemStone_" + index].pixiContainer.$sprite.alpha = 1;
                gr.lib["_gemStone_" + index].setImage(gemstoneTypeList[i]);
            }
        }
    }
    //Set prizeTable
    function setPrizeTable() {
        var prizeTable = resultData.prizeTable;
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 10; j++) {
                if (resultMoney[i] === prizeTable[j].description) {
                    winValue[i] = prizeTable[j].prize;
                    i = addZero(i);
                    gr.lib["_winNumber_value_" + i].autoFontFitText = true;
                    gr.lib["_loseNumber_value_" + i].autoFontFitText = true;
                    gameUtils.setTextStyle(gr.lib["_winNumber_value_" + i], { dropShadow: true, dropShadowDistance: 2, dropShadowAlpha: 0.6 });
                    gameUtils.setTextStyle(gr.lib["_loseNumber_value_" + i], { dropShadow: true, dropShadowDistance: 2, dropShadowAlpha: 0.6 });
                    gr.lib["_winNumber_value_" + i].setText(SKBeInstant.formatCurrency(prizeTable[j].prize).formattedAmount);
                    gr.lib["_loseNumber_value_" + i].setText(SKBeInstant.formatCurrency(prizeTable[j].prize).formattedAmount);
                }
            }
        }
    }

    function onGameParametersUpdated() {
        initGame();
    }

    function baseGameResultDataHandler(baseGameResultData){
        baseGameResultData.forEach(function(item, index){
            scenarioDataMatrix[Math.floor(index/5)].push(item);
        });
    }

    function onStartUserInteraction(data) {
        newGame = true;
        resultData = data;
        winValueCheck = 0;
        if (!data.scenario) {
            return;
        }
        resultGemstone = data.scenario.match(/(\w+),/g).join("").match(/(\w+)/g).join("").split("");
        resultMoney = data.scenario.match(/,(\w{1})/g).join("").match(/(\w+)/g);
        if (!resultGemstone) {
            msgBus.publish('error', 'Cannot parse server response');
        }
        baseGameResultDataHandler(resultGemstone);
        setPrizeTable();
        setRevealAction();
        queenAnim();
        flashingLight();
        if (sunTimeInterval === null) {
            gr.getTimer().setTimeout(sunAnimLoop, 2500);
        }
    }

    function onReStartUserInteraction(data) {
        onStartUserInteraction(data);
    }

    function onReInitialize() {
        resetAll();
    }

    function onEnterResultScreenState() {
        clearTimeout(sunTimeInterval);
        clearTimeout(flashTimeInterval);
    }

    function onReset() {
        resetAll();
        gr.lib._ocean.stopPlay();
        clearTimeout(sunTimeInterval);
    }

    function onPlayerWantsPlayAgain() {
        resetAll();
    }

    msgBus.subscribe('jLotterySKB.reset', onReset);
    msgBus.subscribe('resetAll', resetAll);
    msgBus.subscribe('playerWantsPlayAgain', onPlayerWantsPlayAgain);
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);
    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('jLottery.reStartUserInteraction', onReStartUserInteraction);
    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('jLottery.enterResultScreenState', onEnterResultScreenState);

    return {};
});