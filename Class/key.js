class Key {
    /**
     * 
     * @param {string} name - name of key 
     */
    constructor(name) {
        this.name = name
        this.clicks = 0
        this.clickValue = 1
        this.clickCountValue = 1
        this.pressed = false
        this.element = document.getElementById(`key${name}`)
        this.cooldown = 1000
        this.upgradeCost = {
            clickValue: 50,
        }
        this.upgradeTier = {
            clickValue: 1,
        }
    }
    clicked() {
        this.clicks += this.clickCountValue
        this.pressed = true
    }
}