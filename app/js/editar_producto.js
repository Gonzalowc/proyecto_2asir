var Uindex = "http://localhost/proyecto/";
var dirImg = "http://localhost/proyecto/img/products/"
var ID = localStorage.getItem("idproductChange");

$queryString =
    "SELECT p.codproducto, p.producto, p.descripcion, pd.proveedor, p.precio, p.existencia, p.foto FROM producto p join proveedor pd on p.proveedor = pd.codproveedor WHERE p.codproducto = ?";

connection.query($queryString,[ID], (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
var descripcion = results[0].descripcion;
var proveedor = results[0].proveedor;
var producto = results[0].producto;
var precio = results[0].precio;
var cantidad = results[0].existencia;
var foto = results[0].foto;
localStorage.setItem("prevIMG", foto);
document.getElementById("description").value = descripcion;
document.getElementById("proveedor").value = proveedor;
document.getElementById("producto").value = producto;
document.getElementById("precio").value = precio;
document.getElementById("cantidad").value = cantidad
$(".prevPhoto").append("<img id='img' src="+ dirImg + foto +">");
})


//=================IMAGEN
$("#foto").on("change",function(){
  var uploadFoto = document.getElementById("foto").value;
    var foto = document.getElementById("foto").files;
    var nav = window.URL || window.webkitURL;
    var contactAlert = document.getElementById('form_alert');
    
        if(uploadFoto !='')
        {
            var type = foto[0].type;
            var name = foto[0].name;
            if(type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png')
            {
                contactAlert.innerHTML = '<p class="errorArchivo">El archivo no es válido.</p>';                        
                $("#img").remove();
                $(".delPhoto").addClass('notBlock');
                $('#foto').val('');
                return false;
            }else{  
                    contactAlert.innerHTML='';
                    $("#img").remove();
                    $(".delPhoto").removeClass('notBlock');
                    var objeto_url = nav.createObjectURL(this.files[0]);
                    $(".prevPhoto").append("<img id='img' src="+objeto_url+">");
                    $(".upimg label").remove();
                    
                }
          }else{
            alert("No hay producto sin foto");
            $("#img").remove();
          }              
});

$('.delPhoto').click(function(){
  $('#foto').val('');
  $(".delPhoto").addClass('notBlock');
  $("#img").remove();
    if($("#foto_actual") && $("#foto_remove")){
        $("#foto_remove").val("img_producto.png")
    }
});
//::::::::::::::::::FIN IMAGEN
//===============Proveedores=============================
$queryString = "SELECT codproveedor, proveedor, estatus FROM proveedor WHERE estatus=1 ORDER BY proveedor ASC";

connection.query($queryString, (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
    
  let i = 0;
  let proveedor = "";
  for (i; i < results.length; i++) {
    proveedor +=
      '<option value="' +
      results[i].codproveedor +
      '">' +
      results[i].proveedor +
      "</option>";
  }
  document.getElementById("proveedor").innerHTML = proveedor;
});
//=================Registrar==============================
document.querySelector(".btn_save").onclick = function (e) {
    e.preventDefault();
    var descripcion = document.getElementById("description").value;
    var proveedor = document.getElementById("proveedor").value;    
    var producto  = document.getElementById("producto").value;
    var replaceImg = producto.replace(/ /g,'')+Date.now() + ".png";
    if(producto == null){
      replaceImg = "";
    }
    var prevIMG = localStorage.getItem("prevIMG");
    
    console.log(replaceImg);
    var precio    = document.getElementById("precio").value;
    var cantidad  = document.getElementById("cantidad").value;
    var alertRegister = document.getElementById("alert");
    var idusu = sessionStorage.getItem("idusuario");
  
    if (proveedor == "" || producto == "" || precio == "" || cantidad == "") {
      alertRegister.innerHTML =
        '<b><p style="color: red;">Todos los datos son obligatorios</p></b>';
      alertRegister.style.display = "block";
    } else { 
      //=====================================================================
      const inputFile = document.querySelector("#foto");
      if (inputFile.files.length > 0) {
          let formData = new FormData();
          formData.append("archivo", inputFile.files[0]); // En la posición 0; es decir, el primer elemento 
          fetch(Uindex+"producto.php?product="+replaceImg+"&prevIMG=" + prevIMG, {
              method: 'POST',
              body: formData,
          })
              .then(respuesta => respuesta.text())
              .then(decodificado => {
                  console.log(decodificado);
              });
              /* location.reload(); */
      } else {
          // El usuario no ha seleccionado archivos
          alert("Selecciona un archivo");
      }

      //==============================Consulta registrar==========================MySQL===============
  
      $queryString =
        "UPDATE producto SET producto=?, descripcion=?, proveedor=?, precio=?, existencia=?, usuario_id=?, foto=? WHERE codproducto=?";
  
      connection.query(
        $queryString,
        [producto, descripcion, proveedor, precio, cantidad, idusu, replaceImg, ID],
        (err) => {
          if (err) {
            return console.log("An error ocurred with the query MySQL", err);
          }
          alertRegister.style.display = "none";
          alertRegister.innerHTML =
            '<b><p style="color: green;">Producto Modificado Correctamente</p></b>';
          alertRegister.style.display = "block";
          localStorage.setItem("prevIMG", replaceImg);
        }
      );

    }
  };
  