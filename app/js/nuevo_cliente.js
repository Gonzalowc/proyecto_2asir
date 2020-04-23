const btnEnviar = document.querySelector("#btnEnviar");
const inputFile = document.querySelector("#inputFile");

btnEnviar.addEventListener("click", () => {
    if (inputFile.files.length > 0) {
        let formData = new FormData();
        formData.append("archivo", inputFile.files[0]); // En la posición 0; es decir, el primer elemento
        fetch("http://localhost/proyecto/index.php", {
            method: 'POST',
            body: formData,
        })
            .then(respuesta => respuesta.text())
            .then(decodificado => {
                console.log(decodificado);
            });
    } else {
        // El usuario no ha seleccionado archivos
        alert("Selecciona un archivo");
    }
});