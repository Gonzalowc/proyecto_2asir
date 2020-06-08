
<?php 

$host = 'localhost';
$user = 'root';
$pass= '';
$db = 'factura';

$connection = @mysqli_connect($host,$user,$pass,$db);

if(!$connection){
    echo "Error en la conexion";
}
?>

<?php
if($_POST || $_GET){
IF($_GET["id"] && $_GET["fotoP"]){

$idusu = $_GET["id"];
$imgprev = $_GET["fotoP"];
echo "img previa: " . $imgprev;

if($imgprev != "user.png"){
    
    unlink("img/profiles/".$imgprev);
    echo "imagen borrada". $imgprev;
}

$archivo = $_FILES["archivo"];
if($archivo){
    $nombre = "profile_" . md5(date('d-m-Y H:m:s')).".png";
    $resultado = move_uploaded_file($archivo["tmp_name"], "img/profiles/". $nombre);
    if ($resultado) {
        echo "Subido con éxito";
        mysqli_query($connection, "UPDATE usuario SET fotoPerfil = '$nombre' WHERE idusuario = $idusu");

    } else {
        echo "Error al subir archivo";
    }
}
}
//Actualizar datos empresa
if($_POST["action"] == "updateDataEmpresa"){
    if(empty($_POST["NIF"]) || empty($_POST["nombre"]) || empty($_POST["telef"]) || 
    empty($_POST["direc"]) || empty($_POST["email"]) || empty($_POST["iva"])){
        $code = "1";
        $msg = "Todos los campos son obligatorios";
    }else{
        $intNIF = $_POST["NIF"];
        $strNombre = $_POST["nombre"];
        $strRSocial = $_POST["rsocial"];
        $intTel = intval($_POST["telef"]);
        $strEmail = $_POST["email"];
        $strDir = $_POST["direc"];
        $strIVA = intval($_POST["iva"]);

        $queryUPD = mysqli_query($connection, "UPDATE configuracion SET NIF= '$intNIF', nombre = '$strNombre', razon_social = '$strRSocial', telefono = '$intTel', email = '$strEmail', direccion = '$strDir', iva = $strIVA");
        
        if($queryUPD){
            $code = "00";
            $msg = "Datos actualizados correctamente";
        }else{
            $code = "2";
            $msg = "Error al actualizar los datos";
        }
        exit;
    }
    exit;
}
//
}