const URL = 'https://extension-auth.evendor.app/api';

const auth = (data) => {
    data = {
        RegistrationKey: data.registrationKey,
        UserEmail: data.userEmail,
        UserAppId: data.userAppId,
    }
    console.log(data);
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


const verifyCode = (appId, code) => {
    const data = {
        appId: appId,
        code: code
    }
    return new Promise((resolve, reject) => {       
        fetch(`${URL}/verifyCode`, {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            resolve(data);
          })
          .catch((error) => {
            reject(error)
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