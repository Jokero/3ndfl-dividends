module.exports = async function (dividends, sourcesListSelector, countriesMap, currenciesMap) {
    const sourcesList = document.querySelector(sourcesListSelector)
    const addSourceButton = findElementByText('Добавить источник дохода', sourcesList, 'button')

    for (const [index, item] of dividends.entries()) {
        console.log(`${index + 1}/${dividends.length}`)

        // добавить новый источник
        await click(addSourceButton)

        const sourceElement = document.querySelector(`${sourcesListSelector} > div:nth-child(${index + 1})`)

        // раскрыть элемент
        await click(sourceElement.querySelector('div'))

        // Наименование
        setInputValue(findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].incomeSourceName`), item['Наименование ценной бумаги'])

        // Страна источника выплаты
        const paymentsSourceCountryElement = findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].oksmIst`)
        await chooseItemFromDropdown(paymentsSourceCountryElement, countriesMap[item['Страна эмитента**']] + ' ')

        // Страна зачисления выплаты
        const paymentsDestinationCountryElement = findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].oksmZach`)
        await chooseItemFromDropdown(paymentsDestinationCountryElement, '643 - РОССИЯ ')

        // Код дохода
        const incomeCodeElement = findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].incomeTypeCode`)
        await chooseItemFromDropdown(incomeCodeElement, '1010 - Дивиденды')

        // Предоставить налоговый вычет
        const taxDeductionElement = findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].taxDeductionCode`)
        await chooseItemFromDropdown(taxDeductionElement, 'Не предоставлять вычет')

        // Сумма дохода в валюте
        setInputValue(findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].incomeAmountCurrency`), item['Сумма до удержания налога'].replace(',', '.'))

        // Дата получения дохода
        const incomeDateElement = findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].incomeDate`)
        await chooseDate(incomeDateElement, item['Дата выплаты'])

        // Дата уплаты налога
        const taxPaymentDateElement = findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].taxPaymentDate`)
        await chooseDate(taxPaymentDateElement, item['Дата выплаты'])

        // Наименование валюты
        const currencyElement = findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].currencyCode`)
        await chooseItemFromDropdown(currencyElement, currenciesMap[item['Валюта']])

        // Определить курс автоматически
        await click(sourceElement.querySelector('.form-checkbox_text'))

        // Сумма налога в иностранной валюте
        setInputValue(findElementById(`Ndfl3Package.payload.sheetB.sources[${index}].paymentAmountCurrency`), item['Сумма налога, удержанного агентом'].replace(',', '.'))
    }
}

function findElementById(id) {
    const normalizedId = id.replaceAll('.', '\\.').replaceAll('[', '\\[').replaceAll(']', '\\]')
    return document.querySelector(`#${normalizedId}`)
}

function findElementByText(text, parentElement = document, tag = 'div') {
    const xpath = `.//${tag}[text()='${text}']`
    return document.evaluate(xpath, parentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

async function chooseItemFromDropdown(element, text) {
    await click(element.querySelector('.Select-arrow-zone'))
    await click(findElementByText(text, element))
}

async function chooseDate(element, date) {
    const [day, month, year] = date.split('.').map(it => Number(it))
    // открыть календарь
    await click(element.querySelector('input'))
    // открыть список лет
    await click(element.querySelector('.react-datepicker__year-read-view'))
    // выбрать год
    await click(findElementByText(year, element))
    // открыть список месяцев
    await click(element.querySelector('.react-datepicker__month-read-view'))
    // выбрать месяц
    await click(element.querySelector(`.react-datepicker__month-option:nth-child(${month})`))
    // выбрать день
    await click(element.querySelector(`.react-datepicker__day--0${day.toString().padStart(2, '0')}:not(.react-datepicker__day--outside-month)`))
}

function setInputValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
}

function click(element, delay = 100) {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    return new Promise(resolve => setTimeout(resolve, delay))
}