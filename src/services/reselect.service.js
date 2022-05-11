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
            if (error.response) {
                if(error.response.status == 401){
                    alert("Unauthorized");
                    return false
                }
                console.log(error.response.data);
                reject(error.response.data);
            } else if (error.request) {
                alert('Please check connection');
            } else {
                alert('Sorry, something went wrong please try again later');
            }
        });
    });
}



export default {
    patchReselect,
}