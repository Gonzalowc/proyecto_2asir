const bodyLogin = document.querySelector('#bodyLogin');
bodyLogin.classList.remove('opacity0');
bodyLogin.classList.add('opacity1');

function layoutIni(){
    const divEmail = document.querySelector('#divEmail');
    divEmail.classList.add('layoutActive');
}
//1s appear 
setTimeout(layoutIni,1000);

// next button functions
document.querySelector('#btnNextPass').onclick = function(){
    const emailUser = document.querySelector('#emailUser').value;
    const alertEmailLogin = document.querySelector('#alertEmailLogin');
    const spanEmail = document.querySelector('#spanEmail');
    const emailValid = fntEmailValidate(emailUser);
    if(!emailValid){
        alertEmailLogin.innerHTML = '<p style="color: red;"> Escribe una dirección de correo electrónico</p>';
        alertEmailLogin.style.display = 'block';
    }else{
        alertEmailLogin.style.display = 'none';
        spanEmail.innerHTML = emailUser;
        nextLayout('#divEmail','#divPassword');
    }
}
//Init session
document.querySelector('#emailUser').onkeyup = function(){
    const emailUser = document.querySelector('#emailUser').value;
    const alertEmailLogin = document.querySelector('#alertEmailLogin');
    const emailValid = fntEmailValidate(emailUser);

    if(!emailValid){
        alertEmailLogin.innerHTML = '<p style="color: red;"> Escribe una dirección de correo electrónico</p>';
        alertEmailLogin.style.display = 'block';
    }else{
        alertEmailLogin.style.display = 'none';
    }
}

document.querySelector('#btnPrev').onclick = function(){
    prevLayout('#divPassword', '#divEmail');
}

document.querySelector('#linkCreateAccount').onclick = function(e){
    e.preventDefault();
    nextLayout('#divEmail', '#divRegister');
}

document.querySelector('#btnNextEmail').onclick = function(){
    prevLayout('#divRegister', '#divEmail');
}

document.querySelector('#linkRecoveryPass').onclick = function(e){
    e.preventDefault();
    nextLayout('#divPassword', '#divRecoveryPass');
}
document.querySelector('#btnCancelar').onclick = function(){
    prevLayout('#divRecoveryPass', '#divPassword');
}

document.querySelector('#btnSendEmail').onclick = function(){
    const sendEmail = document.querySelector('#sendEmail').value;
    const alertSendEmail = document.querySelector('#alertSendEmail');
    const emailValid = fntEmailValidate(sendEmail);

    if(!emailValid){
        alertSendEmail.innerHTML = '<p style="color: red;"> Escriba su cuenta de correo.</p>';
        alertSendEmail.style.display = 'block';
    }else{
        alertSendEmail.style.display = 'none';
        alert("Enviar email a "+ sendEmail);
    }
}
document.querySelector('#sendEmail').onkeyup = function(){
    const sendEmail = document.querySelector('#sendEmail').value;
    const alertSendEmail = document.querySelector('#alertSendEmail');
    const emailValid = fntEmailValidate(sendEmail);

    if(!emailValid){
        alertSendEmail.innerHTML = '<p style="color: red;"> Escriba su cuenta de correo.</p>';
        alertSendEmail.style.display = 'block';
    }else{
        alertSendEmail.style.display = 'none';
    }
}
function nextLayout(parent, next){
    const divParent = document.querySelector(parent);
    const divNext = document.querySelector(next);
    divParent.classList.remove('layoutLeft', 'layoutRight', 'layoutActive');
    divNext.classList.remove('layoutLeft', 'layoutRight', 'layoutActive');

    divParent.classList.toggle('layoutLeft');
    divNext.classList.toggle('layoutActive');
}
function prevLayout(parent, prev){
    const divParent = document.querySelector(parent);
    const divPrev = document.querySelector(prev);
    divParent.classList.remove('layoutLeft', 'layoutRight', 'layoutActive');
    divPrev.classList.remove('layoutLeft', 'layoutRight', 'layoutActive');

    divParent.classList.toggle('layoutRight');
    divPrev.classList.toggle('layoutActive');
}
//validate Email
function fntEmailValidate(email){
    const stringEmail = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/);
    if(stringEmail.test(email) == false){
        return false;
    }else{
        return true;
    }
}