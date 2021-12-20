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
    chrome.storage.local.set({[key]: value}, function() {
        return true;
    });
}

export default {
    get, set
}