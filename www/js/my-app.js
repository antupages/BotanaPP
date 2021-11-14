  
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

    searchbar = app.searchbar.create({
        el: '.searchbar',
        searchContainer: '.list',
        searchIn: '.item-title',
        on: {
            search(sb, query, previousQuery) {
            console.log(query, previousQuery);
            }
        }
    })



})


$$(document).on('page:init', '.page[data-name="ingredientes"]', function (e) {
    //Do something here when page with data-name="about" attribute loaded and initialized
    //console.log(e);
    console.log('pag ingredientes cargada');
    ingususec()
    $$("#ingreusu").on("click", usuariocargaringrediente)
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
    console.log('Pag. Detalle con id: ' + page.route.params.id );
    preprece(page.route.params.id)  
    $$("#borrarreceta").on("click", function (){
        borrarrecetaBD(page.route.params.id)}) 
    console.log(email)
    console.log(rol)
    if (rol == "admin") {
        $$("#borrarreceta").removeClass('oculto').addClass('visible');
    }
})


$$(document).on('page:init', '.page[data-name="masrecetas"]', function (e) {
    console.log('masrecetas cargada');
    $$("#AGpaso").on("click", maspaso);
    $$("#nueRes").on("click", Nreceta);
    ingrecar()

})

//mis var---------------------------------------------------------------------------------


var email
var cont1
var cont2
var usuario
var num = 0
var rol
var receta =""
var ingredientesquetieneelusuario = ""
var ingrec =""
var ingredientesR =""
var pasoCR =""
var db = firebase.firestore()
var Refusuario = db.collection("usuarios");//referencia a usuario 
var Refingredientes = db.collection("ingrediente");//referencia a usuario 
var Refreceta = db.collection("recetas");//referencia a recetas 

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

function maspaso (){
    var paso = "" 
    num++
    paso = $$("#elpaso").val()
    pasoCR +=  num + "- " + $$("#elpaso").val() + "</br>"
    $$("#CrecP").append(num + "-  "+ paso +"<br>")
    $$("#elpaso").val("")
}

function Nreceta() {
    var nombrereceta =$$("#nombrereceta").val();
    var ingredientesR = app.smartSelect.get('.smart-select').$selectEl.val();
    var data = {
            nombre: nombrereceta,
            pasos_receta: pasoCR,
            ingredientes_receta: ingredientesR,
            creador: email,
        }
    var idreceta = nombrereceta +"-"+ email
    console.log(data , idreceta)
    Refreceta.doc(idreceta).set(data)
    .then(function() { // .then((docRef) => {
        console.log("OK!");
    })
    .catch(function(error) { // .catch((error) => {
        console.log("Error es de db: " + error);
    });
    num = 0
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
    //aca vamos a conseguir los ingredientes que tiene el usuario 
    

    Refusuario.doc(email).get("ingredientesusuario").then((doc) => {
        if (doc.exists) {    
            ingredientesquetieneelusuario = doc.data().ingredientesusuario
            console.log("VOS TNES ESTOS INGREDIENTES:",  ingredientesquetieneelusuario );

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    
    Refreceta.orderBy("nombre")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var contador = 0 
            var porcen 
            var ingrecetabuscar = doc.data().ingredientes_receta
            

            /* como alito me lo mostro thenx alito :D
            ingrecetabuscar.map((ingrediente)=>{
                console.log(ingrediente)
                for (var i = 0 ; ingredientesquetieneelusuario.length > i ; i++) {
                    if (ingrediente ==ingredientesquetieneelusuario[i] ) {
                        contador++
                    }
                }
            })
            */
        
            for (var i = 0  ; ingrecetabuscar.length > i; i++) {
                var pos1 = ingrecetabuscar[i]
                for (var j = 0  ; ingredientesquetieneelusuario.length >= j ; j++) {
                    var pos2 = ingredientesquetieneelusuario[j]
                    if (pos1 == pos2) {
                        contador++
                    }
                }
            }

            porcen = 100 * contador / ingrecetabuscar.length
            console.log(doc.data().nombre +" - " + porcen + "% ingredientes q tenes para la receta")
            var linkreceta =`<li class="item-content">
                                <div class="item-inner">
                                    <div class="item-title">
                                        <div class="col-80 double"><a href="/receta/`+doc.id+`/">`+doc.data().nombre+`</a></div>
                                        <div class="col-20">%`+ porcen +`</div>
                                    </div>
                                </div>
                            </li>`
            $$("#reprin").append(linkreceta);            
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

function preprece(id) {
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
        }else {
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
            var linkreceta = `<div class="col-100 double"><a href="/receta/`+doc.id+`/">`+doc.data().nombre+`</a></div>`
                $$("#misrec").append(linkreceta);            
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

function ingususec(){
    var listingrerec = ""
    var arrayingrediente =[]
    Refingredientes.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id);
            sapandanga = doc.id
            sapandanga = sapandanga.toUpperCase()
            arrayingrediente.push(sapandanga)
                                      
        });
        arrayingrediente.sort()
        for (var i = 0 ; i < arrayingrediente.length ; i++) {
            listingrerec += `<option value="`+arrayingrediente[i]+`">`+arrayingrediente[i]+`</option>`
        
        }
        $$("#ingrediesusu").append(listingrerec); 
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

}



function ingrecar (){
    var listingrerec = ""
    var arrayingrediente =[]
    Refingredientes.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id);
            sapandanga = doc.id
            sapandanga = sapandanga.toUpperCase()
            arrayingrediente.push(sapandanga)
                                      
        });

        arrayingrediente.sort()
        for (var i = 0 ; i < arrayingrediente.length ; i++) {
            listingrerec += `<option value="`+arrayingrediente[i]+`">`+arrayingrediente[i]+`</option>`

        }

        $$("#ingrediesmasrec").append(listingrerec); 
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}


function usuariocargaringrediente(){

var ingredientesusuario = app.smartSelect.get('.smart-select').$selectEl.val();
    return Refusuario.doc(email).update({
        ingredientesusuario: ingredientesusuario
    })
    .then(() => {
        console.log("guardados tus ingredientes");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

}

function borrarrecetaBD(id) {
    Refreceta.doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

//ingredientesqtengo id para escribir los ingredientes que tengo 