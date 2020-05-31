//require jquery datatable
var $ = require("jquery");
var dt = require("datatables.net")(window, $);
var ip = "79.145.85.205";
//var ip = "localhost";
var ruta = "http://"+ ip+"/proyecto/";
//Paginador
var jefe = sessionStorage.getItem("idusuario");
//==================listar usuarios
function timeoutclick() {
  click();
}
var list_table = "";
if(sessionStorage.getItem("rol") != "SuperAdmin"){
  $queryString = "SELECT f.nofactura, f.fecha, f.totalfactura,f.estatus, u.nombre as vendedor, cl.idcliente, cl.nombre as cliente FROM factura f INNER JOIN usuario u ON f.usuario = u.idusuario INNER JOIN cliente cl ON f.codcliente = cl.idcliente WHERE f.estatus!=10 and idusuario=? ORDER BY f.fecha DESC";
}else{
  $queryString = "SELECT f.nofactura, f.fecha, f.totalfactura,f.estatus, u.Jefe, u.nombre as vendedor, cl.idcliente, cl.nombre as cliente FROM factura f INNER JOIN usuario u ON f.usuario = u.idusuario INNER JOIN cliente cl ON f.codcliente = cl.idcliente WHERE f.estatus!=10 ORDER BY f.fecha DESC";
}
  
connection.query($queryString, [jefe], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  let i = "";

  list_table += '<table id="tblDatos">';
  list_table += "<thead>";
  list_table += "<tr><th></th><th></th>";
  list_table += "<th></th>";
  if(sessionStorage.getItem("rol")== "SuperAdmin"){
    list_table += '<th></th>';
    }
  list_table += "<th></th><th></th><th></th>";
  list_table +=
    '<th><input type="text" name="busqueda" id="busqueda" placeholder="Buscar"></th><tr>';
  list_table += "<th>No.</th>";
  list_table += "<th>Fecha / hora</th>";
  list_table += "<th>Cliente</th>";
  list_table += "<th>Vendedor</th>";
  list_table += "<th>Estado</th>";
  list_table += "<th class='textright'>Total Factura</th>";
  if(sessionStorage.getItem("rol")== "SuperAdmin"){
  list_table += '<th>Jefe</th>';
  }
  list_table += "<th class='textright'>Acciones</th>";
  list_table += "</tr>";
  list_table += "</thead>";
  list_table += "<tbody>";
  for (i = 0; i < results.length; i++) {
    list_table += "<tr>";
    list_table += "<td>" + results[i].nofactura + "</td>";
    list_table += "<td>" + results[i].fecha.toDateString() + "</td>";
    list_table += "<td>" + results[i].cliente + "</td>";
    list_table += "<td>" + results[i].vendedor + "</td>";
    if(results[i].estatus == 1){
      list_table += '<td class="pagada"><strong>Pagada</strong></td>';
    }
    if(results[i].estatus == 2 ){
      list_table += '<td class="anulada"><strong>Anulada</strong></td>';
    }
    
    list_table += "<td><strong>" + results[i].totalfactura + '</strong> <i class="fas fa-euro-sign"></i></td>';
    if(sessionStorage.getItem("rol") == "SuperAdmin"){
      if(results[i].Jefe == 0){
        results[i].Jefe = "Autónomo";
      }
      list_table += '<td>'+ results[i].Jefe +'</td>';
      }
    list_table +=
      '<td><button type="button" onclick="timeoutclick()" class="btn_view view_factura" cl="'+ results[i].idcliente +'" f="'+ results[i].nofactura +'"><i class="fas fa-eye"></i></button> ';
if(results[i].estatus == 1){
  if(sessionStorage.getItem("rol") == "SuperAdmin"){
    list_table +=
    ' <button type="button" onclick="timeoutclick()" class="btn_anular anular_factura" f="'+ results[i].nofactura +'"><i class="fas fa-ban"></i></button>';
  } 
}else{
  if(sessionStorage.getItem("rol") == "SuperAdmin"){
    list_table +=
    ' <button type="button" class="btn_anular inactive" f="'+ results[i].nofactura +'" disabled><i class="fas fa-ban"></i></button>';
  }
}
    list_table += "</td>";
    list_table += "</tr>";
    
  }
  list_table += "</tbody>";
  list_table += "</table>";
  document.getElementById("table_date").innerHTML = list_table;
});

if (sessionStorage.getItem("rol") === "SuperAdmin") {
}

//buscador+paginador
function buscador() {
  $(document).ready(function () {
    var consulta = $("#tblDatos").DataTable();
    $("#busqueda").keyup(function () {
      consulta.search($(this).val()).draw();
    });
  });
}
setTimeout("buscador()", 500);

var table = "#tblDatos";
$("#maxRows").on("change", function () {
  $(".pagination").html();
  var trnum = 0;
  var maxRows = parseInt($(this).val());
  var totalRows = $(table + " tbody tr").length;
  $(table + " tr:tg(0)").each(function () {
    trnum++;
    if (trnum > maxRows) {
      $(this).hide();
    }
    if (trnum <= maxRows) {
      $(this).show();
    }
  });
  if (totalRows > maxRows) {
    var pagenum = Math.ceil(totalRows / maxRows);
    for (var i = 1; i < pagenum; i++) {
      $(".pagination")
        .append(
          '<li data-page="' +
            i +
            '"><span>' +
            i++ +
            '<span class="sr-only">(current)</span></span></li>'
        )
        .show();
    }
  }
  $(".pagination li:first-child").addClass("active");
  $(".pagination li").on("click", function () {
    var pageNum = $(this).attr("data-page");
    var trIndex = 0;
    $(".pagination li").removeClass("active");
    $(this).addClass("active");
    $(table + " tr:gt(0)").each(function () {
      trIndex++;
      if (
        trIndex > maxRows * pageNum ||
        trIndex <= maxRows * pageNum - maxRows
      ) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  });
});
var idrol = sessionStorage.getItem("idrol")
$queryString = "select * from rol where idrol = ?";
connection.query($queryString, [idrol], (err, results) => {
  if(err){
    return console.log("An error ocurred with the query", err);
  }
  if(results){
    html =""
    console.log(results);
    if(results[0].nuevoVen == 0){
      document.getElementById("nuevo").style.display = "none";
    }
  }
});
function click() {
  $(document).ready(function () {
    $(".link_edit").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var nombre = $(this).parents("tr").find("td")[1].innerHTML;
      var DNI = $(this).parents("tr").find("td")[2].innerHTML;
      var telefono = $(this).parents("tr").find("td")[3].innerHTML;
      var direccion = $(this).parents("tr").find("td")[4].innerHTML;
      var email = $(this).parents("tr").find("td")[5].innerHTML;
      var recuperar = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		 <h2> <i class='fas fa-users-cog'></i> Editar Cliente</h2>";
      recuperar += '		<label for="Nombre">Nombre</label>';
      recuperar +=
        '			<input id="name" name="nombre" value="' + nombre + '"></input>';
      recuperar += '   <label for="DNI">DNI</label>';
      recuperar += '			<input id="dni" name="DNI" value="' + DNI + '"></input>';
      recuperar += '		<label for="telefono">Teléfono</label>';
      recuperar +=
        '			<input id="telefono" name="telefono" value="' +
        telefono +
        '"></input>';
      recuperar += '		<label for="direccion">Dirección</label>';
      recuperar +=
        '			<input id="direccion" name="direccion" value="' +
        direccion +
        '"></input>';
      recuperar += '		<label for="email">Email</label>';
      recuperar +=
        '			<input id="email" name="email" value="' + email + '"></input>';
      recuperar += '   <label for="password">Contraseña</label>';
      recuperar +=
        '     <input type="password" id="password" name="password" placeholder="Verificar cambio con contraseña"></input>';
      recuperar += '   <div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Guardar Cambio</button>';
      recuperar += "		</div> ";
      recuperar += "	</div>";
      recuperar += "</section>";

      document.getElementById("actions").innerHTML = recuperar;
      $(".btn_cancel").click(function () {
        location.reload();
      });
      $(".btn_save").click(function () {
        var idusu = sessionStorage.getItem("idusuario");
        var clave = md5(document.getElementById("password").value);
        $queryString =
          "SELECT idusuario, clave FROM usuario WHERE idusuario =?";

        connection.query($queryString, [idusu], (err, results) => {
          if (err) {
            return console.log("An error ocurred with the query", err);
          }
          if (results[0].idusuario == idusu && results[0].clave == clave) {
            var Nombre = document.getElementById("name").value;
            var DNI = document.getElementById("dni").value;
            var telefono = document.getElementById("telefono").value;
            var direccion = document.getElementById("direccion").value;
            var email = document.getElementById("email").value;
            $queryString =
              "UPDATE cliente set DNI=?, nombre=?, telefono=?, direccion=?, email=? where idcliente= ?";

            connection.query(
              $queryString,
              [DNI, Nombre, telefono, direccion, email, ID],
              (err, results) => {
                if (err) {
                  return console.log("An error ocurred with the query", err);
                }
                if (results) {
                  location.reload();
                }
              }
            );
          }
        });
      });
    });
    $(".anular_factura").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var fecha = $(this).parents("tr").find("td")[1].innerHTML;
      var cliente = $(this).parents("tr").find("td")[2].innerHTML;
      var total = $(this).parents("tr").find("td")[5].innerHTML;
      var recuperar = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '<div class="alertModal">';
      recuperar += '	<div class="modal">';
      recuperar += '		<div id="bodyModal" class="bodyModal data_update"></div>';
      recuperar += "	</div>";
      recuperar += "</div>";
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2>Cancelar Factura</h2>";
      recuperar += '		<label for="Nombre">Fecha</label>';
      recuperar +=
        '			<p id="name" name="nombre">' + fecha + '</p>';
      recuperar += '		<label for="dni">Cliente</label>';
      recuperar +=
        '			<p id="dni" name="dni">' + cliente + '</p>';
      recuperar += '		<label for="correo">Importe</label>';
      recuperar +=
        '			<p id="correo" name="Correo"><strong>' + total + '</strong></p>';
      recuperar += '<label for="password">Contraseña</label>';
      recuperar +=
        '<input type="password" id="password" name="password" placeholder="Verificar cambio con contraseña"></input>';
      recuperar += '<div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Cambiar</button>';
      recuperar += '		</div>';
      recuperar += '	</div>';
      recuperar += '</section>';

      document.getElementById("actions").innerHTML = recuperar;
      $(".btn_cancel").click(function () {
        location.reload();
      });
      $(".btn_save").click(function () {
        var idusu = sessionStorage.getItem("idusuario");
        var clave = md5(document.getElementById("password").value);
        $queryString =
          "SELECT idusuario, clave FROM usuario WHERE idusuario =?";

        connection.query($queryString, [idusu], (err, results) => {
          if (err) {
            return console.log("An error ocurred with the query", err);
          }
          if (results[0].idusuario == idusu && results[0].clave == clave) {
            //eliminar factura
            anularFactura(ID);
          }
          var messerror =
            '<p class="msg_error">Error al actualizar el Usuario</p>';
          document.getElementById("bodyModal").innerHTML = messerror;
        });
      });
    });
    //Ver factura
    $(".view_factura").click(function(e){
      e.preventDefault();
      var codCliente = $(this).attr("cl");
      var noFactura = $(this).attr("f");
      generarPDF(codCliente, noFactura);

    });
  });//End ready
}
setTimeout("click()", 500);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function generarPDF(cliente, factura){
  var ancho = 1000;
  var alto = 800;
  //calcular posicion x,y para centrar ventana
  var x = parseInt((window.screen.width/2)-(ancho/2));
  var y = parseInt((window.screen.height/2)-(alto/2));

  $url = ruta + "PDF/generaFactura.php?cl="+ cliente + "&f="+ factura;
  window.open($url,"Factura","left="+x+", top="+y+", height="+alto+
  ", width="+ancho+", scrollbar=si, locacion=no, resizable=si,menubar=no");
}
function anularFactura(id){
  var ID = id;
  var action = "anularFactura";
  console.log(ID);
  $.ajax({
    url: ruta + "ajax_ventas.php",
    type: 'POST',
    async: true,
    data: {action:action,factura:ID},
    success: function(response){
      if(response == "Error"){
        $(".alertModal").html("<b><p style='color: red;'>Error al anular la Factura</p></b>");
      }else{
        $(".alertModal").html("<b><p style='color: green;'>Factura Anulada</p></b>")
        setTimeout(location.reload(), 1500);;
      }
    },
    error: function(error){
      console.log(error);
    }
  })
}
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
