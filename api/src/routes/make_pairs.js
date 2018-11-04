// get all users
// make pairs
// if three left, make mob

import { knex, users, pairs } from "../db"

// Below code came from the internet, doesn't work for odd numbers of users.
var splitAt = function(i, xs) {
    var a = xs.slice(0, i)
    var b = xs.slice(i, xs.length)
    return [a, b]
}

var shuffle = function(xs) {
    return xs.slice(0).sort(function() {
        return 0.5 - Math.random()
    })
}

var zip = function(xs) {
    return xs[0].map(function(_, i) {
        return xs.map(function(x) {
            return x[i]
        })
    })
}

const makePairs = async () => {
    const activeUsers = await users.getActive()
    const activeUserIds = activeUsers.map(user => user.user_id)
    const pairedUserIds = zip(splitAt(activeUserIds.length / 2, shuffle(activeUserIds)))
    const pairPromises = pairedUserIds.map(([id_left, id_right]) => pairs.create(id_left, id_right))
    await Promise.all(pairPromises)
    return "Pairing done!"
}

export default makePairs
