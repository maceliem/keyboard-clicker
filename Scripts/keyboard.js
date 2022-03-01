let clicks = 0
let keyAmount = 0
let keyMax = 1
let keys = {}

document.addEventListener("keypress", function (event) {
    let keyName = event.key.toUpperCase()
    if (!keyName.match(/[A-Z]|[ÆØÅ]/)) return

    if (!(keyName in keys)) {
        if (keyAmount >= keyMax) return
        keys[keyName] = new Key(keyName)
        keyAmount++
    }

    let key = keys[keyName]
    if (key.pressed) return

    key.element.classList.add("pressed")
    key.element.style.display = "block"
    key.clicked()
    clicks += key.clickValue

    setTimeout(() => {
        document.getElementById(keyName).classList.remove("pressed")
        key.pressed = false
    }, 500)
    checkUnlock()
    updateCurencies()
});

function updateCurencies() {
    document.getElementById("clicks").innerHTML = `Clicks: ${clicks}`
    document.getElementById("keyAmount").innerHTML = `keys: ${keyAmount}/${keyMax}`
}

function checkUnlock(){
    if (clicks == 10) unlock("keyAmount")
}

function unlock(unlocked) {
    if (unlocked == "keyAmount") {
        document.getElementById("keyAmount").style.display = "block"
        keyMax++
    }
}