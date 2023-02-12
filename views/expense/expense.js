async function mySave(e){

    try {

    e.preventDefault();

        // here we are getting all the expenses from the user

    const expenseDetails = {
        expense: e.target.expense.value,
        description: e.target.description.value,
        category: e.target.category.value

    }

    // here we are adding the expenses

    const token = localStorage.getItem("token");
    const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails, {headers: {"Authorization": token}});
    console.log(response);
    if(response.status === 200){
        alert(response.data.message);
        showExpenses(response.data.expense);
    }
    else{
        alert("Something went wrong");
    }

    }
    catch(err){
        console.log(err);
    }

}

// this is for reloading page

window.addEventListener("DOMContentLoaded",  () => {

    showPost();

})

// we are using this for decoding our token so that we can get the data for premium user authentication

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// the function is showing all the expenses in the screen by getting data from the backend

async function showPost() {

    try {
        
        const token = localStorage.getItem("token");

        console.log(token);
        const decode = parseJwt(token);
        console.log(decode);
        const isPremiumUser = decode.isPremiumUser;
        console.log(isPremiumUser);
        if(isPremiumUser){

            premiumUser();
            showLeaderBoard();

        }
        const response = await axios.get("http://localhost:3000/expense/expenses", {headers: {"Authorization": token}});
        console.log(response);
        response.data.data.forEach(expense => {
            showExpenses(expense);
        })
   

    }
    catch(err){
        console.log(err);
    }

}

// we are making the funcion of showing the leaderboard after making the premier user

function showLeaderBoard(){

    const inputElement = document.createElement("input");
    console.log(inputElement);
    inputElement.type="button";
    console.log(inputElement.type);
    inputElement.value = 'Show Leaderboard';
    console.log(inputElement.value);
    inputElement.style = "background-color: #008CBA; color: white;  border-radius: 4px; height: 40px; margin-left: 100px;";
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token');
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard', {headers: {'Authorization': token}});
        console.log(userLeaderBoardArray);

        var leaderboardElem = document.getElementById('leaderboard');
        document.getElementById('leaderboard').style = "color: black; margin-top: 20px; border-top: 2px solid lightgrey; padding-bottom: 50px;"
        leaderboardElem.innerHTML += '<h1 style="color: black;">Leader Board</h1>';
        userLeaderBoardArray.data.users.forEach((userDetails) => {
            if(userDetails.totalExpense === null){
                userDetails.totalExpense = 0;
            }
          leaderboardElem.innerHTML += `<li style="text-decoration: none; font-weight: bold; color: black; border-radius: 5px; padding-top: 7px; width: 500px; height: 50px; margin-top: 20px; font-size: 20px;">Name - ${userDetails.name} Expense - ${userDetails.totalExpense}</li>`;
        })
      }
      document.getElementById("message").appendChild(inputElement);
    
}

// here we are showing the expenses to the frontend

function showExpenses(user) {

    const parentNode = document.getElementById("listOfUsers");
    const childHTML = `<li style="text-decoration: none; font-weight: bold; color: black;;  padding-top: 7px; width: 500px; height: 50px; margin-top: 20px; text-align: left;" id=${user.id}>${user.expense} ${user.description} ${user.category}
              
              <button style="background-color: #00d1b2; border-radius: 10%; border: 2px solid #00d1b2; color: white;" onclick=deleteUser('${user.id}')>delete</button>
              <button style="background-color: #00d1b2; border-radius: 10%; border: 2px solid #00d1b2; color: white;" onclick=editUser('${user.expense}','${user.description}','${user.category}','${user.id}')>Edit the User </button>

            </li>`;
    parentNode.innerHTML += childHTML;

}

// this function is for deleting the data from the backend

async function deleteUser(userid){

    try{

        const token = localStorage.getItem("token");
        const data = await axios.delete(`http://localhost:3000/expense/deleteexpense/${userid}`, {headers: {"Authorization": token}});
        console.log(data);
        removeuser(userid);
        alert("expense successfully deleted");

    }
    catch(err){
      console.log("this order don't belong to the user");
    }

}

// this function is used for deleting the data from the frontend

function removeuser(expense){

    const parentNode = document.getElementById("listOfUsers");
    const childNodeToBeDeleted = document.getElementById(expense);
    parentNode.removeChild(childNodeToBeDeleted);

}

// this function is used for edit the data

function editUser(expense, description, category, id) {

    document.getElementById("description").value = description;
    document.getElementById("category").value = category;
    document.getElementById("expense").value = expense;
    removeuser(id);

}

// premium user function that we are calling after the payment gateway has done

function premiumUser() {

    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "";
    document.getElementById('message2').innerHTML = "";
    document.getElementById('new-message').innerHTML = "You are now a premiere user, you have all access of leaderboard";
    document.getElementById('new-message').style = "color: black;; font-weight: bold; margin-left: 120px; font-size: 20px"
    

}

// now we are making the frontend of payment gateway that we are using

document.getElementById("rzp-button1").onclick = async(e) => {

    try {   

        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:3000/purchase/premiummembership", {headers: {"Authorization": token}});
        console.log(response);

        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
            console.log(response);
            const res = await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{order_id: options.order_id, payment_id: response.razorpay_payment_id}, {headers: {"Authorization": token}});
            console.log(res);
            alert("you are a premium user now");
            premiumUser();
            showLeaderBoard();
            localStorage.setItem("token", res.data.token);

        
        }
        }

        const rzp1 = new Razorpay(options);
        rzp1.open();
        // console.log(options);
        e.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response)
            alert("Something went wrong");
        })

    }
    catch(err){
        console.log(err);
    }

}

// here we are using download function so that user can download his expenses that he stored

async function download(e) {

    try {

        // e.preventDefault();
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/expense/download", {headers: {"Authorization": token}});
        console.log(response);
        if(response.status === 200) {
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        }
        else{
            throw new Error(response.data.message);
        }

    }

    catch(err)
    {
        console.log(err);
    }

}