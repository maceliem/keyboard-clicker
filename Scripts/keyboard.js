let clicks = 0

let keyStats = {
    amount: 0,
    max: 1
}

let keys = {}

let unlockedList = {}

let letterBonus = {
    list: [],
    display: 3,
    multiplier: 2,
    resetCooldown: 5000
}

document.addEventListener("keypress", function (event) {
    let keyName = event.key.toUpperCase()
    if (!keyName.match(/[A-Z]/)) return

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
    let clickgain = key.clickValue
    if (unlockedList.letterBonus) if (useBonusLetter(keyName)) clickgain *= letterBonus.multiplier
    clicks += clickgain

    setTimeout(() => {
        document.getElementById(keyName).classList.remove("pressed")
        key.pressed = false
    }, key.cooldown)
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
    if (unlockedList.letterBonus) {
        for (letter of Object.keys(keys)) {
            if (letterBonus.list.includes(letter)) return
        }
        unlock("letterBonusRedo")
    }
}

function unlock(unlocked) {
    if (unlockedList[unlocked] == true) return
    unlockedList[unlocked] = true
    console.log("unlocked: ", unlocked)
    if (unlocked == "clicks") {
        document.getElementById("clicks").classList.add("visible")
    }
    if (unlocked == "keyAmount") {
        document.getElementById("keyAmount").classList.add("visible")
        document.getElementById("keyAmount").classList.remove("hidden")
        keyStats.max++
    }
    if (unlocked == "letterBonus") {
        generateNewBonusLetter()
        document.getElementById("letterBonus").classList.add("visible")
        document.getElementById("letterBonus").classList.remove("hidden")
        keyStats.max++
    }
    if (unlocked == "letterBonusRedo") {
        document.getElementById("resetLetterBonus").classList.add("visible")
        document.getElementById("resetLetterBonus").classList.remove("hidden")
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
        if (Math.random() * 2 < 1) letterBonus.list.push(randomLetter())
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

function useBonusLetter(keyName) {
    console.log()
    let i = 0
    for (letter of letterBonus.list) {
        if (letter == keyName) {
            letterBonus.list.splice(i, 1)
            generateBonusLetter()
            return true
        } i++
    }
    return false
}

function resetLetterBonus() {
    let button = document.getElementById("resetLetterBonus")
    button.disabled = true
    let time = letterBonus.resetCooldown / 1000
    button.innerHTML = `${time}s`
    let interval = setInterval(() => {
        time--
        button.innerHTML = `${time}s`
    }, 1000)
    setTimeout(() => {
        clearInterval(interval)
        button.innerHTML = "Reset"
        button.disabled = false
    }, letterBonus.resetCooldown)
    letterBonus.list = []
    generateNewBonusLetter()
}