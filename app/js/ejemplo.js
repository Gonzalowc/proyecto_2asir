var $ = require("jquery");
var dt = require("datatables.net")(window, $);
/*<img src='http://drive.google.com/uc?export=view&id=' + codigo alt="Usuario"'/>*/

/* var urlsplit = ul.split('/');
var i="";

console.log(urlsplit[5]); */

/* img +='<img href="'+result+'"/>'; */

var ul = "";
ul =
  "https://drive.google.com/file/d/1rkchvTHbgzHlZnV21mZQvHo223RmlLJV/view?usp=sharing";
result = ul.replace(
  /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g,
  "https://drive.google.com/uc?export=view&id=$1"
);
console.log("result: " + result);
var htmlimg = "";
htmlimg += '<img src="' + result + '"/>';
htmlimg += '<img src="' + result + '"/>';
htmlimg += '<img src="' + result + '"/>';
htmlimg += '<img src="' + result + '"/>';
htmlimg += '<img src="' + result + '"/>';

document.getElementById("imagene").innerHTML = htmlimg;
