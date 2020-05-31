var $ = require("jquery");
//:::
var idrol = sessionStorage.getItem("idrol")
$queryString = "select * from rol where idrol = ?"
connection.query($queryString, [idrol], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if(results){  
//
var html = "";
if(results[0].inicio == 1){
  html += '<li><a ondragstart="dragstart_handler(event);" href="index.html"><i class="fas fa-home"></i> Inicio</a></li>';
}
if ((results[0].nuevoUsu == 1) || (results[0].listaUsu == 1) || (results[0].recuUsu == 1)){
  html += '<li id="principal1" class="principal">';
  html +=
    '<a ondragstart="dragstart_handler(event);" id="Users" href="#"><i class="fas fa-users"></i> Usuarios</a>' + "<ul>";
}
if(results[0].nuevoUsu == 1){
  html +=
    '<li><a ondragstart="dragstart_handler(event);" href="nuevo_usuario.html"><i class="fas fa-user-plus"></i> Nuevo Usuario</a></li>';
}
if(results[0].listaUsu == 1){
  html +=
    '<li><a ondragstart="dragstart_handler(event);" href="lista_usuario.html"><i class="fas fa-users"></i> Lista de Usuarios</a></li>';
}
if(results[0].recuUsu == 1){
html +='<li><a ondragstart="dragstart_handler(event);" href="recuperar_usuario.html"><i class="fas fa-user-nurse"></i> Recuperar Usuarios</a></li>';
}
if ((results[0].nuevoUsu == 1) || (results[0].listaUsu == 1) || (results[0].recuUsu == 1)){
  html += "</ul></li>";
}

if((results[0].nuevoCli == 1) || (results[0].listaCli == 1) || (results[0].recuCli == 1)){
html += '<li id="principal2" class="principal">';
html += '<a ondragstart="dragstart_handler(event);" href="#"><i class="fas fa-users"></i> Clientes</a>';
html += "<ul>";  
}
if(results[0].nuevoCli == 1){
 html +=
  '<li><a ondragstart="dragstart_handler(event);" href="nuevo_cliente.html"><i class="fas fa-user-plus"></i> Nuevo Cliente</a></li>';
}
if(results[0].listaCli == 1){
html +=
  '<li><a ondragstart="dragstart_handler(event);" href="lista_cliente.html"><i class="fas fa-users"></i> Lista de Clientes</a></li>';
}
if(results[0].recuCli == 1){
 html +=
  '<li><a ondragstart="dragstart_handler(event);" href="recuperar_cliente.html"><i class="fas fa-user-nurse"></i> Recuperar Clientes</a></li>';
}
if((results[0].nuevoCli == 1) || (results[0].listaCli == 1) || (results[0].recuCli == 1)){
html += "</ul></li>";
}
if((results[0].nuevoProv == 1) || (results[0].listaProv == 1) || (results[0].recuProv == 1)) {
  html += '<li id="principal3" class="principal">';
  html += '<a ondragstart="dragstart_handler(event);" href="#"><i class="fas fa-truck"></i> Proveedores</a>';
  html += "<ul>";
}

if(results[0].nuevoProv == 1){
  html +=
  '<li><a ondragstart="dragstart_handler(event);" href="nuevo_proveedor.html"><i class="fas fa-user-plus"></i> Nuevo Proveedor</a></li>';
}
if(results[0].listaProv == 1){
 html +=
  '<li><a ondragstart="dragstart_handler(event);" href="lista_proveedor.html"><i class="fas fa-truck"></i> Lista de Proveedores</a></li>';
}
if(results[0].recuProv == 1){
  html +='<li><a ondragstart="dragstart_handler(event);" href="recuperar_proveedor.html"><i class="fas fa-user-nurse"></i> Recuperar Proveedores</a></li>';
}
if((results[0].nuevoProv == 1) || (results[0].listaProv == 1) || (results[0].recuProv == 1)) {
  html += "</ul>";
  html += "</li>";
}

if((results[0].nuevoProd == 1) || (results[0].listaProd == 1) || (results[0].recuProd == 1)) {
  html += '<li id="principal4" class="principal">';
  html += '<a ondragstart="dragstart_handler(event);" href="#"><i class="fas fa-barcode"></i> Productos</a>';
  html += "<ul>";
}
if(results[0].nuevoProd == 1){
  html +=
    '<li><a ondragstart="dragstart_handler(event);" href="nuevo_producto.html"><i class="fas fa-cart-plus"></i> Nuevo Producto</a></li>';
}
if(results[0].listaProd == 1){
  html +=
    '<li><a ondragstart="dragstart_handler(event);" href="lista_productos.html"><i class="fas fa-barcode"></i> Lista de Productos</a></li>';
}
if(results[0].recuProd == 1){
    html +='<li><a ondragstart="dragstart_handler(event);" href="recuperar_producto.html"><i class="fas fa-user-nurse"></i> Recuperar Productos</a></li>';
  }
if((results[0].nuevoProd == 1) || (results[0].listaProd == 1) || (results[0].recuProd == 1)) {
  html += "</ul>";
  html += "</li>";
}
if((results[0].nuevoVen == 1) || (results[0].listaVen == 1) || (results[0].listadoProductos == 1)) {
html += '<li id="principal5" class="principal">';
html += '<a ondragstart="dragstart_handler(event);" href="#"><i class="fas fa-receipt"></i> Ventas</a>';
html += '<ul>';
}
if(results[0].nuevoVen == 1){
  html += '<li><a ondragstart="dragstart_handler(event);" href="nuevo_venta.html"><i class="fas fa-concierge-bell"></i> Nueva Venta</a></li>';
}
if(results[0].listaVen == 1){
  html += '<li><a ondragstart="dragstart_handler(event);" href="lista_venta.html"><i class="fas fa-receipt"></i> Lista de Facturas</a></li>';
}
if(results[0].listadoProductos == 1){

 html += '<li><a ondragstart="dragstart_handler(event);" href="prueba_productos.html" id="lista_producto">Lista producto</a></li>'; 
}
if((results[0].nuevoVen == 1) || (results[0].listaVen == 1) || (results[0].listadoProductos == 1)) {
html += '</ul></li>';
}
document.getElementById("navegator").innerHTML = html;
  
 } 
 
});
document.getElementById("exit").onclick = function () {
  sessionStorage.clear();
};




