w3IncludeHTML();

function transformHamburger(e, x) {
  e.preventDefault();
  x.classList.toggle("change");
  var menu = document.getElementById("menu1");
  if (menu.style.visibility === "visible") {
    menu.style.visibility = "hidden";
  } else {
    menu.style.visibility = "visible";
  }
}
