/* Without local storage*/

const input = document.querySelector("input");
const h2 = document.querySelector("h2");

input.addEventListener("keyup", displayOne);

function displayOne() {
  h2.innerHTML = input.value;
}

/*with local storage*/

const inputTwo = document.querySelector(".example-two");
const h2Two = document.querySelector(".example2");
const remove = document.querySelector(".delete");
h2Two.innerHTML = localStorage.getItem("value");
inputTwo.addEventListener("keyup", display);

function display() {
  localStorage.setItem("value", inputTwo.value);
  console.log(localStorage.getItem("value"));
  h2Two.innerHTML = localStorage.getItem("value");
}

//delete item from local storage
remove.addEventListener("click", deleteItem);
function deleteItem() {
  localStorage.removeItem("value");
  h2Two.innerHTML = "Item has been deleted";
}

//delete all items you use localStorage.clear();
