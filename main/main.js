/**
 *
 * mountedToDom
 *
 *
 * @param {HTMLElement} element - which should be a
 * @return {Promise} 
 *
 * @example
 *     mountedToDom(element).then(() => console.log("mounted"))
 */
const mountedToDom = async (element) => {
    // if already on the dom
    if (element.isConnected) {
        return
    }
    
    // start the interval watcher if needed
    if (mountedToDom.intervalId == null) {
        // mounted checker (keep outside of function for efficiency reasons)
        mountedToDom.intervalId = setInterval(() => {
            // delete self when not looking for elements
            if (mountedToDom.elementsBeingWatched.size == 0) {
                clearInterval(mountedToDom.intervalId)
                mountedToDom.intervalId = null
                return
            }
            for (const [element, resolvers] of mountedToDom.elementsBeingWatched.entries()) {
                // if connected, run callbacks, and remove listener
                if (element.isConnected) {
                    for (let eachResolver of resolvers) {
                        eachResolver()
                    }
                    mountedToDom.elementsBeingWatched.delete(element)
                }
            }
        }, mountedToDom.pollingRate)
    }

    // create a promise to wait for wait on it getting added
    return new Promise((resolve, reject) => {
        if (mountedToDom.elementsBeingWatched.has(element)) {
            mountedToDom.elementsBeingWatched.get(element).push(resolve)
        } else {
            mountedToDom.elementsBeingWatched.set(element, [resolve])
        }
    })
}
mountedToDom.elementsBeingWatched = new Map()
mountedToDom.pollingRate = 200 // miliseconds
mountedToDom.intervalId = null // miliseconds
module.exports = mountedToDom