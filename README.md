# Скрипт для добавления дивидендов от иностранных компаний в 3-НДФЛ на сайте налоговой

Заточено под XLSX-отчет от Тинькофф.

Подробная информация о заполнении 3-НДФЛ https://help.tinkoff.ru/invest-premium/tax-issues/declaration-apply/.

## Как пользоваться

1. Запросите у Тинькофф отчет о выплате доходов по ценным бумагам иностранных эмитентов за предыдущий год в XLSX-формате
2. Склонируйте этот репозиторий на свой компьютер
3. Скопируйте полученный файл в корневую директорию репозитория (файл должен называться как `dividends.xlsx`)
4. Выполните `npm run build`, чтобы сгенерировать код, который надо будет выполнить на сайте налоговой для добавления дивидендов (должен появиться файл `consoleCode.js`). Убедитесь, что в результате выполнения команды нет ошибок
5. Перейдите на страницу добавления дивидендов на сайте налоговой, вставьте код из `consoleCode.js` в консоль веб-инспектора и дождитесь его выполнения
6. Проверьте, что все источники добавились и данные отображаются корректно
7. Если всё хорошо, можете [поблагодарить](https://pay.cloudtips.ru/p/dcda8c27) меня