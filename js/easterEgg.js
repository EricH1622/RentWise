let eggActive = false;
let timesClicked = 0;

//Adds the click event to trigger the easter egg.
ready(document.getElementById("copyright").addEventListener("click", function(e) {
  let timer;
  if(eggActive == false){
    eggActive = true;
    timer = setTimeout(function(){
      eggActive = false;
      if (timesClicked < 7) {
        for (let i = 1; i <= 7; i++) {
          document.getElementById("c" + i).style.color = "white";
        }
      }
      timesClicked = 0;
    }, 1500)
  }
  timesClicked++;
  if(timesClicked >= 7){
    document.getElementById("c7").style.color = "rgb(255, 157, 0)";
    document.getElementById("easterEgg").style.display = "grid";
    //Don't want to display the easter egg stuff in the div before the user triggers it, but if a savvy user sees the div with nothing in it they might be incentivized to try to search for the trigger
    document.getElementById("easterEgg").innerHTML = `<img src="/assets/images/closeButton.png" id="closeEgg"/>
    <iframe id="easterEggVideo" src="https://www.youtube-nocookie.com/embed/9ti1k2tnDTM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <h1>...It looks like you've found something!</h1>`;

    document.getElementById("closeEgg").addEventListener("click", function(e) {
      document.getElementById("easterEgg").style.display = "none";
      document.getElementById("easterEgg").innerHTML = "";
      eggActive = false;
      for (let i = 1; i <= 7; i++) {
        document.getElementById("c" + i).style.color = "white";
      }
    });

  } else{
    document.getElementById("c" + timesClicked).style.color = "rgb(255, 157, 0)";
  }
}))

//Executes callback when the document is loaded.
function ready(callback) {
    if (document.readyState != "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }