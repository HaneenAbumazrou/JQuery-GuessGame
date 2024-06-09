let randomNumber;
let trialsLeft = 10;
let currentLanguage = 'en';
let translationData = {};
let translationsLoaded = false; 

function init() {
    $('.startButton').on('click', startGame);
    $('.submitGuess').on('click', submitGuess);
    $('.languageSelect').on('change', changeLanguage);
    loadTranslationData(currentLanguage);
}

function loadTranslationData(language) {
    const script = document.createElement('script');
    script.src = `translationData${language.toUpperCase()}.js`;
    script.onload = () => {
        translationData = language === 'en' ? translationDataEn : translationDataAr;
        translationsLoaded = true;
        translatePage();
        startGame();
    };
    document.head.appendChild(script);
}

function changeLanguage() {
    currentLanguage = $('.languageSelect').val();
    loadTranslationData(currentLanguage);
}

function translatePage() {
    $('[data-translate]').each(function() {
        const key = $(this).data('translate');
        $(this).text(typeof translationData[key] === 'function' ? translationData[key]() : translationData[key]);
    });
}

function T(key) {
    return typeof translationData[key] === 'function' ? translationData[key]() : translationData[key];
}

function startGame() {
    if (!translationsLoaded) return;
    randomNumber = generateRandomNumber();
    trialsLeft = 10;
    hide('.gameArea', false);
    setText('.resultMessage', '');
    setText('.trialsLeft', T('trialsLeft') + '10');
    setValue('.userGuess', '');
    disable('.userGuess', false);
    disable('.submitGuess', false);
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function hide(className, isHide) {
    $(className).css('display', isHide ? 'none' : 'block');
}

function disable(className, isDisabled) {
    $(className).prop('disabled', isDisabled);
}

function setText(className, text) {
    $(className).text(text);
}

function setValue(className, value) {
    $(className).val(value);
}

function clearScreen() {
    setText('.resultMessage', '');
    setValue('.userGuess', '');
}

function submitGuess() {
    const userGuess = parseInt($('.userGuess').val());
    trialsLeft--;

    if (userGuess === randomNumber) {
        setText('.resultMessage', T('correctGuess'));
        disable('.userGuess', true);
        disable('.submitGuess', true);
    } else if (trialsLeft === 0) {
        setText('.resultMessage', T('gameOver')(randomNumber));
        disable('.userGuess', true);
        disable('.submitGuess', true);
    } else {
        if (userGuess > randomNumber) {
            setText('.resultMessage', T('larger'));
        } else {
            setText('.resultMessage', T('smaller'));
        }
    }

    setText('.trialsLeft', T('trialsLeft') + trialsLeft);
}

$(document).ready(init);
