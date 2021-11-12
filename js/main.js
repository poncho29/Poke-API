const $content = document.querySelector(".content-pokemon");
const $buttons = document.querySelector("#buttons-pages");
let API = "https://pokeapi.co/api/v2/pokemon";

const pokemons = (API) => {
  fetch(API)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      $content.innerHTML = "";
      let $nextPage;
      let $prevPage;

      data.results.forEach((e) => {
        fetch(e.url)
          .then((res) => (res.ok ? res.json() : Promise.reject(res)))
          .then((data2) => {
            let type = "";
            for (let types of data2.types) {
              type += `
              <div class="type">
                ${types.type.name}
              </div>
            `;
            }

            $content.innerHTML += `
            <div class="col">
              <div class="pokemon p-3 border bg-light">
                <figure>
                  <img class="w-100" src="${data2.sprites.front_default}">
                </figure>
                <div class="info">
                  <h4 class="name">${e.name}</h4>
                  <span class="d-block mb-2">Tipo</span>
                  <div class="d-flex justify-content-between">
                    ${type}
                  </div>
                </div>
              </div>
            </div>
          `;
          })
          .catch((err) => {
            console.log(err);
            let message = err.statusText || "Ocurrio un error";
            $content.innerHTML = `
              <div class="col">
                <div class="pokemon p-3 border bg-light">
                  <p class="m-0">Error ${err.status}: ${message}</p>
                </div>
              </div>
            `;
          });
      });

      $prevPage = data.previous
        ? `<a href="${data.previous}">Prev</a>`
        : "<a>Prev</a>";
      $nextPage = data.next ? `<a href="${data.next}">Next</a>` : "<a>Prev</a>";

      $buttons.innerHTML = `
        <button type="button" class="btn btn-dark me-2">${$prevPage}</button>
        <button type="button" class="btn btn-dark">${$nextPage}</button>
      `;
    })
    .catch((err) => {
      console.log(err);
    });
};

document.addEventListener("DOMContentLoaded", pokemons(API));

document.addEventListener("click", (e) => {
  if (e.target.matches("#buttons-pages button a")) {
    e.preventDefault();
    pokemons(e.target.getAttribute("href"));
  }
});
