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
    console.log("Response object", responseObject);
    let parsedJSON = await responseObject.json();
    console.log("From the server", parsedJSON);

    if (parsedJSON.status === "fail") {
      document.getElementById("errorMsg").innerHTML = parsedJSON.msg;
    } else {
      window.location.replace("...");
    }

  } catch (error) {
    console.log(error);
  }
}

//When user clicks the submit button, execute the submitCredentials function
document.getElementById("submit").addEventListener("click", function (e) {
  submitCredentials({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
});