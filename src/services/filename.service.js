const getFileName = function (module) {
    const date = getDate();
    if(module && module.name) {
        return module.name + '_' + date
    } else {
        return 'BugReport'+ '_' + date
    }
}

const getDate = function () {
    let date = Date.now().toString();
    return date.slice(-6)
}

export default {
    getFileName,
    getDate,
}