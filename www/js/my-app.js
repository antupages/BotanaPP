  
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
      {path: '/receta/:id/',url: 'receta.html',},//recetas por id 
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
    prinrec()
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
    misrecetasmostrar()
})

$$(document).on('page:init', '.page[data-name="receta"]', function (e , page) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    //console.log(e);
    console.log('receta cargada');
    console.log('Pag. Detalle con id: ' + page.route.params.id );
    preprece(page.route.params.id)

    
    console.log(email)
    console.log(rol)

    

    if (rol == "admin") {
        $$("#borrarreceta").removeClass('oculto').addClass('visible');
    }




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
            var user = userCredential.user;
            var usID = $$("#rEmail").val()
            var apellido = $$("#rApellido").val()
            var nombre = $$("#rNombre").val()
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
    $$("#elpaso").val("")
}

function masing() {
    var ing = $$("#eling").val()
    $$("#Cing").append(ing + " / ")
    $$("#eling").val("")
    ingredientesR += $$("#eling").val(); 
}

function Nreceta() {
    var nombrereceta =$$("#nombrereceta").val();
    var pasosCR = $$("#CrecP").text();
    var data = {
            nombre: nombrereceta,
            pasos_receta: pasosCR,
            ingredientes_receta: ingredientesR,
            creador: email,
        }
    var idreceta = nombrereceta +"-"+ email
    Refreceta.doc(idreceta).set(data)
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




function prinrec (){
    console.log("carga bd recetas");
    Refreceta.orderBy("nombre")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var linkreceta = `<div class="col-100"><a href="/receta/`+doc.id+`/">`+doc.data().nombre+`</a></div>`
            $$("#reprin").append(linkreceta);            
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


}

function preprece(id) {

    //console.log(doc.data().nombre + " - " + doc.id )
    Refreceta.doc(id).get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            $$("#Titlereceta").html(doc.data().nombre);
            $$("#ingredientes").html(doc.data().ingredientes_receta);
            $$("#creador").html(doc.data().creador);
            $$("#receta").html(doc.data().pasos_receta);
            
            if (email ==  doc.data().creador  ) {
                $$("#borrarreceta").removeClass('oculto').addClass('visible');
            }

        } else {
            console.log("No such document!");
        }
        }).catch((error) => {
        console.log("Error getting document:", error);
        });
    
    

}



function misrecetasmostrar (){
    Refreceta.where("creador", "==", email )  
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var linkreceta = `<div class="col-50"><a href="/receta/`+doc.id+`/">`+doc.data().nombre+`</a></div>`
                $$("#misrec").append(linkreceta);            
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


}




/*
        <div class="col-50"></div>
        

*/