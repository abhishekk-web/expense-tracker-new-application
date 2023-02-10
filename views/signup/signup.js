

// sending data to the backend 

async function signup(e){

    try {

    e.preventDefault();

    // here we are getting all the data that user filled

    const userDetails = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
    }

    // here we are sending all the data from frontend to backend

    const response = await axios.post('http://localhost:3000/user/signup', userDetails);
    if(response.status === 200){
        alert(response.data.message);
        window.location.href = ('../login/login.html'); // if the user found then it goes to the login form
    }
    else{
        throw new Error(response.data.message); // we there is an error it will goes to the catch block
    }


    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>`       // it gets all the error
    }

}