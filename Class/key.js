class Key {
    constructor(name) {
        this.name = name
        this.clicks = 0
        this.clickValue = 1
        this.clickCountValue = 1
        this.pressed = false
        this.element = document.getElementById(name)
    }
    clicked() {
        this.clicks += this.clickCountValue
        this.pressed = true
    }
}