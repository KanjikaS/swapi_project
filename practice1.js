let request = "https://swapi.dev/api/people/1";

fetch(request)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let p = document.getElementById("text");
    console.log(data);
    p.innerHTML = JSON.stringify(data.name);
  })
  .catch((e) => console.log(e, 123));
