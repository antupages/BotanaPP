  
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
})




// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    console.log('pag registro cargada');
    $$("#registrar").on("click", autenticar)
})




//---------------------------------------------------------------------------------------

//mis var
var email
var cont1
var cont2

//--------------------------------------------------------------------------------------

//mis fun
function iniciar(){
    mainView.router.navigate('/prin/');

}
function pasreg(){
    mainView.router.navigate('/registro/');

}
function autenticar(){
    email = $$("#rEmail").value()
    cont1 = $$("#c1").value()
    cont2 = $$("#c2").value()


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
    
    }
    mainView.router.navigate('/index/');
}