/**
 * @module game/revealAllButton
 * @description reveal all button control
 */
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'skbJet/componentCRDC/gladRenderer/gladButton',
    'skbJet/componentCRDC/IwGameControllers/gameUtils'
], function(msgBus, audio, gr, loader, SKBeInstant, gladButton, gameUtils) {

    var allNeedToTeveal = [];
    var moneyRewards = [];
    var playButton;
    var prizeRevealDelay;
    var symbolRevealDelay;
    var scenarioData = null;
	var enable = false;
    var revealArrayTimer = [];
    function onGameParametersUpdated() {
        var scaleType = { 'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true };
        if (SKBeInstant.config.customBehaviorParams) {
            prizeRevealDelay = SKBeInstant.config.customBehaviorParams.prizeRevealInterval || 1000;
            symbolRevealDelay = SKBeInstant.config.customBehaviorParams.symbolInterval || 500;
        } else {
            prizeRevealDelay = 1000;
            symbolRevealDelay = 500;
        }
        playButton = new gladButton(gr.lib._buttonAutoPlay, "buttonBuy", scaleType);
        gr.lib._autoPlayText.autoFontFitText = true;
        gr.lib._autoPlayText.setText(loader.i18n.Game.button_autoPlay);
        gameUtils.setTextStyle(gr.lib._autoPlayText, { padding: 2, dropShadow: true, dropShadowDistance: 2.5 });
        playButton.show(false);
        for (var i = 0; i < 30; i++) {
            i = i < 10 ? "0" + i : i;
            allNeedToTeveal.push(gr.lib['_slabstone_' + i]);
        }
        for (i = 0; i < 6; i++) {
            allNeedToTeveal.splice(i + (5 * (i + 1)), 0, gr.lib["_breakStones_0" + i]);
            moneyRewards.push(gr.lib["_breakStones_0" + i]);
        }
        enable = SKBeInstant.config.autoRevealEnabled === false? false: true;
    }

    function resetAll() {
        for (var i = 0; i < allNeedToTeveal.length; i++) {
            allNeedToTeveal[i].off("click", this.clickListner);
        }
		playButton.click(null);
    }

    function revealAll() {
        var symbolRevealInterval = 0;
        msgBus.publish('disableUI');
        revealArrayTimer = [];
        for (var i = 0; i < allNeedToTeveal.length; i++) {
            if (!allNeedToTeveal[i].revealFlag) {
                allNeedToTeveal[i].off("click", this.clickListner);
                allNeedToTeveal[i].pixiContainer.$sprite.interactive = false;
                var timer = gr.getTimer().setTimeout(allNeedToTeveal[i].reveal, symbolRevealInterval);
                revealArrayTimer.push(timer);
                if (i !== 0 && (i + 1) % 6 === 0) {
                    symbolRevealInterval += prizeRevealDelay;
                } else {
                    if (scenarioData[i] === "X") {
                        symbolRevealDelay = 3500;
                    } else {
                        symbolRevealDelay = 500;
                    }
                    symbolRevealInterval += symbolRevealDelay;
                }
            }
        }
        var fortune = null;
        for (i = 0; i < 30; i++) {
            i = i < 10 ? "0" + i : i;
            fortune = gr.lib['_slabstone_' + i];
            if (!fortune.revealFlag) {
                fortune.mouseEnabled = false;
            }
        }
        for (i = 0; i < moneyRewards.length; i++) {
            if (!moneyRewards[i].revealFlag) {
                moneyRewards[i].mouseEnabled = false;
            }
        }

        playButton.show(false);
    }

    function onStartUserInteraction(data) {
        //fix FORTUNEGOD-30 UI display abnormally if click “Play with Money” button quickly in try mode.
        //2016.08.30 Amelia
        scenarioData = data.scenario.match(/(\w)/g);
        if(enable){
            if(data.scenario){
				gr.lib._buttonAutoPlay.setImage("buttonBuy");
				gr.lib._buttonAutoPlay.show(true);
            }
			playButton.click(addEventlistener);
        }else{
            gr.lib._buttonAutoPlay.show(false);
        }
        if (SKBeInstant.config.gameType !== "ticketReady") {
            //msgBus.publish("enableUI");
        }
    }

    function addEventlistener() {
		revealAll();
		audio.play('ButtonGeneric', 4);
    }

    function onReStartUserInteraction(data) {
        onStartUserInteraction(data);
    }

    function onReInitialize() {
        resetAll();
        playButton.show(false);
    }

    function onReset() {
        onReInitialize();
    }

    function onDisableUI() {
        playButton.show(false);
    }

    function onEnableUI() {
		if(enable){
			playButton.show(true);
		}
    }

    function onError(){
        for(var i = 0; i<revealArrayTimer.length; i++){
            if(revealArrayTimer[i] !== null){
                gr.getTimer().clearTimeout(revealArrayTimer[i]);
                revealArrayTimer[i] = null;
            }
        }
    }
    
    msgBus.subscribe('reset', onReset);
    msgBus.subscribe('enableUI', onEnableUI);
    msgBus.subscribe('disableUI', onDisableUI);
    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('jLottery.reStartUserInteraction', onReStartUserInteraction);
    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('allRevealed', function() {
        playButton.show(false);
    });
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);
    msgBus.subscribe('winboxError', onError);
    return {};
});