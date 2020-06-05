//require jquery datatable
var $ = require("jquery");
var dt = require("datatables.net")(window, $);
//Paginador
var rol = sessionStorage.getItem("idrol");
//==================listar usuarios
function timeoutclick() {
  click();
}
var list_table = "";
  $queryString =
    "SELECT codproveedor, proveedor, contacto, telefono, direccion, email FROM proveedor  WHERE estatus=1 ORDER BY codproveedor";

connection.query($queryString, (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  let i = "";

  list_table += '<table id="tblDatos">';
  list_table += "<thead>";
  list_table += "<tr><th></th><th></th>";
  list_table += "<th></th><th></th><th></th><th></th>";
  list_table +=
    '<th><input type="text" name="busqueda" id="busqueda" placeholder="Buscar"></th><tr>';
  list_table += "<th>ID</th>";
  list_table += "<th>Empresa</th>";
  list_table += "<th>Contacto</th>";
  list_table += "<th>Teléfono</th>";
  list_table += "<th>Dirección</th>";
  list_table += "<th>Email</th>";
  list_table += "<th>Acciones</th>";
  list_table += "</tr>";
  list_table += "</thead>";
  list_table += "<tbody>";
  for (i = 0; i < results.length; i++) {
    list_table += "<tr>";
    list_table += "<td>" + results[i].codproveedor + "</td>";
    list_table += "<td  style='max-width: 300px;'>" + results[i].proveedor + "</td>";
    list_table += "<td  style='max-width: 300px;'>" + results[i].contacto + "</td>";
    list_table += "<td>" + results[i].telefono + "</td>";
    list_table += "<td  style='max-width: 300px;'>" + results[i].direccion + "</td>";
    list_table += "<td>" + results[i].email + "</td>";
    if(sessionStorage.getItem("idrol") == 1 ||sessionStorage.getItem("idrol") == 2){
    list_table +=
      '<td><a ondragstart="dragstart_handler(event);" onclick="timeoutclick()" class="link_edit" href="#"><i class="far fa-edit"></i> Editar</a> ';  
      list_table +=
      '<a ondragstart="dragstart_handler(event);" class="link_info" href="index.html" style="display:none;"><i class="far fa-edit"></i> Información</a> ';  
    }else{
      list_table +=
      '<td><a ondragstart="dragstart_handler(event);" class="link_info" href="index.html"><i class="far fa-edit"></i> Información</a> ';  
      
    }
    
      if(rol < 3){
        list_table +=
      '| <a ondragstart="dragstart_handler(event);" onclick="timeoutclick()" class="link_delete" href="#"><i class="far fa-trash-alt"></i> Borrar</a>';
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
    if(results[0].nuevoProv == 0){
      document.getElementById("nuevo").style.display = "none";
    }
  }
});
function click() {
  $(document).ready(function () {
    $(".link_delete").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var Empresa = $(this).parents("tr").find("td")[1].innerHTML;
      
      var recuperar = "";
      recuperar += '<section id="containerEdit">';
      recuperar += '<div class="alertModal">';
      recuperar += '	<div class="modal">';
      recuperar += '		<div id="bodyModal" class="bodyModal data_update"></div>';
      recuperar += "	</div>";
      recuperar += "</div>";
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2>Eliminar Proveedor</h2>";
      recuperar += '		<label for="Nombre">Empresa</label>';
      recuperar +=
        '			<p id="name" name="nombre">' + Empresa + '</p>';
      recuperar += '<label for="password">Contraseña</label>';
      recuperar +=
        '<input type="password" id="password" name="password" placeholder="Verificar cambio con contraseña"></input>';
      recuperar += '<div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Eliminar</button>';
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
            $queryString =
              "UPDATE proveedor set estatus = 0 where codproveedor= ?";

            connection.query($queryString, [ID], (err, results) => {
                if (err) {
                  return console.log("An error ocurred with the query", err);
                }
                if (results) {
                  location.reload();
                }
              }
            );
          }
          var messerror =
            '<p class="msg_error">Error al actualizar el Usuario</p>';
          document.getElementById("bodyModal").innerHTML = messerror;
        });
      });
    });
    $(".link_edit").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var Empresa = $(this).parents("tr").find("td")[1].innerHTML;
      var contacto = $(this).parents("tr").find("td")[2].innerHTML;
      var telefono = $(this).parents("tr").find("td")[3].innerHTML;
      var direccion = $(this).parents("tr").find("td")[4].innerHTML;
      var email = $(this).parents("tr").find("td")[5].innerHTML;
      var recuperar = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2><i class='fas fa-users-cog'></i> Editar Proveedor</h2>";
      recuperar += '		<label for="Empresa">Empresa</label>';
      recuperar +=
        '			<input type="hidden" id="idprov" name="idprov" value="' + ID + '"></input>';
      recuperar +=
        '			<input id="name" name="Empresa" value="' + Empresa + '"></input>';
      recuperar += '   <label for="contacto">Contacto</label>';
      recuperar += '			<input id="contacto" name="contacto" value="' + contacto + '"></input>';
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
      recuperar += '			<button type="button" class="btn_save">Restaurar</button>';
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
            var Empresa = document.getElementById("name").value;
            var contacto = document.getElementById("contacto").value;
            var telefono = document.getElementById("telefono").value;
            var direccion = document.getElementById("direccion").value;
            var email = document.getElementById("email").value;
            $queryString =
              "UPDATE proveedor set proveedor=?, contacto=?, telefono=?, direccion=?, email=? where codproveedor= ?";

            connection.query(
              $queryString,
              [Empresa, contacto, telefono, direccion, email, ID],
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
  });
}
setTimeout("click()", 500);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function dragstart_handler(ev) {
  console.log(
    "dragStart: dropEffect = " +
      ev.dataTransfer.dropEffect +
      " ; effectAllowed = " +
      ev.dataTransfer.effectAllowed
  );

  // Add this element's id to the drag payload so the drop handler will
  // know which element to add to its tree
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
}
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
