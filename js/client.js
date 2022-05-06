console.log("Client script loaded.");

//Function to submit login credentials
async function submitCredentials(data) {
  try {
    let responseObject = await fetch("/login", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();

    if (parsedJSON.status === "fail") {
      document.getElementById("errorMsg").innerHTML = parsedJSON.msg;
    } else {
      console.log("Logged in");
      window.location.replace("/profile");
    }

  } catch (error) {
    console.log(error);
  }
}

//creating DOM to execute the submitCredentials function
document.getElementById("btn").addEventListener("click", function (e) {
  submitCredentials({
    "username": document.getElementById("usernameBox").value,
    "password": document.getElementById("passwordBox").value
  });
});

// function ready(callback) {
//   if (document.readyState != "loading") {
//     callback();
//     console.log("ready state is 'complete'");
//   } else {
//     document.addEventListener("DOMContentLoaded", callback);
//     console.log("Listener was invoked");
//   }
// }