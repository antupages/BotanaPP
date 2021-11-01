  
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
      {path: '/receta/',url: 'receta.html',},
      {path: '/masrecetas/',url: 'masrecetas.html',},
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
})

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log("inicio index")
    $$("#inic").on("click", iniciar);
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    console.log('pag registro cargada');
    $$("#registrar").on("click", autenticar)
})


// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="prin"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    //console.log(e);
    console.log('pag principal cargada');
})





$$(document).on('page:init', '.page[data-name="ingredientes"]', function (e) {
    //Do something here when page with data-name="about" attribute loaded and initialized
    //console.log(e);
    console.log('pag ingredientes cargada');

    console.log(rol)
    if (rol == "admin") {
        $$("#admincar").removeClass('oculto').addClass('visible');
    }
    $$("#admnag").on("click", Ningrediente);
})


$$(document).on('page:init', '.page[data-name="misrecetas"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    //console.log(e);
    console.log('misrecetas cargada');
})


$$(document).on('page:init', '.page[data-name="masrecetas"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    //console.log(e);
    console.log('masrecetas cargada');
    $$("#AGpaso").on("click",maspaso);
    $$("#AGing").on("click",masing);
    $$("#nueRes").on("click",Nreceta);
})



//---------------------------------------------------------------------------------------

//mis var
var email
var cont1
var cont2
var usuario
var rol
//-----
var num = 0
var receta =""
var ingrec =""
var ingredientesR
//----- 
var db = firebase.firestore()
var Refusuario = db.collection("usuarios");//referencia a usuario 
var Refingredientes = db.collection("ingrediente");//referencia a usuario 
var Refreceta = db.collection("recetas");//referencia a recetas 




//---------------------------------------------------------------------------------------

//mis fun--------------------------------------------------------------------------------

function iniciar(){
    email = $$("#iEmail").val();
    var passDelUser = $$("#iCont").val();

    firebase.auth().signInWithEmailAndPassword(email, passDelUser)
    .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    

    console.log("Bienvenid@!!! " + email );
    
    usuario = email

    //tipo usuario 
    console.log(email)
    Refusuario.doc(email).get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            rol = doc.data().rol;
            console.log(rol)
            mainView.router.navigate('/prin/');
        }else{console.error("doc no existe")}
    }
    );
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
            var usID = $$("#rEmail").val()
            var apellido = $$("#rApellido").val()
            var nombre = $$("#rNombre").val()
            //carga de datos a bd de usuarios
            var data = {
                nombre: nombre,
                apellido: apellido,
                rol: "usuario",
            };
            Refusuario.doc(usID).set(data)
            .then(function() { // .then((docRef) => {
                console.log("OK!");
            })
            .catch(function(error) { // .catch((error) => {
                console.log("Error es de db: " + error);
            });
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


//cargar recetas -----------------------------------------------------------------

function maspaso (){
    var paso = ""
    num++
    paso = $$("#elpaso").val()
    $$("#CrecP").append(num + "-  "+ paso +"<br>")
    //receta = $$('#CrecP').text();
    $$("#elpaso").val("")
    //console.log(receta)
    //los comentados hay que moverlos para cuando se cargue la reseta en la bd

}

function masing() {
    var ing = $$("#eling").val()
    $$("#Cing").append(ing + " / ")
    $$("#eling").val("")
}
function Nreceta() {
    var nombrereceta =$$("#nombrereceta").val();
    var ingredientesR = $$("Cing").text();
    var pasosCR = $$("#CrecP").text();
    var data = {
            pasos_receta: pasosCR ,
            ingredientes_receta: ingredientesR,
            creador: email,
        }

    Refreceta.doc(nombrereceta).set(data)
    .then(function() { // .then((docRef) => {
        console.log("OK!");
    })
    .catch(function(error) { // .catch((error) => {
        console.log("Error es de db: " + error);
    });
}

function Ningredieuario(){

    var ingredients = $$("#ingus").val()   
    var data = {
             ingredients: ingredinete,       
        };

    Refusuario.doc(email).set(data)
    .then(function() { // .then((docRef) => {
        console.log("OK!");
    })
    .catch(function(error) { // .catch((error) => {
        console.log("Error es de db: " + error);
    });


}









//funciones para admins ---------------------------------------------------------

function Ningrediente(){

    var ingrediente = $$("#ingds").val()
    var unidad = $$("#uni").val()
    var data = {
            unidad: unidad,
    };

    Refingredientes.doc(ingrediente).set(data)
    .then(function() { // .then((docRef) => {
        console.log("OK!");
    })
    .catch(function(error) { // .catch((error) => {
        console.log("Error es de db: " + error);
    });


}