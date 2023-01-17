//variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const listaCursos = document.querySelector("#lista-cursos");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

cargarEventListner();
function cargarEventListner() {
  //Cuando agregar un curso presionado "Agregar Carrito"
  listaCursos.addEventListener("click", agregarCurso);

  //Elimina cursos del carrito
  carrito.addEventListener("click", eliminarCurso);

  //Cuando el documento esta listo muestra cursos del localStorage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoHTML();
  });

  //vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; //reseteamos el arreglo

    limpiarHTML(); //eliminamos todo el HTML
  });
}

//Funciones
function agregarCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

//Elimina un curso del carrito
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    //Elimina del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter((curso) => {
      if (curso.id === cursoId) {
        if (curso.cantidad > 1) {
          curso.cantidad--;
          return curso;
        } else {
          delete curso;
        }
      } else {
        return curso;
      }
    });

    carritoHTML(); //Iterar sobre el carrito y mostrar el HTML
  }
}

// Elimina curso de carrito
// function eliminarCurso(e) {
//   e.preventDefault();
//   if (e.target.classList.contains("borrar-curso")) {
//     const cursoId = e.target.getAttribute("data-id");
//     // Resta del carrito el curso seleccionado por cantidad
//     idx = articulosCarrito.findIndex((curso) => curso.id === cursoId);
//     articulosCarrito[idx].cantidad--;
//     //Elimina del arreglo por el id cuando la cantidad llegue a 0
//     if (!articulosCarrito[idx].cantidad) {
//       articulosCarrito = articulosCarrito.filter(
//         (curso) => curso.id !== cursoId
//       );
//     }
//     carritoHTML();
//   }
// }

//Lee el contenido del HTML al que le dimos Click y extrae la información del curso
function leerDatosCurso(curso) {
  console.log(curso);

  //Crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector("span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //Revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    //actualizamos la cantidad
    const cursos = articulosCarrito?.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; //retorna el objeto actualizado
      } else {
        return curso; //retorna los objetos que no son los duplicados
      }
    });

    //agrega elementos al arreglo de carrito si cumple la condicion
    articulosCarrito = [...cursos];
  } else {
    //agrega elementos al arreglo de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);

  carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {
  //Limpiar el HTML
  limpiarHTML();

  articulosCarrito?.forEach((curso) => {
    //aplicando destruction
    const { imagen, titulo, precio, cantidad, id } = curso;
    //Recorre el carrito y genera el HTML
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${imagen}" width="150">
      </td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${id}"> X </a>
      </td>
    `;

    // const row = document.createElement("tr");
    // row.innerHTML = `
    //   <td>
    //     <img src="${curso.imagen}" width="150">
    //   </td>
    //   <td>${curso.titulo}</td>
    //   <td>${curso.precio}</td>
    //   <td>${curso.cantidad}</td>
    //   <td>
    //     <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
    //   </td>
    // `;

    //Agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });

  //Agregar el carrito de compras al Storage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

//Elimina los cursos del carrito
function limpiarHTML() {
  //forma lenta
  // contenedorCarrito.innerHTML = "";

  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
