const fetch = require('node-fetch');
const Url = require('url').URL;
const apiUrl = 'https://allinsserservice.herokuapp.com/'
module.exports = {
    updateBalance : async (balance,username) => {
        try{
            const route= `v1/balance/:username/${username}`
            let res = await fetch(new Url(apiUrl+route),{method:'POST',body:JSON.stringify({Balance:balance})});
            return await res.json();
        }
        catch(err) {
            console.log(err);
        }
    }

}