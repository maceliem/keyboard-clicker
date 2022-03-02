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
    resetCooldown: 5000,
    combo: {
        prog: 0,
        perTier: 5,
        tier: 0,
        maxTier: 3
    }
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
    makeVisible(keyName)
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

/**
 * Update display of curencies
 */
function updateCurencies() {
    document.getElementById("clicks").innerHTML = `Clicks: ${clicks}`
    document.getElementById("keyAmount").innerHTML = `keys: ${keyStats.amount}/${keyStats.max}`
}

/**
 * Checks if we're at a point to unlock something automaticly
 * @returns {void}
 */
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

/**
 * Unlock a new element 
 * @param {string} unlocked - Name of element to unlock
 * @returns {void}
 */
function unlock(unlocked) {
    if (unlockedList[unlocked] == true) return
    unlockedList[unlocked] = true
    console.log("unlocked: ", unlocked)
    if (unlocked == "clicks") { makeVisible("clicks") }
    if (unlocked == "keyAmount") { makeVisible("keyAmount"); keyStats.max++ }
    if (unlocked == "letterBonus") { generateNewBonusLetter(); makeVisible("letterBonus"); keyStats.max++ }
    if (unlocked == "letterBonusRedo") { makeVisible("resetLetterBonus") }
    if (unlocked == "letterBonusCombo") { makeVisible("comboProg"); makeVisible("comboText") }
}

/**
 * Removes class "hidden" and adds class "visible" to element
 * @param {string} id - id of element
 */
function makeVisible(id) {
    document.getElementById(id).classList.add("visible")
    document.getElementById(id).classList.remove("hidden")
}

/**
 * 
 * @returns {string} Random owned letter
 */
function randomOwnedLetter() {
    let alphabet = Object.keys(keys)
    return (alphabet[Math.floor(Math.random() * alphabet.length)])
}

/**
 * @returns {string} Random letter from A-Z
 */
function randomLetter() {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return (alphabet[Math.floor(Math.random() * alphabet.length)])
}

/**
 * Fill letterBonus list with owned letters
 */
function generateNewBonusLetter() {
    while (letterBonus.list.length < letterBonus.display) letterBonus.list.push(randomOwnedLetter())

    displayBonusLetter()
}

/**
 * Fill letterBonus list with random letters, prefers owned letters
 */
function generateBonusLetter() {
    while (letterBonus.list.length < letterBonus.display) {
        if (Math.random() * 2 < 1) letterBonus.list.push(randomLetter())
        else letterBonus.list.push(randomOwnedLetter())
    }

    displayBonusLetter()
}

/**
 * Updates LetterBonus display
 */
function displayBonusLetter() {
    let element = document.getElementById("letterBonus")
    while (element.firstChild) element.removeChild(element.lastChild)

    for (letter of letterBonus.list) {
        let letterBox = document.createElement("p")
        letterBox.innerHTML = letter
        element.appendChild(letterBox)
    }
}

/**
 * Checks if key is in letterBonus list
 * @param {string} keyName - Name of key pressed
 * @returns {boolean} True if key is in letterBonus
 */
function useBonusLetter(keyName) {
    let i = 0
    for (letter of letterBonus.list) {
        if (letter == keyName) {
            letterBonus.list.splice(i, 1)
            generateBonusLetter()
            letterBonusComboUp()
            return true
        } i++
    }
    resetLetterBonusCombo()
    return false
}

/**
 * Increase letterBonus combo
 */
function letterBonusComboUp() {
    let prog = document.getElementById("comboProg")
    let text = document.getElementById("comboText")
    letterBonus.combo.prog++
    if (letterBonus.combo.prog >= letterBonus.combo.perTier && letterBonus.combo.tier < letterBonus.combo.maxTier) {
        unlock("letterBonusCombo")
        letterBonus.combo.prog = 0
        letterBonus.combo.tier++
        if (letterBonus.combo.tier % 4 == 0) letterBonus.multiplier = 2 * Math.pow(10, Math.floor(letterBonus.combo.tier / 4))
        if (letterBonus.combo.tier % 4 == 1) letterBonus.multiplier = 3 * Math.pow(10, Math.floor(letterBonus.combo.tier / 4))
        if (letterBonus.combo.tier % 4 == 2) letterBonus.multiplier = 5 * Math.pow(10, Math.floor(letterBonus.combo.tier / 4))
        if (letterBonus.combo.tier % 4 == 3) letterBonus.multiplier = 10 * Math.pow(10, Math.floor(letterBonus.combo.tier / 4))
    }
    prog.value = letterBonus.combo.prog
    prog.max = letterBonus.combo.perTier
    text.innerHTML = `${letterBonus.multiplier}x`
    if (letterBonus.combo.tier == letterBonus.combo.maxTier) text.innerHTML += ` max`
}


/**
 * Resets letterBonus combo
 */
function resetLetterBonusCombo() {
    let prog = document.getElementById("comboProg")
    let text = document.getElementById("comboText")
    letterBonus.combo.prog = 0
    letterBonus.combo.tier = 0
    letterBonus.multiplier = 2
    prog.value = letterBonus.combo.prog
    prog.max = letterBonus.combo.perTier
    text.innerHTML = `${letterBonus.multiplier}x`
}

/**
 * Reset letterBonus list, and sets a cooldown on the button
 */
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