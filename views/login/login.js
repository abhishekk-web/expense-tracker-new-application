async function login(e) {

    try {

    e.preventDefault();
    
    // here we are getting all the user data that user filled

    const userDetails = {

        email: e.target.email.value,
        password: e.target.password.value

    }

    // here we are sending all the user's data into the backend

    const response = await axios.post('http://localhost:3000/user/login',userDetails);
    console.log(response);
    if(response.status === 200){
        alert(response.data.message);   // if the user found then it sends to the main page of this application
    }else{
        throw new Error(response.data.message) // if user not found or there is an any other issue it will sends into the catch block
    }

}
catch(err){
        // console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>` // here we are getting all ther error
}

}