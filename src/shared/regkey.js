const auth = (regKey) => {
    return new Promise((resolve, reject) => {
        (async()=>{
            try {
                let response = await fetch(`https://extension-auth.evendor.app/api/get_config?RegistrationKey=${regKey}`)
                if (response.status === 200) {
                    let data = await response.json();
                    resolve(data);
                } else if (response.status === 401) {
                    reject('Invalid registration key')
                } else {
                    reject('Sorry, something went wrong')
                }
            } catch (error) {
                reject('Sorry, something went wrong')
            }
        })()
        
    })
}

export default {
    auth
}