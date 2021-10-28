  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {path: '/index/',url: 'index.html',},
      {path: '/prin/',url: 'prin.html',},
      {path: '/misrecetas/',url: 'misrecetas.html',},
      {path: '/ingredientes/',url: 'ingredientes.html',},
      {path: '/perfil/',url: 'perfil.html',},
      {path: '/recetas/',url: 'recetas.html',},
      {path: '/CARrecetas/',url: 'CARrecetas.html',},
      {path: '/registro/',url: 'registro.html',},
      
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})



$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log("inicio index")
    $$("#inic").on("click", iniciar);
    $$("#pasr").on("click", pasreg);
})


// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="prin"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    console.log('pag principal cargada');
    //capasidad()
})




// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    console.log('pag registro cargada');
    $$("#registrar").on("click", autenticar)
    $$("#registrar").on("click", regbd)
})

$$(document).on('page:init', '.page[data-name="ingredientes"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    console.log('pag ingredientes cargada');
    admcar()
})



//---------------------------------------------------------------------------------------

//mis var
var email
var cont1
var cont2
var usuario
var status
var db = firebase.firestore()
var Refusuario = db.collection("usuarios").doc("usID");//referencia a usuario 

//---------------------------------------------------------------------------------------

//mis fun

function iniciar(){
        // cada un@ pone su magia para recuperar el mail y la clave de un form...
    var emailDelUser = $$("#iEmail").val();
    var passDelUser = $$("#iCont").val();

    firebase.auth().signInWithEmailAndPassword(emailDelUser, passDelUser)
    .then((userCredential) => {
    // Signed in
    var user = userCredential.user;

    console.log("Bienvenid@!!! " + emailDelUser);
    mainView.router.navigate('/prin/');
    usuario = emailDelUser
    // ...
    })
    .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.error(errorCode);
        console.error(errorMessage);
        $$("#Eing").html(errorMessage);
    });

}


function pasreg(){
    mainView.router.navigate('/registro/');

}


function autenticar(){
    email = $$("#rEmail").val();
    cont1 = $$("#c1").val();
    cont2 = $$("#c2").val();


    if (cont1==cont2) {
        console.log("contraseñas validas")
        password = cont1 
    
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            //console.log("usuario creado email:"email+" id:"userCredential )
            // ...
        })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("error"+ errorMessage);
        // ..
      });
    mainView.router.navigate('/index/');
    }else   {
        $$("#diferen").html("las contraseñas no coinciden")
    }
}



// base de datos 

function regbd() {
//var datos usuario    
    var usID = $$("#rEmail").val()
    var apellido = $$("#rApellido").val()
    var nombre = $$("#rNombre").val()

//carga de datos a bd de usuarios
    var data = {
            nombre: nombre,
            apellido: apellido,
            rol: "usuario",
    };

    //db.collection("usuarios").add(data)
    //db.collection("usuarios").doc(usID).set(data)
    db.collection("usuarios").doc(usID).set(data)
    .then(function() { // .then((docRef) => {
    console.log("OK!");
    })
    .catch(function(error) { // .catch((error) => {
    console.log("Error es de db: " + error);
    });
}


//funciones para admins 
function admcar(){
if (status == "admin") {
    $$("#admincar").removeClass('oculto').addClass('visible');
}
}


/*

function capasidad() {
Refusuario.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

} */