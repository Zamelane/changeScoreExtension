let isEnabled
let settingMarkValue
let settingEditTime
let settingName
let settingFullSuccessful

// Элементы управления
let isEnabledButton
let isEditName
let name
let group
let isEditTime
let time
let isEditCountTask
let marks

chrome.storage.local.get(['extensionEnabled', 'markValue', 'timeValue', 'nameValue', 'fullSuccessfulValue'], function(localStorage) {
    isEnabled = localStorage.extensionEnabled ?? false
    settingMarkValue = localStorage.markValue ?? '4' // Получаем желаемую оценку из настроек
    settingEditTime = localStorage.timeValue ?? null // Менять ли время ? Если да, то хранит строку
    settingName = localStorage.nameValue ?? null // Менять ли кто выполнил ? Если да, то хранит строку с Фамилией и Именем + группа, опционально
    settingFullSuccessful = localStorage.fullSuccessfulValue ?? null // Ставить ли все задания как выполненные ?

    document.addEventListener("DOMContentLoaded",function(event) {
        isEnabledButton = document.getElementById('isEnabled')

        // Редактировать Фамилию, Имя и группу ?
        isEditName = document.getElementById('isEditName')
        name = document.getElementById('name')
        group = document.getElementById('group')

        // Менять время ?
        isEditTime = document.getElementById('isEditTime')
        time = document.getElementById('time')

        // Ставить задания как выполненные ?
        isEditCountTask = document.getElementById('isEditCountTask')

        // На что менять оценку ?
        marks = document.getElementsByClassName('mark-select')

        // Настраиваем
        isEnabledButton.addEventListener("click", setIsEnabled)

        for (let i = 0; i < marks.length; i++) {
            marks[i].addEventListener("click", setIsEditName)
            if (marks[i].innerText.indexOf(settingMarkValue) > -1) {
                marks[i].classList.add('select')
            }
        }
        document.getElementById('saveButton').addEventListener("click", save)

        if (settingEditTime) {
            isEditTime.checked = true
            time.value = settingEditTime
        }

        if (settingName) {
            isEditName.checked = true
            name.value = settingName.indexOf(', ') > -1 ? settingName.split(', ')[0] : settingName
            group.value = settingName.indexOf(', ') > -1 ? settingName.split(', ')[1] : ''
        }

        if (settingFullSuccessful) {
            isEditCountTask.checked = true
        }
        setIsEnabled(typeof isEnabled === 'string')
    })
})

function setStorage(key, value = null) {
    let obj = {}
    obj[key] = value
    chrome.storage.local.set(obj, function() {
        console.log(`In ${key} saved '${value}'!`);
    });
}

function setIsEnabled(value = null) {
    if (typeof value === 'boolean') {
        isEnabled = value
    }
    else {
        isEnabled = !isEnabled
    }
    isEnabledButton.innerText = isEnabled ? 'Выключить расширение' : 'Включить расширение'

    if (isEnabled) {
        setStorage('extensionEnabled', 'true')
    } else {
        setStorage('extensionEnabled')
    }
    console.log(isEnabled)
}

function setIsEditName(obj) {
    let value = obj.target.innerText
    switch (value) {
        case '3': case '4': case '5':
            settingMarkValue = value
            break;
        default:
            settingMarkValue = null
            break;
    }
    for (let i = 0; i < marks.length; i++) {
        marks[i].classList.remove('select')
    }
    obj.target.classList.add('select')
}

function save() {
    // Обрабатываем информацию о пользователе
    let nameToSave = name.value.trim()
    let groupToSave = group.value.trim()
    if (isEditName.checked && nameToSave.length > 0) {
        setStorage('nameValue', nameToSave + (groupToSave.length > 0 ? ', ' + groupToSave : ''))
    } else {
        isEditName.selected = false
        setStorage('nameValue')
    }

    // Обрабатываем время
    let timeToSave = time.value.trim()
    if (isEditTime.checked && timeToSave.length > 0) {
        setStorage('timeValue', timeToSave)
    } else {
        isEditTime.selected = false
        setStorage('timeValue')
    }

    // Информация о заданиях
    if (isEditCountTask.checked) {
        setStorage('fullSuccessfulValue', 'true')
    } else {
        setStorage('fullSuccessfulValue')
    }

    // Информация об оценках
    if (settingMarkValue) {
        setStorage('markValue', settingMarkValue)
    } else {
        setStorage('markValue')
    }
}