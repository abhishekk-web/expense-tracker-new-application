// we are doing if the user forgots his password

async function forgotpassword(e) {

    try{

    e.preventDefault();
    const form = new FormData(e.target);

    const userDetails = {
        email: form.get("email"),
    }

    console.log(userDetails);

    const res = await axios.post('http://localhost:3000/password/forgotpassword',userDetails);
    console.log(res);

    }

    catch(err){
        console.log(err);
    }

}