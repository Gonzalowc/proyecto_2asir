//require MySQL
var mysql = require("mysql");
//Hash password
var md5 = require("md5");
//require jquery datatable
var $ = require("jquery");
var dt = require("datatables.net")(window, $);
//var ip = "79.145.85.205";
var ip = "localhost";
var Uimg = "http://" + ip + "/proyecto/img/profiles/";
var ruta = "http://" + ip + "/proyecto/";
//laskjdlaskjdasd
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
var idusu = sessionStorage.getItem("idusuario");
$queryString = "call dataDashboard(?)";
connection.query($queryString, [idusu], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if (results) {
    document.getElementById("intUser").innerHTML = results[0][0].usuarios;
    document.getElementById("intUserA").innerHTML = results[0][0].usuariosA;
    document.getElementById("intUserI").innerHTML = results[0][0].usuariosI;
    document.getElementById("intCl").innerHTML = results[0][0].clientes;
    document.getElementById("intClA").innerHTML = results[0][0].clientesA;
    document.getElementById("intClI").innerHTML = results[0][0].clientesI;
    document.getElementById("intPv").innerHTML = results[0][0].proveedores;
    document.getElementById("intP").innerHTML = results[0][0].productos;
    document.getElementById("intV").innerHTML = results[0][0].ventas;
    document.getElementById("intVA").innerHTML = results[0][0].ventasA;
    document.getElementById("intVI").innerHTML = results[0][0].ventasI;
    document.getElementById("intVH").innerHTML = results[0][0].ventasH;
    document.getElementById("intVHA").innerHTML = results[0][0].ventasHA;
    document.getElementById("intVHI").innerHTML = results[0][0].ventasHI;
  }
});
var idrol = sessionStorage.getItem("idrol");
$queryString = "select * from rol where idrol = ?";
connection.query($queryString, [idrol], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if (results) {
    html = "";
    if (results[0].listaUsu == 0) {
      document.getElementById("usuario").href = "#";
    }
    if (results[0].listaCli == 0) {
      document.getElementById("cliente").href = "#";
    }
    if (results[0].listaProv == 0) {
      document.getElementById("proveedor").href = "#";
    }
    if (results[0].listaProd == 0) {
      document.getElementById("producto").href = "#";
    }
    if (results[0].listaVen == 0) {
      document.getElementById("venta").href = "#";
      document.getElementById("ventados").href = "#";
    }
  }
});
$queryString =
  "select u.nombre, u.correo, u.usuario, r.rol from usuario u join rol r on u.rol = r.idrol where idusuario = ?";
connection.query($queryString, [idusu], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if (results) {
    if(results[0].rol != "SuperAdmin"){
      document.getElementById("Role").style.display = "none";
    }
    document.getElementById("usrNombre").innerHTML = results[0].nombre;
    document.getElementById("usrEmail").innerHTML = results[0].correo;
    document.getElementById("usrRol").innerHTML = results[0].rol;
    document.getElementById("usrUsuario").innerHTML = results[0].usuario;
    if (results[0].rol != "SuperAdmin") {
      $("#txtNIF").attr("disabled", "disabled");
      $("#txtNombre").attr("disabled", "disabled");
      $("#txtRSocial").attr("disabled", "disabled");
      $("#intTelefono").attr("disabled", "disabled");
      $("#txtDireccion").attr("disabled", "disabled");
      $("#txtEmail").attr("disabled", "disabled");
      $("#intIVA").attr("disabled", "disabled");
      document.getElementById("config").style.display = "none";
    }
  }
});

$queryString = "select * from configuracion ";
connection.query($queryString, (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if (results) {
    console.log(results);
    document.getElementById("txtNIF").value = results[0].NIF;
    document.getElementById("txtNombre").value = results[0].nombre;
    document.getElementById("txtRSocial").value = results[0].razon_social;
    document.getElementById("intTelefono").value = results[0].telefono;
    document.getElementById("txtDireccion").value = results[0].direccion;
    document.getElementById("txtEmail").value = results[0].email;
    document.getElementById("intIVA").value = results[0].iva;
  }
});

$("#config").click(function (e) {
  e.preventDefault();
  var action = document.getElementById("action").value;
  var strNombreEmp = document.getElementById("txtNombre").value;
  var intNIF = document.getElementById("txtNIF").value;
  var strRSocialEmp = document.getElementById("txtRSocial").value;
  var intTelEmp = document.getElementById("intTelefono").value;
  var strEmailEmp = document.getElementById("txtEmail").value;
  var strDirEmp = document.getElementById("txtDireccion").value;
  var intIVA = document.getElementById("intIVA").value;

  if (
    intNIF == "" ||
    strNombreEmp == "" ||
    intTelEmp == "" ||
    strDirEmp == "" ||
    strEmailEmp == ""
  ) {
    $(".alertFormEmpresa").html(
      "<p style='color: red;'> Todos los campos son obligatorios.</p>"
    );
    return false;
  }
  $.ajax({
    url: ruta + "index.php",
    type: "POST",
    async: true,
    data: {
      action: action,
      NIF: intNIF,
      nombre: strNombreEmp,
      rsocial: strRSocialEmp,
      telef: intTelEmp,
      direc: strDirEmp,
      email: strEmailEmp,
      iva: intIVA,
    },
    beforeSend: function () {
      $(".containerDataEmpresa input").attr("disabled", "disabled");
    },
    success: function (response) {
      if (response) {
        $(".alertFormEmpresa").html(
          "<b><p style='color: green;' class='msg_save'>Empresa Modificada Correctamente</p></b>"
        );
        $(".containerDataEmpresa").removeAttr("disabled");
        $(".alertFormEmpresa").slideDown();
      } else {
        $(".alertFormEmpresa").html(
          "<p style='color: red;'>" + info.msg + "</p>"
        );
      }
      $(".alertFormEmpresa").slideDown();
    },
    error: function (error) {},
  });
});

$queryString = "SELECT idrol, rol FROM rol ORDER BY idrol ASC";

connection.query($queryString, (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if (results) {
    console.log(results);
    let i = 0;
    let rol = "";
    for (i; i < results.length; i++) {
      rol +=
        '<option value="' +
        results[i].idrol +
        '">' +
        results[i].rol +
        "</option>";
    }
    document.getElementById("roles").innerHTML = rol;
  }
});

$("#Role").click(function (e) {
  e.preventDefault();
  var rol = document.getElementById("roles").value;
  var Ini = document.getElementById("Ini").checked;
  var NUsu = document.getElementById("NUsu").checked;
  var LUsu = document.getElementById("LUsu").checked;
  var RUsu = document.getElementById("RUsu").checked;
  var NCli = document.getElementById("NCli").checked;
  var LCli = document.getElementById("LCli").checked;
  var RCli = document.getElementById("RCli").checked;
  var NProv = document.getElementById("NProv").checked;
  var LProv = document.getElementById("LProv").checked;
  var RProv = document.getElementById("RProv").checked;
  var NProd = document.getElementById("NProd").checked;
  var LProd = document.getElementById("LProd").checked;
  var RProd = document.getElementById("RProd").checked;
  var NVen = document.getElementById("NVen").checked;
  var LVen = document.getElementById("LVen").checked;
  var LOProd = document.getElementById("LOProd").checked;
  if (Ini === true) {
    Ini = 1;
  } else {
    Ini = 0;
  }
  if (NUsu === true) {
    NUsu = 1;
  } else {
    NUsu = 0;
  }
  if (LUsu === true) {
    LUsu = 1;
  } else {
    LUsu = 0;
  }
  if (RUsu === true) {
    RUsu = 1;
  } else {
    RUsu = 0;
  }
  if (NCli === true) {
    NCli = 1;
  } else {
    NCli = 0;
  }
  if (LCli === true) {
    LCli = 1;
  } else {
    LCli = 0;
  }
  if (RCli === true) {
    RCli = 1;
  } else {
    RCli = 0;
  }
  if (NProv === true) {
    NProv = 1;
  } else {
    NProv = 0;
  }
  if (LProv === true) {
    LProv = 1;
  } else {
    LProv = 0;
  }
  if (RProv === true) {
    RProv = 1;
  } else {
    RProv = 0;
  }
  if (NProd === true) {
    NProd = 1;
  } else {
    NProd = 0;
  }
  if (LProd === true) {
    LProd = 1;
  } else {
    LProd = 0;
  }
  if (RProd === true) {
    RProd = 1;
  } else {
    RProd = 0;
  }
  if (NVen === true) {
    NVen = 1;
  } else {
    NVen = 0;
  }

  if (LVen === true) {
    LVen = 1;
  } else {
    LVen = 0;
  }
  if (LOProd === true) {
    LOProd = 1;
  } else {
    LOProd = 0;
  }
  $queryString =
    "UPDATE `rol` SET `inicio`=?,`nuevoUsu`=?,`listaUsu`=?,`recuUsu`=?,`nuevoCli`=?,`listaCli`=?,`recuCli`=?,`nuevoProv`=?,`listaProv`=?,`recuProv`=?,`nuevoProd`=?,`listaProd`=?,`recuProd`=?,`nuevoVen`=?,`listaVen`=?,`listadoProductos`=? WHERE idrol = ?";

  connection.query(
    $queryString,
    [
      Ini,
      NUsu,
      LUsu,
      RUsu,
      NCli,
      LCli,
      RCli,
      NProv,
      LProv,
      RProv,
      NProd,
      LProd,
      RProd,
      NVen,
      LVen,
      LOProd,
      rol,
    ],
    (err, results) => {
      if (err) {
        return console.log("An error ocurred with the query", err);
      }
      if (results) {
        $queryString = "SELECT idrol, rol FROM rol WHERE idrol = ?";

        connection.query($queryString, [rol], (err, results) => {
          if (err) {
            return console.log("An error ocurred with the query", err);
          }
          if (results) {
            console.log("ganado2");
            $(".alertFormRol").html(
              "<b><p style='color: green;' class='msg_save'>Rol " +
                results[0].rol +
                " Correctamente</p></b>"
            );
            document.getElementById("alertRol").style.display = "block";
          }
        });
      }
    }
  );
});

function Roles() {
  var rol = document.getElementById("roles").value;

  $queryString = "select * from rol where idrol = ?";
  connection.query($queryString, [rol], (err, results) => {
    if (err) {
      return console.log("An error ocurred with the query", err);
    }
    if (results) {
      document.getElementById("Ini").checked = results[0].inicio;
      document.getElementById("NUsu").checked = results[0].nuevoUsu;
      document.getElementById("LUsu").checked = results[0].listaUsu;
      document.getElementById("RUsu").checked = results[0].recuUsu;
      document.getElementById("NCli").checked = results[0].nuevoCli;
      document.getElementById("LCli").checked = results[0].listaCli;
      document.getElementById("RCli").checked = results[0].recuCli;
      document.getElementById("NProv").checked = results[0].nuevoProv;
      document.getElementById("LProv").checked = results[0].listaProv;
      document.getElementById("RProv").checked = results[0].recuProv;
      document.getElementById("NProd").checked = results[0].nuevoProd;
      document.getElementById("LProd").checked = results[0].listaProd;
      document.getElementById("RProd").checked = results[0].recuProd;
      document.getElementById("NVen").checked = results[0].nuevoVen;
      document.getElementById("LVen").checked = results[0].listaVen;
      document.getElementById("LOProd").checked = results[0].listadoProductos;
    }
  });
}
setTimeout("Roles()", 500);
