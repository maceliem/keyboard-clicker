let clicks = 0

document.addEventListener("keypress", function (event) {
    let key = event.key.toUpperCase()
    document.getElementById(key).classList.add("pressed")
    clicks++
    this.getElementById("clicks").innerHTML = `Clicks: ${clicks}`
});

document.addEventListener("keyup", function (event) {
    let key = event.key.toUpperCase()
    document.getElementById(key).classList.remove("pressed")
});