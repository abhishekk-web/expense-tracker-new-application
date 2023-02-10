

// sending data to the backend 

async function signup(e){

    try {

    e.preventDefault();

    console.log(e.target.name.value);

    const userDetails = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
    }

    console.log(userDetails);

    const response = await axios.post('http://localhost:3000/user/signup', userDetails);
    if(response.status === 200){
        window.location.href = ('../login/login.html');
        console.log("User added successfully");
    }
    else{
        console.log("user already exist");
    }


    }
    catch(err){
        console.log(err);
    }

}