
//Paginador
    var jefe = sessionStorage.getItem("idusuario");
    var total_registro = "";
    $queryString = "SELECT COUNT(*) AS total_registro FROM usuario WHERE estatus=1 and Jefe = ?";
    connection.query($queryString,[ jefe ], (err, results) => {
      if(err){
        return console.log("An error ocurred with the query", err);
      }
      total_registro = results[0].total_registro;
      sessionStorage.setItem("count_users", total_registro);
    })
//==================listar usuarios

 var list_table = "";       
$queryString = "SELECT u.idusuario, u.nombre, u.correo, u.usuario, r.rol FROM usuario u INNER JOIN rol r ON r.idrol=u.rol WHERE estatus=1 and Jefe = ? ORDER BY u.idusuario";
    connection.query($queryString,[ jefe ], (err, results) => {
      if(err){
        return console.log("An error ocurred with the query", err);
      }
       let i = "";
       
        list_table +='<table id="tblDatos">';
        list_table +='<thead>';
        list_table +='<tr>';
        list_table +='<th>ID</th>';
        list_table +='<th>Nombre</th>';
		list_table +='<th>Usuario</th>';
		list_table +='<th>Correo</th>';
        list_table +='<th>Rol</th>';
        list_table +='<th>Acciones</th>';
        list_table +='</tr>';
        list_table +='</thead>';
        list_table +='<tbody>';
       for(i=0;i<results.length;i++){       
		console.log(results[i].idusuario+" - "+ results[i].nombre +" - "+results[i].usuario +" - "+ results[i].correo +" - "+results[i].rol);
        list_table +='<tr>';
        list_table +='<td>'+ results[i].idusuario +'</td>';
        list_table +='<td>'+ results[i].nombre +'</td>';
        list_table +='<td>'+ results[i].usuario +'</td>';
        list_table +='<td>'+ results[i].correo +'</td>';
        list_table +='<td>'+ results[i].rol +'</td>';
        list_table +='<td><a class="link_edit" href="editar_usuario.php?id=$data["idusuario"]"><i class="far fa-edit"></i> Editar</a> | ';
        list_table +='<a class="link_delete" href="borrar_confirmar_usuario.php?id=$data["idusuario"]"><i class="far fa-trash-alt"></i> Borrar</a>';
        list_table +='</td>';
        list_table +='</tr>';
       }   
       list_table +='</tbody>';
       list_table +='</table>';
       list_table +='<script type="text/javascript">p.Mostrar();</script>';
       document.getElementById("table_date").innerHTML = list_table;
    });
    

 // paginador 
Paginador = function(divPaginador, tabla, tamPagina)
		{
			this.miDiv = divPaginador; //un DIV donde irán controles de paginación
			this.tabla = tabla;           //la tabla a paginar
			this.tamPagina = tamPagina; //el tamaño de la página (filas por página)
			this.pagActual = 1;         //asumiendo que se parte en página 1
			this.paginas = Math.floor((this.tabla.rows.length - 1) / this.tamPagina); //¿?
		 
			this.SetPagina = function(num)
			{
				if (num < 0 || num > this.paginas)
					return;
		 
				this.pagActual = num;
				var min = 1 + (this.pagActual - 1) * this.tamPagina;
				var max = min + this.tamPagina - 1;
		 
				for(var i = 1; i < this.tabla.rows.length; i++)
				{
					if (i < min || i > max)
						this.tabla.rows[i].style.display = 'none';
					else
						this.tabla.rows[i].style.display = '';
				}
				this.miDiv.firstChild.rows[0].cells[1].innerHTML = this.pagActual;
			}
		 
			this.Mostrar = function()
			{
				//Crear la tabla
				var tblPaginador = document.createElement('table');
		 
				//Agregar una fila a la tabla
				var fil = tblPaginador.insertRow(tblPaginador.rows.length);
		 
				//Ahora, agregar las celdas que serán los controles
				var ant = fil.insertCell(fil.cells.length);
				ant.innerHTML = '<a href="#">Anterior</a>';
				ant.className = 'pag_btn'; //con eso le asigno un estilo
				var self = this;
				ant.onclick = function()
				{
					if (self.pagActual == 1)
						return;
					self.SetPagina(self.pagActual - 1);
				}
		 
				var num = fil.insertCell(fil.cells.length);
				num.innerHTML = ''; //en rigor, aún no se el número de la página
				num.className = 'pag_num';
		 
				var sig = fil.insertCell(fil.cells.length);
				sig.innerHTML = '<a href="#">Siguiente</a>';
				sig.className = 'pag_btn';
				sig.onclick = function()
				{
					if (self.pagActual == self.paginas)
						return;
					self.SetPagina(self.pagActual + 1);
				}
		 
				//Como ya tengo mi tabla, puedo agregarla al DIV de los controles
				this.miDiv.appendChild(tblPaginador);
		 
				
				if (this.tabla.rows.length - 1 > this.paginas * this.tamPagina)
					this.paginas = this.paginas + 1;
		 
				this.SetPagina(this.pagActual);
			}
        } 
        
        
        function new_paginador() {
            var p = new Paginador(
            document.getElementById('paginador'),
            document.getElementById('tblDatos'),
            8
        );
               p.Mostrar();
        if(sessionStorage.getItem("count_users") == 0){
          document.getElementById("tblDatos").style.display = "none";
          document.getElementById("form_search").style.display = "none";
          document.getElementById("paginador").style.display = "none";
        }
    }
//sin esperar a que se cree la tabla, da error.
if(sessionStorage.getItem("count_users") !== 0){
    setTimeout("new_paginador()",100);
}

        