let clicks = 0
let keys = {}

document.addEventListener("keypress", function (event) {
    let key = event.key.toUpperCase()
    if (!key.match(/[A-Z]|[ÆØÅ]/)) return

    if (!(key in keys)) keys[key] = new Key(key)

    let element = document.getElementById(key)
    element.classList.add("pressed")
    element.style.display = "block"
    if (keys[key].pressed) return
    keys[key].clicked()
    clicks++
    document.getElementById("clicks").innerHTML = `Clicks: ${clicks}`
    setTimeout(() => {
        document.getElementById(key).classList.remove("pressed")
        keys[key].pressed = false
    }, 2000)
});