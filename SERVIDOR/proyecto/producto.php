
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

$product = $_GET["product"];
$prevIMG = $_GET["prevIMG"];

$archivo = $_FILES["archivo"];
$ruta = "img/products/".$product;


         
         if($archivo){  
             if(file_exists("img/products/".$prevIMG)){
              unlink("img/products/".$prevIMG);    
             }   
             $resultado = move_uploaded_file($archivo["tmp_name"], $ruta);
             if ($resultado) {
                 echo "subido con éxito con unlink";
             } else {
                 echo "Error al subir archivo unlink";
             }
         }



