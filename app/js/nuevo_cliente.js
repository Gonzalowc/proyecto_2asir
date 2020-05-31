//=================Registrar==============================
  document.querySelector(".btn_save").onclick = function (e) {
    e.preventDefault();
    var name = document.getElementById("nombre").value;    
    var telefono = document.getElementById("telefono").value;
    var direccion = document.getElementById("direccion").value;
    var email = document.getElementById("email").value;
    var DNI = document.getElementById("dni").value;
    var alertRegister = document.getElementById("alert");
    var idusu = sessionStorage.getItem("idusuario");
    var validateEmail = fntEmailValidate(email); 
  
    if (name == "" || DNI == "" || direccion == "" || !validateEmail) {
      alertRegister.innerHTML =
        '<b><p style="color: red;">Todos los datos son obligatorios</p></b>';
      alertRegister.style.display = "block";
    } else {
      alertRegister.style.display = "none";
      alertRegister.innerHTML =
        '<b><p style="color: green;">Cliente añadido Correctamente</p></b>';
      alertRegister.style.display = "block";
      document.getElementById("nombre").value = "";
      document.getElementById("dni").value = "";
      document.getElementById("telefono").value = "";
      document.getElementById("direccion").value = "";
      document.getElementById("email").value = "";
      //=====================================================================
      $queryString =
        "INSERT INTO cliente (DNI, nombre, telefono, direccion, usuario_id, email) VALUES (?,?,?,?,?,?)";
  
      connection.query(
        $queryString,
        [DNI, name, telefono, direccion, idusu, email],
        (err) => {
          if (err) {
            return console.log("An error ocurred with the query MySQL", err);
          }
          console.log("Usuario añadido MySQL");

        }
      );
   }
  };
  
  //validate Email
  function fntEmailValidate(email) {
    const stringEmail = new RegExp(
      /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/
    );
    if (stringEmail.test(email) == false) {
      return false;
    } else {
      return true;
    }
  }
  