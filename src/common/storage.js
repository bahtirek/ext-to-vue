const get = (key) => {
    return new Promise((resolve, reject) => {
        const result = window.localStorage.getItem(key)
        if(result) {
            resolve (JSON.parse(result));
        } else {
            reject('unauth')
        }
        
    })
}

const set = (key, value) => {
    value = JSON.stringify(value)
    return new Promise((resolve, reject) => {
        window.localStorage.setItem(key, value)
       resolve(true);
    })
}

const remove = (key) => {
    return new Promise((resolve, reject) => {
        window.localStorage.removeItem(key)
       resolve(true);
    })
}
/* const get = (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve (JSON.parse(result[key]));
        });
    })
}

const set = (key, value) => {
    value = JSON.stringify(value)
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set({[key]: value}, function() {
                resolve(true);
            });
        } catch (error) {
            reject(error)
        }
    })
} */

export default {
    get, set, remove
}

//Check storage in devtools
//chrome.storage.local.get(function(result){console.log(result)})

