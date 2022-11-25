import axios from 'axios';

const URL = 'https://extension-auth.evendor.app/api';

const auth = (data) => {
    data = {
        RegistrationKey: data.registrationKey,
        UserEmail: data.userEmail,
        UserAppId: data.userAppId,
    }
    return new Promise((resolve, reject) => {    
        fetch(`${URL}/get_config`, {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                reject('Unauthorized')
            } else {
                reject('Sorry, something went wrong')
            }
        })
        .then( data => {
            resolve(data)
        })
        .catch(error => {
            reject('Sorry, something went wrong');
        })       
    })
}

const verifyCode = (code, userData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${URL}/confirm_user`, {
            RegistrationKey: userData.registrationKey,
            UserEmail: userData.userEmail,
            UserAppId: userData.userAppId,
            ConfirmationCode: code
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}

const verifyCode2 = (code, userData) => {
    const data = {
        RegistrationKey: userData.registrationKey,
        UserEmail: userData.userEmail,
        UserAppId: userData.userAppId,
        ConfirmationCode: code
    }

    return new Promise((resolve, reject) => {       
        fetch(`${URL}/confirm_user`, {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                reject('Unauthorized')
            } else if (response.status === 500){
                reject('Sorry, something went wrong')
            }
          })
          .then(data => {
            resolve(data);
          })
          .catch((error) => {
            console.log(error);
            reject(error.result.data)
          });   
    })
}
/* const auth = (regData) => {
    return new Promise((resolve, reject) => {       
        fetch(`https://extension-auth.evendor.app/api/get_config?RegistrationKey=${regData.regKey};email=${regData.email};appId=${regData.appId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    reject('Unauthorized')
                } else {
                    reject('Sorry, something went wrong')
                }
            })
            .then( data => {
                resolve(data)
            })
            .catch(error => {
                reject('Sorry, something went wrong');
            })       
    })
} */

export default {
    auth,
    verifyCode
}