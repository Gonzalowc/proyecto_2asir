//var ip = "79.145.85.205";
var ip = "localhost";
var rutaIMG = "http://"+ ip +"/proyecto/img/products/";
$queryString = "SELECT p.codproducto, p.producto, p.descripcion, p.precio, p.existencia, pv.proveedor,p.foto FROM producto p, proveedor pv WHERE p.proveedor = pv.codproveedor ORDER BY p.codproducto NOT IN ( SELECT p.codproducto FROM detallefactura d, producto p, proveedor pv WHERE d.codproducto= p.codproducto AND p.proveedor = pv.codproveedor GROUP BY d.codproducto ORDER BY sum(cantidad) desc)";
connection.query($queryString, (err, results) => {
    if (err) {
      return console.log("An error ocurred with the query", err);
    }
console.log(results);
var html = "";
for (i = 0; i < results.length; i++) {
html +='<div class="col-md-2 col-sm-4 col-xs-8">';
html +='   <article class="material-card Red">';
if(i<8){
html +='       <h3 style="color: rgb(239,184,16); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; background-color: rgb(245,208,111);">';
html +='           <span>'+ results[i].proveedor +'</span><br>';  
}else{
html +='       <h3 style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; background-color: #a7a7a7;">';
html +='           <span>'+ results[i].proveedor +'</span><br>';    
}
if(i<8){
html +='           <strong style="color: rgb(239,184,16);">';
html +='               <i class="fa fa-fw fa-star"></i>';
html +=                 results[i].producto;
html +='           </strong>';   
}else{
html +='           <strong >';
html +=                 results[i].producto;
html +='           </strong>'; 
}
html +='       </h3>';
html +='       <div class="mc-content">';
html +='           <div class="img-container">';
html +='               <img class="img-responsive" src="' + rutaIMG + results[i].foto + '">';
html +='           </div>';
$(document).ready(function(){  
    $(".img-responsive").on("error", function(){
          $(this).attr('src', './img/uploads/img_producto.png');
    });
});
html +='           <div class="mc-description"><strong>' + results[i].precio + '</strong> <i class="fas fa-euro-sign"></i><br>';
html +=             results[i].descripcion;
html +='           </div>';
html +='       </div>';
html +='       <div class="mc-footer">';
html +='           <h4>';
html +='               Codigo: <strong>'+ results[i].codproducto+'</strong>';
html +='           </h4>';
html +='       </div>';
html +='   </article>';
html +='</div>';
}
document.getElementById("product").innerHTML = html;
});




$(function() {
    $('.material-card > .mc-btn-action').click(function () {
        var card = $(this).parent('.material-card');
        var icon = $(this).children('i');
        icon.addClass('fa-spin-fast');

        if (card.hasClass('mc-active')) {
            card.removeClass('mc-active');

            window.setTimeout(function() {
                icon
                    .removeClass('fa-arrow-left')
                    .removeClass('fa-spin-fast')
                    .addClass('fa-bars');

            }, 800);
        } else {
            card.addClass('mc-active');

            window.setTimeout(function() {
                icon
                    .removeClass('fa-bars')
                    .removeClass('fa-spin-fast')
                    .addClass('fa-arrow-left');

            }, 800);
        }
    });
});
