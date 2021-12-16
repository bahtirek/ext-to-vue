const get = (key) => {
    chrome.storage.local.get(function(result) {
        console.log('Value currently is ' + result[key]);
        return result[key];
    });
}
const set = (key, value) => {
    chrome.storage.local.set({[key]: value}, function() {
        return true;
    });
}

export default {
    get, set
}