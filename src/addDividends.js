module.exports = async function (dividends, countriesMap, currenciesMap) {
    const tabPanel = document.querySelector('.fns-tabs__tabPanel:not([hidden])')
    const addSourceButton = findElementByText('Добавить источник дохода', tabPanel)

    for (const [index, item] of dividends.entries()) {
        console.log(`${index + 1}/${dividends.length}`)

        // добавить новый источник (откроется модальное окно)
        await click(addSourceButton)

        // Наименование
        setInputValue(findElementByIdPrefix('incomeSourceName'), item['Наименование ценной бумаги'])

        // Страна источника выплаты
        await chooseItemFromDropdown(findElementByIdPrefix('oksmIst'), countriesMap[item['Страна эмитента**']])

        // Страна зачисления выплаты
        await chooseItemFromDropdown(findElementByIdPrefix('oksmZach'), countriesMap['Россия'])

        // закрыть модальное окно
        await click(findElementByText('Добавить', document.querySelector('.ReactModalPortal')))

        // Код дохода
        const incomeCodeElement = findElementByIdPrefix(`payload.sheetB.sources.${index}.incomeTypeCode`)
        await chooseItemFromDropdown(incomeCodeElement, '1010 Дивиденды')

        // Предоставить налоговый вычет
        const taxDeductionElement = findElementByIdPrefix(`payload.sheetB.sources.${index}.taxDeductionCode`)
        await chooseItemFromDropdown(taxDeductionElement, ' Не предоставлять вычет')

        // Сумма дохода в валюте
        setInputValue(findElementByIdPrefix(`payload.sheetB.sources.${index}.incomeAmountCurrency`), item['Сумма до удержания налога'].replace(',', '.'))

        // Дата получения дохода
        const incomeDateElement = findElementByIdPrefix(`payload.sheetB.sources.${index}.incomeDate`)
        await chooseDate(incomeDateElement, item['Дата выплаты'])

        // Дата уплаты налога
        const taxPaymentDateElement = findElementByIdPrefix(`payload.sheetB.sources.${index}.taxPaymentDate`)
        await chooseDate(taxPaymentDateElement, item['Дата выплаты'])

        // Наименование валюты
        const currencyElement = findElementByIdPrefix(`payload.sheetB.sources.${index}.currencyCode`)
        await chooseItemFromDropdown(currencyElement, currenciesMap[item['Валюта']])

        // Определить курс автоматически
        await click(findLastElementByText('Определить курс автоматически', tabPanel))

        // Сумма налога в иностранной валюте
        setInputValue(findElementByIdPrefix(`payload.sheetB.sources.${index}.paymentAmountCurrency`), item['Сумма налога, удержанного агентом'].replace(',', '.'))
    }
    
    console.log('Готово 🎉. Если всё хорошо, можете поблагодарить меня https://pay.cloudtips.ru/p/dcda8c27')
}

function findElementByText(text, parentElement = document) {
    const xpath = `.//*[text()='${text}']`
    return document.evaluate(xpath, parentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

function findLastElementByText(text, parentElement = document) {
    const xpath = `(.//*[text()='${text}'])[last()]`
    return document.evaluate(xpath, parentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

function findElementByIdPrefix(prefix) {
    return document.querySelector(`[id^="${prefix}"]`)
}

async function chooseItemFromDropdown(element, text) {
    await click(element)
    await click(findElementByText(text, document.querySelector('.fns-popover')))
}

async function chooseDate(element, date) {
    const [day, month, year] = date.split('.').map(Number).map(String)
    // открыть календарь
    await click(element)
    // открыть список месяцев и лет
    await click(document.querySelector('.fns-calendar__monthAndYear'))
    // выбрать год
    await click(findElementByText(year, document.querySelector('.fns-dateList__years')))
    // выбрать месяц
    await click(document.querySelector(`.fns-dateList__month:nth-child(${month})`))
    // закрыть список месяцев и лет
    await click(document.querySelector('.fns-calendar__monthAndYear'))
    // выбрать день
    const daysElements = document.querySelectorAll('.fns-calendar__day:not(.fns-calendar__day_anotherMonth)')
    const dayElement = Array.from(daysElements).find(({ textContent }) => textContent === day)
    await click(dayElement)
}

function setInputValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    nativeInputValueSetter.call(element, value)
    element.dispatchEvent(new Event('input', { bubbles: true }))
}

function click(element, delay = 100) {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    return new Promise(resolve => setTimeout(resolve, delay))
}