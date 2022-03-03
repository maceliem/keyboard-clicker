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
        perTier: 10,
        tier: 0,
        maxTier: 3
    }
}

let selectedupgradeKey

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
    makeVisible(key.element.id)
    makeVisible(`upgrade${keyName}`)
    key.clicked()
    let clickgain = key.clickValue
    if (unlockedList.letterBonus) if (useBonusLetter(keyName)) clickgain *= letterBonus.multiplier
    clicks += clickgain

    setTimeout(() => {
        document.getElementById(`key${keyName}`).classList.remove("pressed")
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
    if (clicks >= 1) unlock("clicks")
    if (clicks >= 5) unlock("keyAmount")
    if (clicks >= 20) unlock("letterBonus")
    if (unlockedList.letterBonus) {
        if (!Object.keys(keys).some((element) => letterBonus.list.includes(element))) {
            console.log("fisk")
            unlock("letterBonusRedo")
        }
    }
    if (clicks >= 50) unlock("menu")
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
    if (unlocked == "menu") { makeVisible("menu") }
}

/**
 * Removes class "hidden" and adds class "visible" to element
 * @param {string} id - id of element
 */
function makeVisible(id) {
    document.getElementById(id).classList.remove("noDisplay")
    document.getElementById(id).classList.add("visible")
    document.getElementById(id).classList.remove("hidden")
}

/**
 * Removes class "visible" and adds class "hidden" to element
 * @param {string} id - id of element
 */
function makeHidden(id) {
    document.getElementById(id).classList.remove("visible")
    document.getElementById(id).classList.add("hidden")
    document.getElementById(id).classList.add("noDisplay")
}

function unlockMenuButton(id, name) {
    document.getElementById(id).innerHTML = name
    document.getElementById(id).disabled = false
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
            letterBonusComboUp()
            document.getElementById("letterBonus").childNodes[i].style.opacity = 1
            let interval = setInterval(() => {
                document.getElementById("letterBonus").childNodes[i].style.opacity -= 0.1
            }, 50)
            setTimeout(() => {
                letterBonus.list.splice(i, 1)
                generateBonusLetter()
                clearInterval(interval)
                checkUnlock()
            }, 600)
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
/**
 * Change current page 
 * @param {string} page - name of new page
 */
function changePage(page) {
    let pageElements = ["game", "upgrade", "perkPage"]
    for (element of pageElements) {
        makeHidden(element)
        document.getElementById(`${element}Button`).classList.remove("active")
    }
    makeVisible(page)
    document.getElementById(`${page}Button`).classList.add("active")
}

/**
 * select key for upgrade 
 * @param {string} keyName - name of key
 */
function upgradeSelect(keyName) {
    selectedupgradeKey = keyName
    for (let key of Object.keys(keys)) document.getElementById(`upgrade${key}`).classList.remove("active")
    document.getElementById(`upgrade${keyName}`).classList.add("active")
    let key = keys[keyName]
    let buttons = document.getElementById("upgradeButtons").getElementsByTagName("button")
    for (button of buttons) {
        button.disabled = false
        button.getElementsByTagName("p")[0].innerHTML = `curent: ${key[button.name]} costs: ${key.upgradeCost[button.name]}`
    }
}

/**
 * applies upgrade to current key
 * @param {element} button - the button element
* @param {('+'|'-'|'*'|'/')} type - type of change
 * @param {number} amount - amount of change
 */
function upgradeButton(button, type, amount) {
    let key = keys[selectedupgradeKey]
    let price = key.upgradeCost[button.name]
    if (clicks < price) return alert("Not enough clicks")
    clicks -= price
    key.upgradeTier[button.name]++
    eval(`key[button.name] ${type}= ${amount}`)
    key.upgradeCost[button.name] = Math.pow(key.upgradeTier[button.name], 2) * 10
    updateCurencies()
    button.getElementsByTagName("p")[0].innerHTML = `curent: ${key[button.name]} costs: ${key.upgradeCost[button.name]}`
}

