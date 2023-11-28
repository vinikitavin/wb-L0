
const productData = {
    1: { price: 522, stock: 2, discount: 0.5 },
    2: { price: 10500, stock: 100500, discount: 0.75 },
    3: { price: 247, stock: 2, discount: 0.25 }
};

const checkboxes = {
    'card-1-checkbox': document.getElementById('card-1-checkbox'),
    'card-2-checkbox': document.getElementById('card-2-checkbox'),
    'card-3-checkbox': document.getElementById('card-3-checkbox')
};

const productCards = document.querySelectorAll('.goods__card');
const totalSumElement = document.getElementById('totalSum');
const totalFullSumElement = document.getElementById('total__quantity-value');
const totalDiscountElement = document.getElementById('total__discount-value');
const mainCheckbox = document.getElementById('main-checkbox');

mainCheckbox.addEventListener('change', function () {
    const productCheckboxes = [checkboxes['card-1-checkbox'], checkboxes['card-2-checkbox'], checkboxes['card-3-checkbox']];
    productCheckboxes.forEach(function (checkbox) {
        checkbox.checked = mainCheckbox.checked;
    });

    updateTotalSum();
});

productCards.forEach(function (card, index) {
    const minusBtn = card.querySelector('.card__quantity-btn_minus');
    const plusBtn = card.querySelector('.card__quantity-btn_plus');
    const quantityElement = card.querySelector('.card__quantity');
    const cardCheckbox = checkboxes[`card-${index + 1}-checkbox`];

    const productInfo = productData[index + 1];

    minusBtn.addEventListener('click', function () {
        updateQuantity(card, -1, productInfo);
    });

    plusBtn.addEventListener('click', function () {
        updateQuantity(card, 1, productInfo);
    });

    quantityElement.addEventListener('change', function () {
        updateQuantity(card, 0, productInfo);
    });

    quantityElement.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            updateQuantity(card, 0, productInfo);
        }
    });

    cardCheckbox.addEventListener('change', function () {
        checkMainCheckboxStatus();
        updateTotalSum();
    });
});

function updateQuantity(card, value, productInfo) {
    const quantityElement = card.querySelector('.card__quantity');
    const priceValueElement = card.querySelector('.card__price-discount-num');

    let quantity = parseInt(quantityElement.value);

    if (isNaN(quantity) || quantity <= 0) {
        quantity = 1;
    }

    quantity += value;
    quantity = Math.max(1, Math.min(quantity, productInfo.stock));

    quantityElement.value = quantity;

    animatePriceChange(priceValueElement, parseFloat(priceValueElement.textContent.replace(/[\s сом]/g, '')), quantity * productInfo.price);

    checkMainCheckboxStatus();

    updateButtonsState(quantityElement, card.querySelector('.card__quantity-btn_minus'), card.querySelector('.card__quantity-btn_plus'), productInfo);

    updateTotalSum();
}

function updateTotalSum() {
    let totalSum = 0;
    let totalFullSum = 0;
    let totalDiscountSum = 0;
    let totalQuantity = 0;

    productCards.forEach(function (card, index) {
        const quantityElement = card.querySelector('.card__quantity');
        const productInfo = productData[index + 1];
        const quantity = parseInt(quantityElement.value);
        const cardCheckbox = checkboxes[`card-${index + 1}-checkbox`];

        if (cardCheckbox.checked) {
            totalSum += quantity * productInfo.price;
            totalFullSum += quantity * (productInfo.price) / productInfo.discount;
            totalDiscountSum += totalSum - totalFullSum;
            totalQuantity += quantity;
        }
    });

    animatePriceChange(totalSumElement, parseFloat(totalSumElement.textContent.replace(/[\s сом]/g, '')), totalSum, totalSumElement);
    animatePriceChange(totalFullSumElement, parseFloat(totalFullSumElement.textContent.replace(/[\s сом]/g, '')), totalFullSum, totalFullSumElement);
    animatePriceChange(totalDiscountElement, parseFloat(totalDiscountElement.textContent.replace(/[\s сом]/g, '')), totalDiscountSum, totalDiscountElement);

    function pluralizeWord(number) {
        const cases = [2, 0, 1, 1, 1, 2];
        const titles = ['товар', 'товара', 'товаров'];

        const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5];

        return titles[index];
    }

    const totalQuantityElement = document.querySelector('.total__quantity-key');
    if (totalQuantityElement) {
        totalQuantityElement.textContent = `${totalQuantity} ${pluralizeWord(totalQuantity)}`;
    }
}


function checkMainCheckboxStatus() {
    const productCheckboxes = [checkboxes['card-1-checkbox'], checkboxes['card-2-checkbox'], checkboxes['card-3-checkbox']];
    const allProductCheckboxesChecked = productCheckboxes.every(function (checkbox) {
        return checkbox.checked;
    });

    mainCheckbox.checked = allProductCheckboxesChecked;
}

function animatePriceChange(priceValueElement, currentPrice, newPrice, element) {
    const steps = 10;
    const stepValue = (newPrice - currentPrice) / steps;

    for (let i = 1; i <= steps; i++) {
        setTimeout(function () {
            const animatedPrice = currentPrice + i * stepValue;
            if (element === totalSumElement || element === totalFullSumElement || element === totalDiscountElement) {
                priceValueElement.textContent = `${addThousandSeparators(animatedPrice.toFixed(0))} сом`;
            } else {
                priceValueElement.textContent = addThousandSeparators(`${animatedPrice.toFixed(0)}`);
            }
        }, i * 30);
    }

    setTimeout(function () {
        if (element === totalSumElement || element === totalFullSumElement || element === totalDiscountElement) {
            priceValueElement.textContent = `${addThousandSeparators(newPrice.toFixed(0))} сом`;
        } else {
            const formattedPrice = addThousandSeparators(`${newPrice.toFixed(0)}`);
            if (formattedPrice.length > 6) {
                priceValueElement.style.fontSize = '16px';
            } if (formattedPrice.length > 7) {
                priceValueElement.style.fontSize = '14px';
            } else {
                priceValueElement.style.fontSize = '';
            }
            priceValueElement.textContent = formattedPrice;
        }
    }, (steps + 1) * 30);
}

function updateButtonsState(quantityElement, minusBtn, plusBtn, productInfo) {
    minusBtn.disabled = parseInt(quantityElement.value) <= 1;
    plusBtn.disabled = parseInt(quantityElement.value) >= productInfo.stock;
}

function addThousandSeparators(numberString) {
    return numberString.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
}

const hideGoodsButton = document.getElementById('hide-goods');
const hideAbsentButton = document.getElementById('hide-absent');
const goodsList = document.getElementById('goods__list');
const absentList = document.getElementById('absent__list');

hideGoodsButton.addEventListener('click', function () {
    goodsList.classList.toggle('hidden');
    hideGoodsButton.classList.toggle('rotated');
});

hideAbsentButton.addEventListener('click', function () {
    absentList.classList.toggle('hidden');
    hideAbsentButton.classList.toggle('rotated');
});

const orderButton = document.getElementById('order');

orderButton.addEventListener('click', function () {
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const mailInput = document.getElementById('mail');
    const phoneInput = document.getElementById('phone');
    const innInput = document.getElementById('inn');

    const nameError = document.querySelector('.recipient__name-error');
    const surnameError = document.querySelector('.recipient__surname-error');
    const mailError = document.querySelector('.recipient__mail-error');
    const mailLess = document.querySelector('.recipient__mail-less-error');
    const phoneError = document.querySelector('.recipient__phone-error');
    const phoneLess = document.querySelector('.recipient__phone-less-error');
    const innError = document.querySelector('.recipient__inn-error');
    const innLess = document.querySelector('.recipient__inn-less-error');
    const innDesc = document.querySelector('.recipient__inn-mess');

    const recipientBlock = document.getElementById('recipient')

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\+\d{1,3}\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
        return phoneRegex.test(phoneNumber);
    }

    let isValid = true;

    // Валидация имени

    if (!nameInput.value.trim()) {
        nameError.style.display = 'block';
        isValid = false;
    } else {
        nameError.style.display = 'none';
        isValid = true;

    }

    // Валидация фамилии

    if (!surnameInput.value.trim()) {
        surnameError.style.display = 'block';
        isValid = false;
    } else {
        surnameError.style.display = 'none';
        isValid = true;
    }

    // Валидация почты

    if (!mailInput.value.trim()) {
        mailLess.style.display = 'block';
        isValid = false;
    } else {
        mailLess.style.display = 'none';
        isValid = true;
    }

    if (mailInput.value.trim() && !validateEmail(mailInput.value.trim())) {
        mailError.style.display = 'block';
        isValid = false;
    } else {
        mailError.style.display = 'none';
        isValid = true;
    }

    // Валидация телефона

    if (!phoneInput.value.trim()) {
        phoneLess.style.display = 'block';
        isValid = false;
    } else {
        phoneLess.style.display = 'none';
    }

    if (phoneInput.value.trim() && !validatePhoneNumber(phoneInput.value.trim())) {
        phoneError.style.display = 'block';
        isValid = false;
    } else {
        phoneError.style.display = 'none';
        isValid = true;
    }

    // Валидация ИНН

    if (innInput.value.trim().length === 0) {
        console.log('Пустое')
        innLess.style.display = 'block';
        innError.style.display = 'none';
        innDesc.style.display = 'none'
        isValid = false;
    } else if (innInput.value.trim().length !== 0 && innInput.value.trim().length < 14) {
        console.log('Меньше 14')
        innError.style.display = 'block';
        innLess.style.display = 'none';
        innDesc.style.display = 'none'
        isValid = false;
    } else if (innInput.value.trim().length === 14) {
        console.log('Равно 14')
        innDesc.style.display = 'block';
        innError.style.display = 'none';
        innLess.style.display = 'none';
        isValid = true;
    }

    if (isValid) {
        alert('Все данные указаны правильно');
    } else {
        recipientBlock.scrollIntoView({ behavior: 'smooth' });
    }
});




