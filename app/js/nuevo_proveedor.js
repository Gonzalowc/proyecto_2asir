//=================Registrar==============================
document.querySelector(".btn_save").onclick = function (e) {
    e.preventDefault();
    var proveedor = document.getElementById("proveedor").value;
    var contacto = document.getElementById("contacto").value;
    var telefono = document.getElementById("telefono").value;
    var direccion = document.getElementById("direccion").value;
    var email = document.getElementById("email").value;
    var alertRegister = document.getElementById("alert");
    var idusu = sessionStorage.getItem("idusuario");
    var validateEmail = fntEmailValidate(email); 
  
    if (proveedor == "" || contacto == "" || telefono == "" || email == "" || !validateEmail) {
      alertRegister.innerHTML =
        '<b><p style="color: red;">Todos los datos son obligatorios</p></b>';
      alertRegister.style.display = "block";
    } else {
      alertRegister.style.display = "none";
      document.getElementById("proveedor").value = "";
      document.getElementById("contacto").value = "";
      document.getElementById("telefono").value = "";
      document.getElementById("direccion").value = "";
      document.getElementById("email").value = "";
      alertRegister.innerHTML =
        '<b><p style="color: green;">Proveedor Añadido correctamente</p></b>';
      alertRegister.style.display = "block";
      //=====================================================================
      //==============================Consulta registrar==========================MySQL===============
  
      $queryString =
        "INSERT INTO proveedor (proveedor, contacto, telefono, direccion, email, usuario_id) VALUES (?,?,?,?,?,?)";
  
      connection.query(
        $queryString,
        [proveedor, contacto, telefono, direccion, email, idusu],
        (err) => {
          if (err) {
            return console.log("An error ocurred with the query MySQL", err);
          }
          console.log("Proveedor añadido MySQL");

        }
      );
    }
  };
  
  //validate Email
  function fntEmailValidate(email) {
    const stringEmail = new RegExp("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$");
    if (stringEmail.test(email) == false) {
      return false;
    } else {
      return true;
    }
  }
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