/* const sqlite3 = require('sqlite3').verbose();

// Open database
let db = new sqlite3.Database('./app/db/facture.db', sqlite3.OPEN_READWRITE , (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('connect to the in-memory SQLite database.');
});
 */
/* db.serialize(() => {
    db.each('select * from cliente', (err, row) => {
        if(err) {
            console.error(err.message);
        }
        const newLocal = "\t";
        console.log(row.idcliente + 
            "\n" + row.DNI +
            "\n" + row.nombre +
            "\n" + row.telefono +
            "\n" + row.direccion +
            "\n" + row.usuario_id )
    })
}) */


