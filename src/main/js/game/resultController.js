/**
 * @module game/resultDialog
 * @description result dialog control
 */
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'skbJet/componentCRDC/gladRenderer/gladButton',
    'skbJet/componentCRDC/IwGameControllers/gameUtils',
    'skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer'
], function(msgBus, gr, loader, SKBeInstant, gladButton, gameUtils, audio) {

    var allFortuneRevealed = false;
    var resultData = null;
    var allMoneyRevealed = false;
    var messageCloseButton;
    var messageButtonClosed = true;

    function onGameParametersUpdated() {
        var scaleType = { 'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true };
        gr.lib._buttonMessageCloseText.setText(loader.i18n.Game.message_close);
        gameUtils.setTextStyle(gr.lib._buttonMessageCloseText, { padding: 2, dropShadow: true, dropShadowDistance: 2.5 });
        messageCloseButton = new gladButton(gr.lib._buttonMessageClose, "buttonBuy", scaleType);
        gameUtils.setTextStyle(gr.lib._winText, { padding: 4 });
        gameUtils.setTextStyle(gr.lib._nonWinText, { padding: 4 });
        gameUtils.setTextStyle(gr.lib._winTryText, { padding: 4 });
        gr.lib._winValue.autoFontFitText = true;

        function closeResultPlaque() {
            messageButtonClosed = true;
            gr.lib._BG_dim.show(false);
            hideDialog();
            audio.play('ButtonGeneric', 4);
        }
        gr.lib._MessagePlaque.show(false);
        messageCloseButton.click(closeResultPlaque);
        hideDialog();
    }

    function hideDialog() {
        gr.lib._MessagePlaque.show(false);
    }

    function resultDialogTextAni() {
        if (resultData.playResult === 'WIN') {
            var msgTextHere;
            if (SKBeInstant.config.wagerType === 'BUY') {
                msgTextHere = loader.i18n.Game.message_buyWin;
                gr.lib._winText.updateCurrentStyle({ _text: { _token: msgTextHere } });
                gr.lib._winText.show(true);
                gameUtils.setTextStyle(gr.lib._winText, { dropShadow: true, dropShadowDistance: 2.5 });
                gr.animMap._winTextAni.play();
            } else {
                if (Number(SKBeInstant.config.demosB4Move2MoneyButton) === -1) {
                    msgTextHere = loader.i18n.Game.message_anonymousTryWin;
                } else {
                    msgTextHere = loader.i18n.Game.message_tryWin;
                }
                gr.lib._winTryText.updateCurrentStyle({ _text: { _token: msgTextHere } });
                gr.lib._winTryText.show(true);
                gameUtils.setTextStyle(gr.lib._winTryText, { dropShadow: true, dropShadowDistance: 3 });
                gr.animMap._winTryTextAni.play();
            }

            gr.lib._winValue.setText(SKBeInstant.formatCurrency(resultData.prizeValue).formattedAmount);
            gr.lib._winValue.show(true);
            gameUtils.setTextStyle(gr.lib._winValue, { dropShadow: true, dropShadowDistance: 3 });
            gr.animMap._winValueAni.play();
            gr.animMap._winValueAni._onComplete = function() {
            };
        } else {
            gr.lib._winsValue.setText(SKBeInstant.formatCurrency(resultData.prizeValue).formattedAmount);
            gr.lib._nonWinText.setText(loader.i18n.Game.message_nonWin);
            gr.lib._nonWinText.show(true);
			gameUtils.setTextStyle(gr.lib._nonWinText, { dropShadow: true, dropShadowDistance: 2.5 });
        }
    }

    function showDialog() {
        gr.lib._BG_dim.show(true);
        gr.lib._winText.show(false);
        gr.lib._winValue.show(false);
        gr.lib._nonWinText.show(false);
        gr.lib._winTryText.show(false);
        gr.lib._MessagePlaque.show(true);
        gr.animMap._MessagePlaqueAni.play();
        gr.animMap._MessagePlaqueAni._onComplete = function() {
            gr.lib._messagePlaqueBand_00.gotoAndPlay("messagePlaqueBand", 0.4, true);
            gr.lib._messagePlaqueBand_01.gotoAndPlay("messagePlaqueBand", 0.4, true);
            resultDialogTextAni();
        };
    }

    function onStartUserInteraction(data) {
        resultData = data;
        allMoneyRevealed = false;
        allFortuneRevealed = false;
        hideDialog();        
    }

    function checkAllRevealed() {
        if (allMoneyRevealed && allFortuneRevealed) {
            //msgBus.publish('jLotteryGame.finishAllSymbolRevealed');
			msgBus.publish('jLotteryGame.ticketResultHasBeenSeen', {
				tierPrizeShown: resultData.prizeDivision,
				formattedAmountWonShown: resultData.prizeValue
			});
            msgBus.publish('disableUI');
            msgBus.publish('allRevealed');
        }
    }

    function onEnterResultScreenState() {
        messageButtonClosed = false;
        showDialog();
    }

    function onReStartUserInteraction(data) {
        messageButtonClosed = true;
        onStartUserInteraction(data);
    }

    function onReInitialize() {
        messageButtonClosed = true;
        hideDialog();
    }

    function onPlayerWantsPlayAgain() {
        messageButtonClosed = true;
        gr.lib._BG_dim.show(false);
        hideDialog();
    }

    function onTutorialIsShown() {
        if (gr.lib._MessagePlaque.pixiContainer.visible) {
            hideDialog();
            gr.lib._BG_dim.show(true);
        }
    }

    function onTutorialIsHide() {
        if (!messageButtonClosed) {
            gr.lib._MessagePlaque.show(true);
            if (resultData && resultData.playResult === 'WIN') {}
        } else {
            gr.lib._BG_dim.show(false);
        }
    }

    msgBus.subscribe('tutorialIsShown', onTutorialIsShown);
    msgBus.subscribe('tutorialIsHide', onTutorialIsHide);
    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('jLottery.reStartUserInteraction', onReStartUserInteraction);
    msgBus.subscribe('allMoneyRevealed', function() {
        allMoneyRevealed = true;
        checkAllRevealed();
    });
    msgBus.subscribe('allFortuneRevealed', function() {
        allFortuneRevealed = true;
        checkAllRevealed();
    });
    msgBus.subscribe('playerWantsPlayAgain', onPlayerWantsPlayAgain);
    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('jLottery.enterResultScreenState', onEnterResultScreenState);
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);

    return {};
});