console.log('init')
setOpacity(false)
chrome.storage.local.get(['extensionEnabled', 'markValue', 'timeValue', 'nameValue', 'fullSuccessfulValue'], function(localStorage) {
    console.log(localStorage)
    if (localStorage.extensionEnabled ?? false) // Расширение включено ?
    {
        if (document.head?.childNodes) {
            // Содержимое окна результатов тестирования
            let test_main__results = document.getElementsByClassName('test_main__results')

            // Если результаты на странице есть, то обрабатываем
            test_main__results = test_main__results.length > 0 ? test_main__results[0] : null

            if (test_main__results) {
                // Настройки из меню пользователя (всплывающее окно)
                let settingMarkValue = localStorage.markValue ?? '4' // Получаем желаемую оценку из настроек
                let settingEditTime = localStorage.timeValue ?? null // Менять ли время ? Если да, то хранит строку
                let settingName = localStorage.nameValue ?? null // Менять ли кто выполнил ? Если да, то хранит строку с Фамилией и Именем + группа, опционально
                let settingFullSuccessful = localStorage.fullSuccessfulValue ?? null // Ставить ли все задания как выполненные ?

                // Загружаем элементы DOM для редактирования
                let mark = document.getElementsByClassName('test_main__results_rate')[0] // Получаем место в DOM, где записана оценка
                let statItems = document.getElementsByClassName('test_main__results_statitem')

                // Меняем элементы
                mark.innerText = settingMarkValue // Меняем оценку

                if (settingEditTime) { // Если нужно менять время
                    let timeStatItem = statItems[0] // Элемент со временем прохождения
                    timeStatItem.children[1].children[1].children[0].innerText = settingEditTime
                }

                if (settingName) { // Нужно ли менять Фамилию, Имя и группу ?
                    let nameStatItem = document.getElementsByClassName('test_header__ui_txt')[0]
                        .children[1].children[0]
                    nameStatItem.innerText = settingName
                }

                /* Меняем выполненные задания.
                 * Получаем место, где лежит количество выполненных заданий */
                let taskCountStatItem = statItems[1].children[1].children[1]
                let maxTasks = taskCountStatItem.innerText.split(' ')[2] // Всего заданий в тесте

                if (settingFullSuccessful) { // Менять количество выполненных заданий ?
                    // Ставим, что выполнены все задания из теста
                    taskCountStatItem.children[0].innerText = maxTasks
                }

                /* Редактируем результативность.
                 * Находим место, где находится количество набранных баллов*/
                let results = 95 // Результативность в процентах
                let resultsShift = 20 // Сдвигаем в процентах набранные баллы, чтобы выглядело реалистичнее
                let scoreStatItem = statItems[3].children[1].children[1] // Здесь лежит количество набранных баллов

                let maxScore = scoreStatItem.innerText.split(' ')[2] // Получаем максимальное количество баллов

                let scoreToSet = (maxScore * ((results - resultsShift) / 100)).toFixed(0).toString() // Считаем результативность по заданному проценту в results

                scoreToSet = scoreToSet.substring(0, scoreToSet.length - 1) + '5' // Последняя цифра пусть всегда будет 5, т.к. обычно баллы начисляются по 5

                scoreStatItem.children[0].innerText = scoreToSet

                /* Редактируем количество выполненных верно заданий.
                 * Находим, где лежит нужная нода */
                let successfulCountStatItem = statItems[2].children[1].children[1].children[0]
                // Задаём количество выполненных верно заданий в зависимости от results
                successfulCountStatItem.innerText = Math.floor(maxTasks * (results / 100)).toFixed(0)

                /* Меняем результативность в процентах.
                 * Получаем ноду с результативностью */
                let resultsPercentsStatItem = statItems[4].children[1].children[1].children[0]
                resultsPercentsStatItem.innerText = results + '%'
                setOpacity(true)
            }
        }
    } else setOpacity(true)

})

function setOpacity(isVisible = false) {
    let style = document.getElementById('opacity') ?? null

    if (!style) {
        console.log('create')
        style = document.createElement("style")
        style.id = 'opacity'
        style.innerHTML = `* {opacity: 0;}`
        document.getElementsByTagName('html')[0].appendChild(style)
    }

    if (!isVisible) {
        setOpacityToNode(style, false)
        return
    }

    setOpacityToNode(style, true)
}

function setOpacityToNode(node, isVisible) {
    node.innerHTML = `* {opacity: ${isVisible ? '100%' : '0'};}`
}