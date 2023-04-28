
if(selectedAnswerIndex == correctAnswerIndex){
    lanzarAlerta.setText("Incorrecto","success")
    score++
}else{
    lanzarAlerta.setText("Incorrecto","info")
    score++
}

function lanzarAlerta(titulo, icon){
    Swal.fire({
        title: titulo,        
        icon: icon,
        //confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1500
      })
}