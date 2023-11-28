document.addEventListener('DOMContentLoaded', function () {
    const productData = {
        1: { price: 522, stock: 2, discount: 0.49 },
        2: { price: 10500, stock: 100500, discount: 0.91 },
        3: { price: 247, stock: 2, discount: 0.52 }
        // ... (добавьте данные для других товаров) ...
    };

    const checkboxes = {
        'card-1-checkbox': document.getElementById('card-1-checkbox'),
        'card-2-checkbox': document.getElementById('card-2-checkbox'),
        'card-3-checkbox': document.getElementById('card-3-checkbox')
    };

    const productCards = document.querySelectorAll('.goods__card');
    const totalSumElement = document.getElementById('totalSum');
    const mainCheckbox = document.getElementById('main-checkbox');

    mainCheckbox.addEventListener('change', function () {
        const productCheckboxes = [checkboxes['card-1-checkbox'], checkboxes['card-2-checkbox'], checkboxes['card-3-checkbox']];
        productCheckboxes.forEach(function (checkbox) {
            checkbox.checked = mainCheckbox.checked;
        });

        updatetotalSum();
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
            updatetotalSum();
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

        updatetotalSum();
    }

    function updatetotalSum() {
        let totalSum = 0;

        productCards.forEach(function (card, index) {
            const quantityElement = card.querySelector('.card__quantity');
            const productInfo = productData[index + 1];
            const quantity = parseInt(quantityElement.value);
            const cardCheckbox = checkboxes[`card-${index + 1}-checkbox`];

            if (cardCheckbox.checked) {
                totalSum += quantity * productInfo.price;
            }
        });

        animatePriceChange(totalSumElement, parseFloat(totalSumElement.textContent.replace(/[\s сом]/g, '')), totalSum, totalSumElement);
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
                if (element === totalSumElement) {
                    priceValueElement.textContent = `${addThousandSeparators(animatedPrice.toFixed(0))} сом`;
                } else {
                    priceValueElement.textContent = addThousandSeparators(`${animatedPrice.toFixed(0)}`);
                }
            }, i * 30);
        }

        setTimeout(function () {
            if (element === totalSumElement) {
                priceValueElement.textContent = `${addThousandSeparators(newPrice.toFixed(0))} сом`;
            } else {
                const formattedPrice = addThousandSeparators(`${newPrice.toFixed(0)}`);
                if (formattedPrice.length > 6) {
                    priceValueElement.style.fontSize = '16px';
                } if (formattedPrice.length > 7) {
                    priceValueElement.style.fontSize = '14px';
                } else {
                    priceValueElement.style.fontSize = ''; // Сбрасываем установленный размер шрифта
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
});