const auth = (regKey) => {
    return new Promise((resolve, reject) => {       
        fetch(`https://extension-auth.evendor.app/api/get_config?RegistrationKey=${regKey}`)
            .then(response => {
                if (response.ok) {
                    return response
                } else if (response.status === 401) {
                    reject('Invalid registration key')
                } else {
                    reject('Sorry, something went wrong')
                }
            })
            .then( data => {resolve(data)})
            .catch(error => {
                reject('Sorry, something went wrong');
            })       
    })
}

export default {
    auth
}