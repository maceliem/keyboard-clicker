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

let milestonesReached = {}

let selectedupgradeKey

let totalMilestones

fetch("data/totalMilestones.json")
    .then(response => { return response.json() })
    .then(data => totalMilestones = data)

let individualMilestones

fetch("data/individualMilestones.json")
    .then(response => { return response.json() })
    .then(data => individualMilestones = data)

let hiddenUnlockList

fetch("data/hiddenUnlocks.json")
    .then(response => { return response.json() })
    .then(data => hiddenUnlockList = data)
