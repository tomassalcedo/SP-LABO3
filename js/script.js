import Crypto from "./Crypto.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('anuncioForm');
    const eliminarTodosBtn = document.getElementById('eliminarTodosBtn');
    const cryptosTable = document.getElementById('cryptosTable').querySelector('tbody');
    const filtroAlgoritmo = document.getElementById('filtroAlgoritmo');
    const promedioPrecio = document.getElementById('promedioPrecio');
    const columnasMostrar = document.getElementById('columnasMostrar');
    let cryptos = [];

    const cargarAlgoritmos = () => {
        filtroAlgoritmo.innerHTML = '<option value="all">Todos</option>';
        const algoritmosUnicos = [...new Set(cryptos.map(crypto => crypto.algoritmo))];
        algoritmosUnicos.forEach(algoritmo => {
            const option = document.createElement('option');
            option.value = algoritmo;
            option.textContent = algoritmo;
            filtroAlgoritmo.appendChild(option);
        });
    };

    const cargarCryptos = (filtrar = false) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/cryptos', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                cryptos = JSON.parse(xhr.responseText);
                cryptosTable.innerHTML = '';
                let cryptosFiltrados = cryptos;

                if (filtrar) {
                    const algoritmo = filtroAlgoritmo.value;
                    if (algoritmo !== 'all') {
                        cryptosFiltrados = cryptos.filter(crypto => crypto.algoritmo === algoritmo);
                    }
                }

                if (filtrar && filtroAlgoritmo.value !== 'all') {
                    const precios = cryptosFiltrados.map(crypto => parseFloat(crypto.precioActual));
                    const promedio = precios.length ? (precios.reduce((a, b) => a + b, 0) / precios.length).toFixed(2) : "N/A";
                    promedioPrecio.value = promedio !== "N/A" ? `$${promedio}` : promedio;
                } else {
                    promedioPrecio.value = "N/A";
                }

                cryptosFiltrados.forEach(crypto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="col-nombre">${crypto.nombre}</td>
                        <td class="col-simbolo">${crypto.simbolo}</td>
                        <td class="col-fechaCreacion">${crypto.fechaCreacion}</td>
                        <td class="col-precioActual">${crypto.precioActual}</td>
                        <td class="col-consenso">${crypto.consenso}</td>
                        <td class="col-cantidadCirculacion">${crypto.cantidadCirculacion}</td>
                        <td class="col-algoritmo">${crypto.algoritmo}</td>
                        <td class="col-sitioWeb">${crypto.sitioWeb}</td>
                        <td class="col-acciones">
                            <button class="btn btn-danger eliminar-btn" data-id="${crypto.id}">Eliminar</button>
                        </td>
                    `;
                    cryptosTable.appendChild(row);
                });

                const eliminarBtns = document.querySelectorAll('.eliminar-btn');
                eliminarBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        if (confirm('¿Estas seguro de que queres eliminar esta moneda?')) {
                            eliminarCrypto(id);
                        }
                    });
                });

                cargarAlgoritmos(); 
                actualizarVisibilidadColumnas();
            }
        };
        xhr.send();
    };

    const guardarCrypto = () => {
        const nombre = form.nombre.value;
        const simbolo = form.simbolo.value;
        const fechaCreacion = new Date().toLocaleDateString();
        const precioActual = form.precio.value;
        const consenso = form.tipo.value;
        const cantidadCirculacion = form.cantidad.value;
        const algoritmo = form.algoritmo.value;
        const sitioWeb = form.sitioWeb.value;

        const id = Date.now();
        const crypto = new Crypto(id, nombre, simbolo, fechaCreacion, precioActual, consenso, cantidadCirculacion, algoritmo, sitioWeb);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/cryptos', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function() {
            if (xhr.status === 201) {
                cryptos.push(JSON.parse(xhr.responseText));
                cargarCryptos(filtroAlgoritmo.value !== 'all');
                form.reset();
            }
        };
        xhr.send(JSON.stringify(crypto));
    };

    const eliminarCrypto = (id) => {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:3000/cryptos/${id}`, true);
        xhr.onload = function() {
            if (xhr.status === 204) {
                cryptos = cryptos.filter(crypto => crypto.id !== parseInt(id));
                cargarCryptos(filtroAlgoritmo.value !== 'all');
            }
        };
        xhr.send();
    };

    const eliminarTodos = () => {
        if (confirm('¿Estas seguro de que queres eliminar todas las monedas?')) {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', 'http://localhost:3000/cryptos', true);
            xhr.onload = function() {
                if (xhr.status === 204) {
                    cryptos = [];
                    cargarCryptos(filtroAlgoritmo.value !== 'all');
                }
            };
            xhr.send();
        }
    };

    const actualizarVisibilidadColumnas = () => {
        const columnas = document.querySelectorAll('.form-check-input');
        columnas.forEach(columna => {
            const colName = columna.value;
            const isChecked = columna.checked;
            const cells = document.querySelectorAll(`.col-${colName}`);
            cells.forEach(cell => {
                cell.style.display = isChecked ? '' : 'none';
            });
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        guardarCrypto();
    });

    eliminarTodosBtn.addEventListener('click', eliminarTodos);
    filtroAlgoritmo.addEventListener('change', () => cargarCryptos(true));
    columnasMostrar.addEventListener('change', actualizarVisibilidadColumnas);

    cargarCryptos();
    actualizarVisibilidadColumnas();
});