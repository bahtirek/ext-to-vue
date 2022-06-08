import axios from 'axios';

const patchReselect = (account, xpath, screenshot, bugId) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${account.repositoryServer}/bug-screenshot`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            bugId: bugId,
            screenshot: screenshot,
            xpath: xpath
        }).then(function (response) {
            resolve(response.data.result)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}



export default {
    patchReselect,
}