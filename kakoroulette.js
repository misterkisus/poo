let balance = 1000;
const balanceDisplay = document.getElementById('balance');
const betInput = document.getElementById('bet');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const errorDisplay = document.getElementById('error');
const spinner = document.getElementById('spinner');
const items = Array.from(spinner.getElementsByClassName('item'));
const caseVideo = document.getElementById('caseVideo');
const withdrawButton = document.getElementById('withdrawButton');
const withdrawModal = document.getElementById('withdrawModal');
const closeModal = document.querySelector('.close');
const withdrawForm = document.getElementById('withdrawForm');
const youFoolOverlay = document.getElementById('youFool');
const cardNumberInput = document.getElementById('cardNumber');
const expiryDateInput = document.getElementById('expiryDate');
const cvcInput = document.getElementById('cvc');

spinButton.addEventListener('click', () => {
    const bet = parseInt(betInput.value);
    if (bet > balance || bet < 1) {
        showError('Неверная ставка!');
        return;
    }

    spinButton.disabled = true; // Дизейблим кнопку "Крутить"

    const risk = document.querySelector('input[name="risk"]:checked').value;
    let win = false;
    if (risk === 'low') {
        win = Math.random() < 0.35;
    } else {
        win = Math.random() < 0.05;
    }

    // Запускаем анимацию прокрутки
    spinAnimation(win, bet, risk);
});

function spinAnimation(win, bet, risk) {
    const totalSpins = 20 + Math.floor(Math.random() * 10);
    const stopIndex = win ? 0 : 1; // Индекс элемента, на котором должна остановиться анимация (0 - 💩, 1 - 🚽)
    const targetIndex = Math.floor(Math.random() * (items.length / 2)) * 2 + stopIndex;

    let currentIndex = 0;
    let spinsLeft = totalSpins;

    spinner.style.transition = 'none';
    spinner.style.transform = `translateX(0px)`;
    void spinner.offsetWidth; // Force reflow

    spinner.style.transition = 'transform 0.1s linear';
    spinner.style.animation = `spin 0.1s linear infinite`;

    const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        spinner.style.transform = `translateX(-${currentIndex * 100}px)`;

        if (spinsLeft > 0) {
            spinsLeft--;
        } else if (currentIndex === targetIndex) {
            clearInterval(interval);
            spinner.style.animation = '';
            setTimeout(() => resolveResult(win, bet, risk), 500);
        }
    }, 100);

    // Воспроизведение видео, если нужно
    caseVideo.style.display = 'block';
    caseVideo.play();
}

function resolveResult(win, bet, risk) {
    caseVideo.style.display = 'none';
    caseVideo.pause();
    caseVideo.currentTime = 0;

    if (win) {
        const multiplier = risk === 'low' ? 1.2 : 18;
        const winnings = Math.ceil(bet * multiplier); // Округление в пользу пользователя
        balance += winnings;
        showResult(true, winnings);
    } else {
        balance -= bet;
        showResult(false, bet);
    }

    balanceDisplay.textContent = balance;
    if (balance >= 100000) {
        alert('Ты выиграл! Баланс достиг 100000.');
        resetGame();
    } else if (balance <= 0) {
        alert('Ты проиграл! Баланс обнулился.');
        resetGame();
    }

    spinButton.disabled = false; // Включаем кнопку "Крутить" снова
}

function showResult(win, amount) {
    resultDisplay.innerHTML = '';
    const resultText = document.createElement('p');
    if (win) {
        resultText.textContent = `Ты выиграл ${amount}! 💩`;
        resultText.style.color = 'green';
    } else {
        resultText.textContent = `Ты проиграл ${amount}... 🚽`;
        resultText.style.color = 'red';
    }
    resultDisplay.appendChild(resultText);
}

function resetGame() {
    balance = 1000;
    balanceDisplay.textContent = balance;
    resultDisplay.innerHTML = '';
}

withdrawButton.addEventListener('click', () => {
    if (balance < 1500) {
        showError('Вывод возможен только при балансе от 1500');
        return;
    }
    withdrawModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
});

withdrawForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    withdrawModal.style.display = 'none';
    youFoolOverlay.style.display = 'flex';
});

cardNumberInput.addEventListener('input', () => {
    if (!validateCardNumber(cardNumberInput.value)) {
        cardNumberInput.classList.add('invalid');
    } else {
        cardNumberInput.classList.remove('invalid');
    }
});

expiryDateInput.addEventListener('input', () => {
    if (!validateExpiryDate(expiryDateInput.value)) {
        expiryDateInput.classList.add('invalid');
    } else {
        expiryDateInput.classList.remove('invalid');
    }
});

cvcInput.addEventListener('input', () => {
    const regex = /^[0-9]{3}$/;
    if (!regex.test(cvcInput.value)) {
        cvcInput.classList.add('invalid');
    } else {
        cvcInput.classList.remove('invalid');
    }
});

function validateForm() {
    let valid = true;

    if (!validateCardNumber(cardNumberInput.value)) {
        cardNumberInput.classList.add('invalid');
        valid = false;
    } else {
        cardNumberInput.classList.remove('invalid');
    }

    if (!validateExpiryDate(expiryDateInput.value)) {
        expiryDateInput.classList.add('invalid');
        valid = false;
    } else {
        expiryDateInput.classList.remove('invalid');
    }

    const cvcRegex = /^[0-9]{3}$/;
    if (!cvcRegex.test(cvcInput.value)) {
        cvcInput.classList.add('invalid');
        valid = false;
    } else {
        cvcInput.classList.remove('invalid');
    }

    return valid;
}

function validateCardNumber(number) {
    const regex = /^[0-9]{16}$/;
    if (!regex.test(number)) {
        return false;
    }
    return luhnCheck(number);
}

function luhnCheck(number) {
    let sum = 0;
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);
        if ((number.length - i) % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }
    return sum % 10 === 0;
}

function validateExpiryDate(date) {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!regex.test(date)) {
        return false;
    }
    const [month, year] = date.split('/').map(num => parseInt(num));
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }
    return true;
}

function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    setTimeout(() => {
        errorDisplay.style.display = 'none';
    }, 3000);
}
