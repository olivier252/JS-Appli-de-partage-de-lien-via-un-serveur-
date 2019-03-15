
var listeLiens = [
    {
        titre: "So Foot",
        url: "http://sofoot.com",
        auteur: "yann.usaille"
    },
    {
        titre: "Guide d'autodéfense numérique",
        url: "http://guide.boum.org",
        auteur: "paulochon"
    }
    
];
//-------------------------------------------------------------------ACTIVITE 1----------------------------------------------------------------

function creerElementLien(lien) {
    var titreLien = document.createElement("a");
    titreLien.href = lien.url;
    titreLien.style.color = "#428bca";
    titreLien.style.textDecoration = "none";
    titreLien.style.marginRight = "5px";
    titreLien.appendChild(document.createTextNode(lien.titre));

    var urlLien = document.createElement("span");
    urlLien.appendChild(document.createTextNode(lien.url));

// Cette ligne contient le titre et l'URL du lien
    var ligneTitre = document.createElement("h4");
    ligneTitre.style.margin = "0px";
    ligneTitre.appendChild(titreLien);
    ligneTitre.appendChild(urlLien);

// Cette ligne contient l'auteur
    var ligneDetails = document.createElement("span");
    ligneDetails.appendChild(document.createTextNode("Ajouté par " + lien.auteur));

    var divLien = document.createElement("div");
    divLien.classList.add("lien");
    divLien.appendChild(ligneTitre);
    divLien.appendChild(ligneDetails);

    return divLien;
}
 var contenu = document.getElementById("contenu");

// Parcours de la liste des liens et ajout d'un élément au DOM pour chaque lien
listeLiens.forEach(function (lien) {
    var elementLien = creerElementLien(lien);
    contenu.appendChild(elementLien);
});
//-------------------------------------------------------------------ACTIVITE 2----------------------------------------------------------------
// Création d'une <div> qui va contenir le bouton qui génère le formulaire
var divButtonElt = document.createElement("div");
var buttonLienElt = document.createElement("button");
buttonLienElt.textContent = "Ajouter un lien";
divButtonElt.appendChild(buttonLienElt);
document.querySelector("h1").appendChild(divButtonElt);

// On crée une fonction pour créer les <input> nom, lien, url
function creerInputElt(placeholder, id) {
    var inputElt = document.createElement("input");
    inputElt.setAttribute("type", "text");
    inputElt.setAttribute("required" , "required");
    inputElt.setAttribute("placeholder", placeholder);
    inputElt.style.marginRight = "20px";// Les valeurs CSS sont arbitraires pas de précisions de la part d'OCR 

    return inputElt;
}

//Création des éléments du formulaire
var formuElt = document.createElement("form");
var champNomElt = creerInputElt("Entrez votre nom", "auteur");
var champTitreLienElt = creerInputElt("Entrez le titre du lien", "titre");
var champUrlElt = creerInputElt("Entrez l'URL du lien", "url");

//Création bouton d'envoi du formulaire
var buttonAjoutElt = document.createElement("button");
buttonAjoutElt.textContent = "Ajouter";
        
//Evenement de type "click" qui génère le formulaire
buttonLienElt.addEventListener("click", function (){
    divButtonElt.innerHTML = "";

    formuElt.appendChild(champNomElt);
    formuElt.appendChild(champTitreLienElt);
    formuElt.appendChild(champUrlElt);
    formuElt.appendChild(buttonAjoutElt);
    divButtonElt.appendChild(formuElt);
});

var emptyLink = {
    titre: "",
    url: "",
    auteur: ""
};

//------------------------------------------------------------------------BLOC CODE ACTIVITE  3 LIGNES 99 A 118 ---------------------------------------------------------------------
ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", function(reponse) {
    var serverLinks = JSON.parse(reponse);

        var lastServerLink = Object.create(emptyLink);
        lastServerLink.titre = serverLinks[0].titre;
        lastServerLink.url = serverLinks[0].url;
        lastServerLink.auteur = serverLinks[0].auteur;
        var newLastlink = creerElementLien(lastServerLink);
        var divElt =  document.getElementsByClassName("lien");
        var firstDivElt = divElt[0];
        contenu.insertBefore(newLastlink, divElt[0]);
});  
/*Le bloc de code qui suit fonctionne et permet de récupérer TOUS LES LIENS du serveur (il faut alors effacer le bloc de code ci-dessus 102 à 110), 
mais la démonstration de l'exercice montre UN SEUL LIEN de récupéré ????????????
    for (var i = 0; i < serverLinks.length; i++) {
        var lastServerLink = Object.create(emptyLink);
        lastServerLink.titre = serverLinks[i].titre;
        lastServerLink.url = serverLinks[i].url;
        lastServerLink.auteur = serverLinks[i].auteur;
        var newLastlink = creerElementLien(lastServerLink);
        contenu.appendChild(newLastlink);
    }
 }); 
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Gestionnaire de type "submit" qui transfère les données saisies par l'utilisateur dans la <div id = "contenu">
formuElt.addEventListener("submit", function(e){
//On teste si le lien contient la chaine de caractères "http://" puis on l'envoie dans un objet tableau si c'est le cas
if(champUrlElt.value.indexOf("http://") === -1 && champUrlElt.value.indexOf("https://") === -1) {
    champUrlElt.value = "http://" + champUrlElt.value;
}
// Création d'un objet lien vide pour récupérer le lien du serveur
var addNewLink = {
    auteur: champNomElt.value,
    titre: champTitreLienElt.value,
    url: champUrlElt.value
};

//------------------------------------------------------------------------BLOC CODE ACTIVITE 3 partir de la ligne 137 ---------------------------------------------------------------------
// Création requête ajaxGet(), le but est de récupérer le dernier lien du serveur    
ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien",
    addNewLink, function(reponse){

//Insertion du lien saisi par l'utilisateur en première position dans la <div id = "contenu">       
    listeLiens.push(addNewLink);
    var ajoutDomLienElt = creerElementLien(addNewLink);
    var divElt =  document.getElementsByClassName("lien");
    var firstDivElt = divElt[0];
    contenu.insertBefore(ajoutDomLienElt, divElt[0]);

//Apparition du message d'ajout du lien pendant 2 secondes : pas de précisions une fois de plus au niveu du CSS de ce message de la part d'OCR ?
    var messageDivLienElt = document.createElement("div"); 
    var messageParaLienElt = document.createElement("span");
    messageParaLienElt.classList.add("span")
    messageDivLienElt.classList.add("lien");
    messageDivLienElt.style.backgroundColor = "#428bca"; //Ajout d'un background dans les tons bleus

    messageParaLienElt.textContent = "Le lien \"" + champTitreLienElt.value + "\" a bien été ajouté.";
    messageDivLienElt.appendChild(messageParaLienElt);

    document.querySelector("h1").insertBefore(messageDivLienElt, divButtonElt);
    divButtonElt.removeChild(formuElt);
    divButtonElt.appendChild(buttonLienElt);

    champNomElt.value = "";
    champTitreLienElt.value = "";
    champUrlElt.value = "";

    function resetForm(){;
    document.querySelector("h1").removeChild(messageDivLienElt);             
    }
    setTimeout(resetForm, 2000);
},
true);
e.preventDefault();
});