var html = "";
    html += '<li><a href="index.html"><i class="fas fa-home"></i> Inicio</a></li>';
if(sessionStorage.getItem("rol") != "Nuevo" && sessionStorage.getItem("rol") != null){
    
    html += '<li id="principal1" class="principal">';
    html += '<a id="Users" href="#"><i class="fas fa-users"></i> Usuarios</a>'+'<ul>';
    html += '<li><a href="nuevo_usuario.html"><i class="fas fa-user-plus"></i> Nuevo Usuario</a></li>';
    html += '<li><a href="lista_usuario.html"><i class="fas fa-users"></i> Lista de Usuarios</a></li>';
    html += '</ul></li>';
}
    
    html += '<li id="principal2" class="principal">';                                                                                    
    html += '<a href="#"><i class="fas fa-users"></i> Clientes</a>';
    html += '<ul>';
    html += '<li><a href="registro_cliente.html"><i class="fas fa-user-plus"></i> Nuevo Cliente</a></li>';
    html += '<li><a href="lista_clientes.html"><i class="fas fa-users"></i> Lista de Clientes</a></li>';
    html += '</ul></li>';

if(sessionStorage.getItem("rol") != "Nuevo" && sessionStorage.getItem("rol") != null){
    html += '<li id="principal3" class="principal">';
    html += '<a href="#"><i class="fas fa-truck"></i> Proveedores</a>';
    html += '<ul>';
    html += '<li><a href="registro_proveedor.html"><i class="fas fa-user-plus"></i> Nuevo Proveedor</a></li>';
    html += '<li><a href="lista_proveedores.html"><i class="fas fa-truck"></i> Lista de Proveedores</a></li>';
    html += '</ul>';
    html += '</li>';
}

if(sessionStorage.getItem("rol") != "Nuevo" && sessionStorage.getItem("rol") != null){
    html += '<li id="principal4" class="principal">';
    html += '<a href="#"><i class="fas fa-barcode"></i> Productos</a>';
    html += '<ul>';
    html += '<li><a href="https://drive.google.com/drive/u/0/my-drive"><i class="fas fa-cart-plus"></i> Nuevo Producto</a></li>';
    html += '<li><a href="lista_productos.html"><i class="fas fa-barcode"></i> Lista de Productos</a></li>';
    html += '</ul>';
    html += '</li>';
}

    html += '<li id="principal5" class="principal">';
    html += '<a href="#"><i class="fas fa-receipt"></i> Ventas</a>';
    html += '<ul>';
    html += '<li><a href="nueva_venta.html"><i class="fas fa-concierge-bell"></i> Nueva Venta</a></li>';
    html += '<li><a href="#"><i class="fas fa-receipt"></i> Lista de Facturas</a></li>';
    html += '</ul></li>';

document.getElementById("navegator").innerHTML = html;

document.getElementById('exit').onclick = function(){
    sessionStorage.clear();
}