//require jquery datatable
var $ = require("jquery");
var dt = require("datatables.net")(window, $);
var ip = "2.137.118.66";
//var ip = "localhost";
//Paginador
var rol = sessionStorage.getItem("idrol");
var rutaIMG = "http://"+ ip+"/proyecto/img/products/";
//==================listar usuarios


function timeoutclick() {
  click();
}
var list_table = "";
  $queryString =
    "SELECT p.codproducto, p.producto, p.descripcion, pd.proveedor, p.precio, p.existencia, p.foto FROM producto p join proveedor pd on p.proveedor = pd.codproveedor WHERE p.estatus=1 ORDER BY codproducto";

connection.query($queryString, (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  let i = "";

  list_table += '<table id="tblDatos">';
  list_table += "<thead>";
  list_table += "<tr><th></th><th></th>";
  list_table += "<th></th><th></th><th></th><th></th><th></th>";
  list_table +=
    '<th><input type="text" name="busqueda" id="busqueda" placeholder="Buscar"></th><tr>';
  list_table += "<th>ID</th>";
  list_table += "<th>Producto</th>";
  list_table += "<th>Descripcion</th>";
  list_table += "<th>Proveedor</th>";
  list_table += "<th>Precio</th>";
  list_table += "<th>Existencias</th>";
  list_table += "<th>Imagen</th>";
  list_table += "<th>Acciones</th>";
  list_table += "</tr>";
  list_table += "</thead>";
  list_table += "<tbody>";
  for (i = 0; i < results.length; i++) {
    list_table += "<tr>";
    list_table += "<td>" + results[i].codproducto + "</td>";
    list_table += "<td style='max-width: 300px;'>" + results[i].producto + "</td>";
    list_table += "<td style='max-width: 300px;'>" + results[i].descripcion + "</td>";
    list_table += "<td>" + results[i].proveedor + "</td>";
    list_table += "<td>" + results[i].precio + "</td>";
    list_table += "<td>" + results[i].existencia + "</td>";
    list_table += '<td><img style="width: 100px; height: 100px;" class="productIMG" src="' + rutaIMG +results[i].foto + '"/></td>';
    list_table += "<td>";
    
    $(document).ready(function(){
      $(".productIMG").on("error", function(){
        $(this).attr('src', './img/uploads/img_producto.png');
      })
    })

    if(sessionStorage.getItem("idrol") == 1 || sessionStorage.getItem("idrol") == 2){
    list_table +=
      '<a ondragstart="dragstart_handler(event);" onclick="timeoutclick()" class="link_edit" href="#"><i class="far fa-edit"></i> Editar</a> ';  
      list_table +=
      '<a ondragstart="dragstart_handler(event);" class="link_info" href="perfil_empresa.html" style="display:none;"><i class="far fa-edit"></i> Información</a> ';  
    }else{
      list_table +=
      '<a ondragstart="dragstart_handler(event);" class="link_info" href="perfil_empresa.html"><i class="far fa-edit"></i> Información</a> ';  
      
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
    if(results[0].nuevoProd == 0){
      document.getElementById("nuevo").style.display = "none";
    }
  }
});
function click() {
  $(document).ready(function () {
    $(".link_delete").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var producto = $(this).parents("tr").find("td")[1].innerHTML;
      var imagen = $(this).parents("tr").find("td")[6].innerHTML;
      
      var recuperar = "";
      recuperar += '<section id="containerEdit">';
      recuperar += '<div class="alertModal">';
      recuperar += '	<div class="modal">';
      recuperar += '		<div id="bodyModal" class="bodyModal data_update"></div>';
      recuperar += "	</div>";
      recuperar += "</div>";
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2>Eliminar Producto</h2>";
      recuperar += '		<label for="Nombre">Producto</label>';
      recuperar +=
        '			<p id="name" name="nombre">' + producto + '</p>';
        recuperar += '		<label for="img">imagen</label>';
      recuperar +=
        '			<p id="img" name="img">' + imagen + '</p>';
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
              "UPDATE producto set estatus = 0 where codproducto= ?";

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
        });
      });
    });
    $(".link_edit").click(function () {
      //valores obtendra el dato del td por posciones [0]
      var ID = $(this).parents("tr").find("td")[0].innerHTML;
      var producto = $(this).parents("tr").find("td")[1].innerHTML;
      var precio = $(this).parents("tr").find("td")[4].innerHTML;
      var cantidad = $(this).parents("tr").find("td")[5].innerHTML;
      var recuperar = "";

      recuperar += '<section id="containerEdit">';
      recuperar += '	 <div id="bodyEdit">';
      recuperar += "		<h2>Añadir STOCK</h2>";
      recuperar += '		<label for="producto">Producto</label>';
      recuperar +=
        '			<input id="producto" name="producto" value="' + producto + '" disabled></input>';
      recuperar += '   <label for="precio">Precio Nuevo Precio</label>';
      recuperar += '			<input type="number" min="0" id="precio" name="precio" value="' + precio + '" placeholder="0.00"></input>';
      recuperar += '		<label for="existencia">Añadir Existencia</label>';
      recuperar +=
        '			<input id="existencia" name="existencia" value="' +
        cantidad +
        '"></input>';
      recuperar += '   <label for="password">Contraseña</label>';
      recuperar +=
        '     <input type="password" id="password" name="password" placeholder="Verificar cambio con contraseña"></input>';
      recuperar += '   <div id="buttons">';
      recuperar += '			<button type="button" class="btn_cancel">Atrás</button>';
      recuperar += '			<button type="button" class="btn_save">Registrar</button>';
      recuperar += '			<a ondragstart="dragstart_handler(event);" type="button" class="btn_ok">Editar Producto</a>';
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
            var precio = document.getElementById("precio").value;
            var cantidad = document.getElementById("existencia").value;
            $queryString =
              "CALL actualizar_precio_producto(?,?,?)";
            connection.query(
              $queryString,
              [cantidad,precio,ID],
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
      $(".btn_ok").click(function (){
        localStorage.setItem("idproductChange", ID);
        window.location = "./editar_producto.html";
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