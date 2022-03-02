let clicks = 0

let keyStats = {
    amount: 0,
    max: 1
}

let keys = {}

let letterBonus = {
    list: [],
    display: 1
}

let letterBonusList = []

document.addEventListener("keypress", function (event) {
    let keyName = event.key.toUpperCase()
    if (!keyName.match(/[A-Z]|/)) return

    if (!(keyName in keys)) {
        if (keyStats.amount >= keyStats.max) return
        keys[keyName] = new Key(keyName)
        keyStats.amount++
    }

    let key = keys[keyName]
    if (key.pressed) return

    key.element.classList.add("pressed")
    key.element.classList.add("visible")
    //key.element.classList.remove("hidden")
    key.clicked()
    clicks += key.clickValue

    setTimeout(() => {
        document.getElementById(keyName).classList.remove("pressed")
        key.pressed = false
    }, 1000)
    checkUnlock()
    updateCurencies()
});

function updateCurencies() {
    document.getElementById("clicks").innerHTML = `Clicks: ${clicks}`
    document.getElementById("keyAmount").innerHTML = `keys: ${keyStats.amount}/${keyStats.max}`
}

function checkUnlock() {
    if (clicks == 1) unlock("clicks")
    if (clicks == 5) unlock("keyAmount")
    if (clicks == 20) unlock("letterBonus")
}

function unlock(unlocked) {
    if (unlocked == "clicks") {
        document.getElementById("clicks").classList.add("visible")
    }
    if (unlocked == "keyAmount") {
        document.getElementById("keyAmount").classList.add("visible")
        document.getElementById("keyAmount").classList.remove("hidden")
        keyStats.max++
    }
    if (unlock == "letterBonus") {
        generateNewBonusLetter()
        document.getElementById("letterBonus").classList.add("visible")
        document.getElementById("letterBonus").classList.remove("hidden")
        keyStats.max++
    }
}

function randomOwnedLetter() {
    let alphabet = Object.keys(keys)
    return (alphabet[Math.floor(Math.random() * alphabet.length)])
}

function randomLetter() {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return (alphabet[Math.floor(Math.random() * alphabet.length)])
}

function generateNewBonusLetter() {
    while (letterBonus.list.length < letterBonus.display) letterBonus.list.push(randomOwnedLetter())

    displayBonusLetter()
}

function generateBonusLetter() {
    while (letterBonus.list.length < letterBonus.display) {
        if (Math.random() + 1 < 1) letterBonus.list.push(randomLetter())
        else letterBonus.list.push(randomOwnedLetter())
    }

    displayBonusLetter()
}

function displayBonusLetter() {
    let element = document.getElementById("letterBonus")
    while (element.firstChild) element.removeChild(element.lastChild)

    for (letter of letterBonus.list) {
        let letterBox = document.createElement("p")
        letterBox.innerHTML = letter
        element.appendChild(letterBox)
    }
}