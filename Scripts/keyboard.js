let clicks = 0
let keyAmount = 0
let keyMax = 4
let keys = {}

document.addEventListener("keypress", function (event) {
    let keyName = event.key.toUpperCase()
    if (!keyName.match(/[A-Z]|[ÆØÅ]/)) return

    if (!(keyName in keys)) {
        if(keyAmount >= keyMax) return
        keys[keyName] = new Key(keyName)
        keyAmount++
    }

    let element = document.getElementById(keyName)
    let key = keys[keyName]
    if (key.pressed) return

    element.classList.add("pressed")
    element.style.display = "block"
    key.clicked()
    clicks+= key.clickValue
    document.getElementById("clicks").innerHTML = `Clicks: ${clicks}`
    document.getElementById("keyAmount").innerHTML = `keys: ${keyAmount}/${keyMax}`
    setTimeout(() => {
        document.getElementById(keyName).classList.remove("pressed")
        key.pressed = false
    }, 500)
});
