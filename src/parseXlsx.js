const path = require('path')
const xlsx = require('xlsx')

const { countriesMap, currenciesMap } = require('./constants')

const xlsxFileName = process.argv.slice(2)[0]
const rows = readAllXlsxRows(xlsxFileName)
const tableRows = removeNonTableRows(rows)
const tableRowsWithSingleHeader = removeDuplicatedHeaders(tableRows)
const dividends = convertRowsToDividendObjects(tableRowsWithSingleHeader)
const lastYearDividends = keepOnlyLastYearDividends(dividends)

validateCountriesAndCurrencies(dividends)

console.log(JSON.stringify(lastYearDividends, null, 2))

function readAllXlsxRows(xlsxFileName) {
    const workbook = xlsx.readFile(path.join(process.cwd(), xlsxFileName))

    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]

    return xlsx.utils.sheet_to_json(worksheet, { header: 1 })
}

function removeNonTableRows(rows) {
    const emptyCellsThreshold = 4
    const hasFewerEmptyCellsThanThreshold = row => row.reduce((total, cell) => cell === '' ? total + 1 : total, 0) < emptyCellsThreshold
    return rows.filter(hasFewerEmptyCellsThanThreshold)
}

function removeDuplicatedHeaders(rows) {
    const headerRowAsString = rows[0].join('')
    return rows.filter((row, index) => index === 0 || row.join('') !== headerRowAsString)
}

function convertRowsToDividendObjects(rows) {
    const headerRow = rows[0].map(cell => cell.replace(/\n/g, ' '))
    return rows.slice(1).map(row =>
        headerRow.reduce((object, cell, index) => {
            if (cell !== '') {
                object[cell] = row[index]
            }
            return object
        }, {})
    )
}

function keepOnlyLastYearDividends(dividends) {
    const pastYear = new Date().getFullYear() - 1
    return dividends.filter(item => item['Дата выплаты'].endsWith(pastYear))
}

function validateCountriesAndCurrencies(dividends) {
    dividends.forEach(item => {
        if (!countriesMap[item['Страна эмитента**']]) {
            throw new Error(`Не знаем кода страны ${item['Страна эмитента**']}, посмотрите его на сайте налоговой и добавьте в файл с константами. А ещё лучше сделайте пул-реквест`)
        }
        if (!currenciesMap[item['Валюта']]) {
            throw new Error(`Не знаем кода валюты ${item['Валюта']}, посмотрите его на сайте налоговой и добавьте в файл с константами. А ещё лучше сделайте пул-реквест`)
        }
    })
}