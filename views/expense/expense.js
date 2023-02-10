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

    const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails);
    if(response.status === 200){
        alert(response.data.message);
        showExpenses(response.data.data);
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

// the function is showing all the expenses in the screen by getting data from the backend

async function showPost() {

    try {

        const response = await axios.get("http://localhost:3000/expense/expenses");
        console.log(response);
        response.data.data.forEach(expense => {
            showExpenses(expense);
        })

    }
    catch(err){
        console.log(err);
    }

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

        await axios.delete(`http://localhost:3000/expense/deleteexpense/${userid}`);
        removeuser(userid);
        alert("expense successfully deleted");

    }
    catch(err){
        console.log("there is an error")
        console.log(err);
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