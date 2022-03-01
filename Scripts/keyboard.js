let clicks = 0


document.addEventListener("keypress", function (event) { 
    let key = event.key.toUpperCase()
    if (!key.match(/[A-Z]|[ÆØÅ]/)) return
    let element = document.getElementById(key)
    element.classList.add("pressed")
    element.style.display = "block"
    clicks++
    document.getElementById("clicks").innerHTML = `Clicks: ${clicks}`
    setTimeout(() => { document.getElementById(key).classList.remove("pressed") }, 500)
});