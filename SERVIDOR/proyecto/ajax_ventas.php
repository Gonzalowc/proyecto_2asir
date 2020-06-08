<?php
$host = 'localhost';
$user = 'root';
$pass= '';
$db = 'factura';

$connection = @mysqli_connect($host,$user,$pass,$db);

if(!empty($_POST)){    
    //buscar cliente
    if($_POST["action"] == 'searchCliente'){
        if(!empty($_POST['cliente'])){
            $DNI = $_POST["cliente"];
            $query = mysqli_query($connection, "SELECT * FROM cliente WHERE DNI LIKE '$DNI' AND estatus = 1");
            mysqli_close($connection);
            $result = mysqli_num_rows($query);

            $data = '';
            if($result > 0){
                $data = mysqli_fetch_assoc($query);
            }else{
                $data = 0;
            }
            echo json_encode($data, JSON_UNESCAPED_UNICODE);
        }
    } 
         
    // crear cliente - Ventas
    if($_POST["action"] == 'addCliente'){
            $DNI            = $_POST['dni_cliente'];
            $nombre         = $_POST['nom_cliente'];
            $telefono       = $_POST['tel_cliente'];
            $direccion      = $_POST['dir_cliente'];
            $usuario_id     = $_POST['usuario_id'];
            $email          = $_POST['mail_cliente'];

            $query_insert = mysqli_query($connection, "INSERT INTO cliente(DNI, nombre, telefono, direccion,email, usuario_id)
                                                            VALUES ('$DNI','$nombre','$telefono','$direccion','$email','$usuario_id')");

            if($query_insert){
            $codCliente = mysqli_insert_id($connection);
            $msg = $codCliente;
            }
            else{
            $msg = "Error";
            }
            echo $msg;
            exit;
    }
        //extraer datos producto
    if($_POST["action"] == 'infoProducto'){
            $producto_id = $_POST['producto'];
            $query = mysqli_query($connection, "SELECT codproducto, descripcion, existencia, precio FROM producto WHERE codproducto = $producto_id AND estatus = 1");
            
            mysqli_close($connection);
            $result = mysqli_num_rows($query);
            if($result > 0){
                $data = mysqli_fetch_assoc($query);
                echo json_encode($data, JSON_UNESCAPED_UNICODE);
                exit;
            }
            echo "Error";
            exit;            
    }
        // Agregar producto al detalle temporal
    if($_POST["action"] == 'addProductoDetalle'){
        if(empty($_POST['producto']) || empty($_POST['cantidad'])){
                echo "Error";
        }else{
            $codproducto    = $_POST["producto"];
            $cantidad       = $_POST["cantidad"];
            $token          = md5($_POST["usuario_id"]);
            $query_iva = mysqli_query($connection, "SELECT iva FROM configuracion");
            $result_iva = mysqli_num_rows($query_iva);
            $query_detalle_temp = mysqli_query($connection, "CALL add_detalle_temp($codproducto, $cantidad, '$token')");
            $result = mysqli_num_rows($query_detalle_temp);
            $detalleTabla = '';
            $sub_total  = 0;
            $iva        = 0;
            $total      = 0;
            $arrayData  = array();
            if($result > 0){
                    if($result_iva > 0){
                        $info_iva = mysqli_fetch_assoc($query_iva);
                        $iva = $info_iva["iva"];
                    }
                    while($data = mysqli_fetch_assoc($query_detalle_temp)){
                        $precioTotal = round($data["cantidad"] * $data["precio_venta"], 2);
                        $sub_total = round($sub_total + $precioTotal, 2);
                        $total = round($total + $precioTotal, 2);
                        $detalleTabla .= '
                                        <tr>
                                            <td>'. $data["codproducto"] .'</td>
                                            <td colspan="2">'. $data["descripcion"] .'</td>
                                            <td class="textcenter">'. $data["cantidad"] .'</td>
                                            <td class="textright">'. $data["precio_venta"] .'</td>
                                            <td class="textright">'. $precioTotal .'</td>
                                            <td class="">
                                                <a href="#" class="link_delete" 
                                                onclick="event.preventDefault(); 
                                                del_product_detalle('. $data["correlativo"] .');"><i class="far fa-trash-alt"></i></a>
                                            </td>
                                        </tr>';
                    }
                    $impuesto = round($sub_total * ($iva / 100), 2);
                    $tl_siniva = round($sub_total - $impuesto, 2);
                    $total = round($tl_siniva + $impuesto, 2);

                    $detalleTotales = '
                                        <tr>
                                            <td class="textright" colspan="5">SUBTOTAL €.</td>
                                            <td class="textright">'. $tl_siniva.'</td>
                                        </tr>
                                        <tr>
                                            <td class="textright" colspan="5">IVA('. $iva.'%)</td>
                                            <td class="textright">'. $impuesto.'</td>
                                        </tr>
                                        <tr>
                                            <td class="textright" colspan="5">TOTAL</td>
                                            <td class="textright">'. $total.'</td>
                                        </tr>';
                    
                    $arrayData["detalle"] = $detalleTabla;
                    $arrayData["totales"] = $detalleTotales;
                    echo json_encode($arrayData, JSON_UNESCAPED_UNICODE);
            }else{
                    echo "Error";
            }
            mysqli_close($connection);
        }
        exit;
    }
       // Extrae detalle del detalle temporal
       if($_POST["action"] == 'searchForDetalle'){
        if(empty($_POST['user'])){
                echo "Error";
        }else{
            $token = md5($_POST["user"]);

            $query = mysqli_query($connection, "SELECT tmp.correlativo,
                                                        tmp.token_user,
                                                        tmp.cantidad,
                                                        tmp.precio_venta,
                                                        p.codproducto,
                                                        p.descripcion
                                                FROM detalle_temp tmp
                                                INNER JOIN producto p
                                                ON tmp.codproducto = p.codproducto
                                                WHERE token_user = '$token'");

            $result = mysqli_num_rows($query);

            $query_iva = mysqli_query($connection, "SELECT iva FROM configuracion");
            $result_iva = mysqli_num_rows($query_iva);
            
            $detalleTabla = '';
            $sub_total  = 0;
            $iva        = 0;
            $total      = 0;
            $arrayData  = array();
            if($result > 0){
                if($result_iva > 0){
                    $info_iva = mysqli_fetch_assoc($query_iva);
                    $iva = $info_iva["iva"];
                }
                while($data = mysqli_fetch_assoc($query)){
                    $precioTotal = round($data["cantidad"] * $data["precio_venta"], 2);
                    $sub_total = round($sub_total + $precioTotal, 2);
                    $total = round($total + $precioTotal, 2);
                    $detalleTabla .= '
                                    <tr>
                                        <td>'. $data["codproducto"] .'</td>
                                        <td colspan="2">'. $data["descripcion"] .'</td>
                                        <td class="textcenter">'. $data["cantidad"] .'</td>
                                        <td class="textright">'. $data["precio_venta"] .'</td>
                                        <td class="textright">'. $precioTotal .'</td>
                                        <td class="">
                                            <a href="#" class="link_delete" 
                                            onclick="event.preventDefault(); 
                                            del_product_detalle('. $data["correlativo"] .');"><i class="far fa-trash-alt"></i></a>
                                        </td>
                                    </tr>';
                }
                $impuesto = round($sub_total * ($iva / 100), 2);
                $tl_siniva = round($sub_total - $impuesto, 2);
                $total = round($tl_siniva + $impuesto, 2);   
                $detalleTotales = '
                                    <tr>
                                        <td class="textright" colspan="5">SUBTOTAL €.</td>
                                        <td class="textright">'. $tl_siniva.'</td>
                                    </tr>
                                    <tr>
                                        <td class="textright" colspan="5">IVA('. $iva.'%)</td>
                                        <td class="textright">'. $impuesto.'</td>
                                    </tr>
                                    <tr>
                                        <td class="textright" colspan="5">TOTAL</td>
                                        <td class="textright">'. $total.'</td>
                                    </tr>';

                $arrayData["detalle"] = $detalleTabla;
                $arrayData["totales"] = $detalleTotales;
                echo json_encode($arrayData, JSON_UNESCAPED_UNICODE);
            }else{
                    echo "Error";
            }
            mysqli_close($connection);
        }
        exit;
    }
        //Borrar registro unitario detalle temporal 
    if($_POST["action"] == 'delProductoDetalle'){
            if(empty($_POST['id_detalle'])){
                echo "Error";
            }else{
            $id_detalle = $_POST["id_detalle"];
            $token = md5($_POST["id_usu"]);

            

            $query_iva = mysqli_query($connection, "SELECT iva FROM configuracion");
            $result_iva = mysqli_num_rows($query_iva);

            $query_detalle_temp = mysqli_query($connection, "CALL del_detalle_temp($id_detalle, '$token')");
            $result = mysqli_num_rows($query_detalle_temp);
            
            $detalleTabla = '';
            $sub_total  = 0;
            $iva        = 0;
            $total      = 0;
            $arrayData  = array();
            if($result > 0){
                    if($result_iva > 0){
                        $info_iva = mysqli_fetch_assoc($query_iva);
                        $iva = $info_iva["iva"];
                    }
                    while($data = mysqli_fetch_assoc($query_detalle_temp)){
                        $precioTotal = round($data["cantidad"] * $data["precio_venta"], 2);
                        $sub_total = round($sub_total + $precioTotal, 2);
                        $total = round($total + $precioTotal, 2);
                        $detalleTabla .= '
                                        <tr>
                                            <td>'. $data["codproducto"] .'</td>
                                            <td colspan="2">'. $data["descripcion"] .'</td>
                                            <td class="textcenter">'. $data["cantidad"] .'</td>
                                            <td class="textright">'. $data["precio_venta"] .'</td>
                                            <td class="textright">'. $precioTotal .'</td>
                                            <td class="">
                                                <a href="#"  ondragstart="dragstart_handler(event);" class="link_delete" 
                                                onclick="event.preventDefault(); 
                                                del_product_detalle('. $data["correlativo"] .');"><i class="far fa-trash-alt"></i></a>
                                            </td>
                                        </tr>';
                    }?>
<script type="text/javascript">
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
</script>
<?php
                    $impuesto = round($sub_total * ($iva / 100), 2);
                    $tl_siniva = round($sub_total - $impuesto, 2);
                    $total = round($tl_siniva + $impuesto, 2);

                    $detalleTotales = '
                                        <tr>
                                            <td class="textright" colspan="5">SUBTOTAL €.</td>
                                            <td class="textright">'. $tl_siniva.'</td>
                                        </tr>
                                        <tr>
                                            <td class="textright" colspan="5">IVA('. $iva.'%)</td>
                                            <td class="textright">'. $impuesto.'</td>
                                        </tr>
                                        <tr>
                                            <td class="textright" colspan="5">TOTAL</td>
                                            <td class="textright">'. $total.'</td>
                                        </tr>';
                    
                    $arrayData["detalle"] = $detalleTabla;
                    $arrayData["totales"] = $detalleTotales;
                    echo json_encode($arrayData, JSON_UNESCAPED_UNICODE);
            }else{
                    echo "Error";
            }
            mysqli_close($connection);
            }
    exit;
    }
        //Anular Venta
    if($_POST["action"] == 'anularVenta'){
        $token = md5($_POST["usuario_id"]);
        $query_del = mysqli_query($connection, "DELETE FROM detalle_temp WHERE token_user = '$token'");
        mysqli_close($connection);
        if($query_del){
            echo "ok";
        }else{
            echo "Error";
        }
        exit;
    }
        //Procesar Venta
    if($_POST["action"] == 'procesarVenta'){
        if(empty($_POST["codcliente"])){
            echo "Error";
            exit;
        }else{
            $codCliente = $_POST["codcliente"];
            $token = md5($_POST["usuario_id"]);
            $usuario = $_POST["usuario_id"];
            $query = mysqli_query($connection, "SELECT * FROM detalle_temp WHERE token_user = '$token'");
            $result = mysqli_num_rows($query);

            if($result > 0){
                $query_procesar = mysqli_query($connection, "CALL procesar_venta($usuario,$codCliente,'$token')");
                mysqli_close($connection);
                $result_detalle = mysqli_num_rows($query_procesar);

                if($result_detalle > 0){
                    $data = mysqli_fetch_array($query_procesar);
                    echo json_encode($data, JSON_UNESCAPED_UNICODE);
                }else{
                    echo "Error";
                }
            }else{
                echo "Error";
            }
            /* mysqli_close($connection); */
            exit;
        }
    }
    if($_POST["action"] == 'anularFactura'){
        if(!empty($_POST["factura"])){
            $idfactura = $_POST["factura"];

            $query_anular = mysqli_query($connection, "CALL anular_factura($idfactura)");
            mysqli_close($connection);
            $result = mysqli_num_rows($query_anular);
            if($result > 0){
                $data = mysqli_fetch_assoc($query_anular);
                echo json_encode($data, JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
        echo "Error";
        exit;
    }
}
exit;

?>
