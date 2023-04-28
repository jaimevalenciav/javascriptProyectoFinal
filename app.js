const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
const mostrarCarrito = document.getElementById('mostrar-carrito')
const mostrarBlanco = document.getElementById('mostrar-blancos')
const mostrarRosado = document.getElementById('mostrar-rosados')
const mostrarTinto = document.getElementById('mostrar-tintos')
const mostrarEspumante = document.getElementById('mostrar-espumantes')
const mostrarTodos = document.getElementById('mostrar-todos')
const carro = document.getElementById('carro')
let carritoCompra = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carritoCompra')) {
        carritoCompra = JSON.parse(localStorage.getItem('carritoCompra'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e =>{
    agregarCarrito(e)
})

items.addEventListener('click', e =>{
    btnAccion(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()        
        pintarCard(data)
    } catch (error) {
        console.log(error)
    }
    
}

const pintarCard = data => { 
    cards.innerHTML=''
    data.forEach(producto => {
        templateCard.querySelector(".titulo-producto").textContent = producto.title
        templateCard.querySelector(".precio").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.imagen)
        templateCard.querySelector(".btn-info").dataset.id = producto.id
        templateCard.querySelector(".unidades").textContent = producto.saldo
        templateCard.querySelector(".id").textContent = producto.id
        const clone = templateCard.cloneNode(true)
        
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const agregarCarrito = e => {    
    if(e.target.classList.contains('btn-info')){
        setCarritoCompra(e.target.parentElement)        
    }
    e.stopPropagation()
}

const setCarritoCompra = objeto => {   
    const producto = {
        id : objeto.querySelector('.btn-info').dataset.id,
        title : objeto.querySelector('.titulo-producto').textContent,
        precio : objeto.querySelector('.precio').textContent,
        imagen : objeto.querySelector('img').src,
        saldo : objeto.querySelector('.unidades').textContent,
        cantidad: 1
    }
    if(carritoCompra.hasOwnProperty(producto.id)){        
            producto.cantidad = carritoCompra[producto.id].cantidad + 1
            producto.saldo = carritoCompra[producto.id].saldo - 1       
    }
    carritoCompra[producto.id] = {...producto}
    pintarCarrito() 
    
    Toastify({
        text: "Producto agregado al carrito",
        duration: 1000,
        close: true,
        gravity: "top", 
        position: "right",
        stopOnFocus: true,
        style: {
        background: "#009bb0",
        }
    }).showToast()   
}

const pintarCarrito = () => {
    items.innerHTML = ""
    Object.values(carritoCompra).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.saldo - 1
        templateCarrito.querySelectorAll('td')[2].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-warning').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
    localStorage.setItem('carritoCompra', JSON.stringify(carritoCompra))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carritoCompra).length === 0) {
        footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - Agregue productos a comprar!</th>
        `
        return
    }
//Pintar footer
    const numCantidad = Object.values(carritoCompra).reduce((acc, {cantidad}) => acc + cantidad,0)
    const numPrecio = Object.values(carritoCompra).reduce((acc, {precio, cantidad}) => acc + cantidad * precio, 0)
    templateFooter.querySelectorAll('td')[0].textContent = numCantidad
    templateFooter.querySelector('span').textContent = numPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carritoCompra = {}
        pintarCarrito()
        lanzarAlerta("Felicitaciones!, Se ha realizado la compra.", "success")
        
    })
}

function lanzarAlerta(titulo, icon){
    Swal.fire({
        title: titulo,        
        icon: icon,
        //confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1500
      })
}


const btnAccion = e => {
    if(e.target.classList.contains('btn-info')) {        
        const producto = carritoCompra[e.target.dataset.id]
        if ((producto.saldo -1) > 0){
            producto.cantidad++
            producto.saldo--
            carritoCompra[e.target.dataset.id] = {...producto}
            pintarCarrito()
            
            Toastify({
                text: "Producto aumentado en 1",
                duration: 1000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                background: "#009bb0",
            }}).showToast()
        }else{
            Toastify({
                text: "Sin unidades disponibles para el producto",
                duration: 1500,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                background: "#b02300",
            }}).showToast()
        }
    }

    if(e.target.classList.contains('btn-warning')){
        const producto = carritoCompra[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad > 0){
            producto.saldo++
        }
        
        if(producto.cantidad === 0){
            delete carritoCompra[e.target.dataset.id]
        }
        pintarCarrito()
        
        Toastify({
            text: "Producto disminuído en el carrito",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
            background: "#b02300",
        }
      }).showToast()
    }

    e.stopPropagation()
}

mostrarCarrito.addEventListener('click',() => {
    carro.classList.toggle('ocultar') 
})

mostrarBlanco.addEventListener('click',() => {
    cargaBlancos()    
})

const cargaBlancos = async () => {      
    try {
        const res = await fetch('api.json')
        let data = await res.json()        
        data2 = data.filter(producto => producto.color == 'blanco')             
        pintarCard(data2)
    } catch (error) {
        console.log(error)
    }
    
}

mostrarRosado.addEventListener('click',() => {
    cargaRosados()    
})

const cargaRosados = async () => {      
    try {
        const res = await fetch('api.json')
        let data = await res.json()        
        data2 = data.filter(producto => producto.color == 'rosado')                     
        pintarCard(data2)
    } catch (error) {
        console.log(error)
    }
    
}

mostrarTinto.addEventListener('click',() => {
    cargaTintos()    
})

const cargaTintos = async () => {      
    try {
        const res = await fetch('api.json')
        let data = await res.json()        
        data2 = data.filter(producto => producto.color == 'tinto')              
        pintarCard(data2)
    } catch (error) {
        console.log(error)
    }
    
}

mostrarEspumante.addEventListener('click',() => {
    cargaEspumantes()    
})

const cargaEspumantes = async () => {      
    try {
        const res = await fetch('api.json')
        let data = await res.json()        
        data2 = data.filter(producto => producto.color == 'espumante')
        pintarCard(data2)
    } catch (error) {
        console.log(error)
    }
    
}

mostrarTodos.addEventListener('click',() => {
    fetchData()    
})




