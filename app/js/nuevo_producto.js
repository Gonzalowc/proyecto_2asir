var Uindex = "http://localhost/proyecto/";
//=================IMAGEN
$("#foto").on("change",function(){
  var uploadFoto = document.getElementById("foto").value;
    var foto = document.getElementById("foto").files;
    var nav = window.URL || window.webkitURL;
    var contactAlert = document.getElementById('alert');
    
        if(uploadFoto !='')
        {
            var type = foto[0].type;
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
            alert("No selecciono foto");
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
    var replaceImg = producto.replace(/ /g,'') + ".png";
    
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
          fetch(Uindex+"producto.php?product="+replaceImg, {
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
        "INSERT INTO producto (producto, descripcion, proveedor, precio, existencia, usuario_id, foto) VALUES (?,?,?,?,?,?,?)";
  
      connection.query(
        $queryString,
        [producto, descripcion, proveedor, precio, cantidad, idusu, replaceImg],
        (err) => {
          if (err) {
            return console.log("An error ocurred with the query MySQL", err);
          }
          alertRegister.style.display = "none";
          alertRegister.innerHTML =
            '<b><p style="color: green;">Producto añadido Correctamente</p></b>';
          alertRegister.style.display = "block";
          document.getElementById("description").value = "";
          document.getElementById("proveedor").value = "";
          document.getElementById("producto").value = "";
          document.getElementById("precio").value = "";
          document.getElementById("cantidad").value = "";
          document.getElementById("foto").value = "";
        }
      );

    }
  };
  