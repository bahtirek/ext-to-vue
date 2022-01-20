const get = (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve (result[key]);
        });
    })
}

const set = (key, value) => {  
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set({[key]: value}, function() {
                resolve(true);
            });
        } catch (error) {
            reject(false)
        }
    })
}

export default {
    get, set
}

//Check storage in devtools
//chrome.storage.local.get(function(result){console.log(result)})

