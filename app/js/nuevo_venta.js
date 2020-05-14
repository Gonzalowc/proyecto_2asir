var md5 = require("md5");

var Uri = "http://localhost/proyecto/";
var vendedor = sessionStorage.getItem("nombre");

document.getElementById("vendedor").innerHTML = vendedor;
$(document).ready(function(){
var usuario_id = sessionStorage.getItem("idusuario");

document.getElementById("usuario_id").value = usuario_id;

$('.btn_new_cliente').click(function(e){
    e.preventDefault();
    $('#nom_cliente').removeAttr('disabled');
    $('#tel_cliente').removeAttr('disabled');
    $('#dir_cliente').removeAttr('disabled');
    $('#mail_cliente').removeAttr('disabled');
    $('#div_registro_cliente').slideDown();
    });
//buscar cliente en ventas

    $('#dni_cliente').keyup(function(e){
        e.preventDefault();

        var cliente = $(this).val();
        var action = "searchCliente";

        $.ajax({
            url: Uri + "ajax_ventas.php",
            type: "POST",
            async: true,
            data: {action:action,cliente:cliente},
            success: function(response){
                if(response == 0){
                    $('#idcliente').val('');
                    $('#nom_cliente').val('');
                    $('#tel_cliente').val('');
                    $('#dir_cliente').val('');
                    $('#mail_cliente').val('');
                    //Mostrar boton agregar
                    $('.btn_new_cliente').slideDown();
                }else{
                    var data = $.parseJSON(response);
                    $('#idcliente').val(data.idcliente);
                    $('#nom_cliente').val(data.nombre);
                    $('#tel_cliente').val(data.telefono);
                    $('#dir_cliente').val(data.direccion);
                    $('#mail_cliente').val(data.email);
                    //Ocultar boton agregar
                    $('.btn_new_cliente').slideUp();

                    //bloque campos
                    $('#nom_cliente').attr('disabled', 'disabled');
                    $('#tel_cliente').attr('disabled', 'disabled');
                    $('#dir_cliente').attr('disabled', 'disabled');
                    $('#mail_cliente').attr('disabled', 'disabled');

                    //ocultar boton guardar
                    $('#div_registro_cliente').slideUp();
                }
            },
            error: function(error){
                console.log(error);
            }
        });

        
    });
    
// Crear Cliente - Ventas
    $('#form_new_cliente_venta').submit(function(e){
        e.preventDefault();
        var usuario_id = sessionStorage.getItem("idusuario");
        $.ajax({
            url: Uri+'ajax_ventas.php',
            type: "POST",
            async: true,
            data: $('#form_new_cliente_venta').serialize(),
            success: function(response){
                if( response != 'Error')
//Agregar id a input hidden
                $('#idcliente').val(response);
//bloque de campos
            $('#nom_cliente').attr('disabled','disabled');
            $('#tel_cliente').attr('disabled','disabled');
            $('#dir_cliente').attr('disabled','disabled');
            $('#mail_cliente').attr('disabled','disabled');
//ocultar boton agregar
            $('.btn_new_cliente').slideUp();
// ocultar boton guardar
            $('#div_registro_cliente').slideUp();
            },
            error: function(error){
                console.log("Error")
                }
        });
    });

// Buscar producto - Ventas
    $('#txt_cod_producto').keyup(function(e){
        e.preventDefault();
        var producto = $(this).val();
        var action = 'infoProducto';
        
        if(producto != ''){
         $.ajax({
            url: Uri+'ajax_ventas.php',
            type: "POST",
            async: true,
            data: {action:action,producto:producto},
            success: function(response){
                console.log(response);  
                if(response != 'Error'){  
                var info = JSON.parse(response);
                $('#txt_descripcion').html(info.descripcion);
                $('#txt_existencia').html(info.existencia);
                $('#txt_cant_producto').val('1');
                $('#txt_precio').html(info.precio);
                $('#txt_precio_total').html(info.precio);
// activar cantidad
                $('#txt_cant_producto').removeAttr('disabled');
// Mostrar boton agregar
                $('#add_product_venta').slideDown();
                }else{
                /* if(response = 'Error'){ */
                    console.log("adios"); 
                    $('#txt_descripcion').html('-');
                    $('#txt_existencia').html('-');
                    $('#txt_cant_producto').val('0');
                    $('#txt_precio').html('0.00');
                    $('#txt_precio_total').html('0.00');
// Bloquear Cantidad
                    $('#txt_cant_producto').attr('disabled','disabled');
// Ocultar boton agregar
                    $('#add_product_venta').slideUp();
                }    
            },
            error: function(error){
                }
         });   
        }
        
    });
// Validar Cantidad del producto antes de agregar
$('#txt_cant_producto').keyup(function(e){
    e.preventDefault();
    var precio_total = $(this).val() * $('#txt_precio').html();
    $("#txt_precio_total").html(precio_total);
    
    //Ocultar el boton agregar si la cantidad es menor que 1, 
    //no numerico o mayor que la existencia
    var negativo = parseInt($("#txt_existencia").html()) - $("#txt_cant_producto").val();
    if($(this).val()<1 || isNaN($(this).val()) || negativo < 0){
        $('#add_product_venta').slideUp();
    }else{
        $('#add_product_venta').slideDown();
    }
});
//Agregar producto al detalle
$("#add_product_venta").click(function(e){
    e.preventDefault();
    if($("#txt_cant_producto").val() > 0 || !isNaN($("#txt_cant_producto").val()) ){
        var codproducto = $("#txt_cod_producto").val();
        var cantidad = $("#txt_cant_producto").val();
        var usuario_id = sessionStorage.getItem("idusuario");
        var action = "addProductoDetalle";
    }
    $.ajax({
        url: Uri+"ajax_ventas.php",
        type: "POST",
        async: true,
        data:{action:action,producto:codproducto,cantidad:cantidad,usuario_id:usuario_id},
        success: function(response){
            console.log(response);
            if(response != "Error"){
                var info = JSON.parse(response);
                $("#detalle_venta").html(info.detalle);
                $("#detalle_totales").html(info.totales);

                $("#txt_cod_producto").val('');
                $("#txt_descripcion").html('-');
                $("#txt_existencia").html('-');
                $("#txt_cant_producto").val('0');
                $("#txt_precio").html('0.00');
                $("#txt_precio_total").html('0.00');

                $("#txt_cant_producto").attr('disabled','disabled');
                $("#add_product_venta").slideUp();

            }else{
                console.log("No data");
            }
        },
        error: function(error){

        }
    });
})
});

function del_product_detalle(correlativo){
    var action = "delProductoDetalle";
    var id_detalle = correlativo;
    var id_usu = sessionStorage.getItem("idusuario");

    $.ajax({
        url: Uri+"ajax_ventas.php",
        type: "POST",
        async: true,
        data:{action:action,id_detalle:id_detalle,id_usu:id_usu},
        success: function(response){
            console.log(response);
            if(response != "Error"){
                var info = JSON.parse(response);
                $("#detalle_venta").html(info.detalle);
                $("#detalle_totales").html(info.totales);
                /* $("#txt_cod_producto").val('');
                $("#txt_descripcion").html('-');
                $("#txt_existencia").html('-');
                $("#txt_cant_producto").val('0');
                $("#txt_precio").html('0.00');
                $("#txt_precio_total").html('0.00');

                $("#txt_cant_producto").attr('disabled','disabled');
                $("#add_product_venta").slideUp(); */
            }else{
                $("#detalle_venta").html('');
                $("#detalle_totales").html('');
            }
                            
        },
        error: function(error){

        }
    });
}

function searchForDetalle(id){
    var action = "searchForDetalle";
    var user = id;

    $.ajax({
        url: Uri+"ajax_ventas.php",
        type: "POST",
        async: true,
        data:{action:action,user:user},
        success: function(response){
            console.log(response);
            if(response != "Error"){
                var info = JSON.parse(response);
                $("#detalle_venta").html(info.detalle);
                $("#detalle_totales").html(info.totales);
            }else{
                console.log("No Data");
            }
                            
        },
        error: function(error){

        }
    });
     $queryString = "SELECT * FROM detalle_temp";

connection.query($queryString, (err, results) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }
  if(results <= 0){
    $queryString =
    "ALTER TABLE detalle_temp AUTO_INCREMENT = 1";
console.log("hola");
connection.query($queryString, (err) => {
  if (err) {
    return console.log("An error ocurred with the query", err);
  }})
  }})
}

