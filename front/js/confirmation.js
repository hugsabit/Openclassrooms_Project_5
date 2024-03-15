///--------------------------------------------------------------------------------------------------------///
/// Cette page sert à gérer l'affichage de l'orderId après un passage de commande dans confirmation.html   ///
///--------------------------------------------------------------------------------------------------------///

///----------------------------------///
/// Affiche le contenue de la page   ///
///----------------------------------///

function showContent() {

    //Récupération de l'orderId
    let orderId = getOrderId();
    if (orderId) {
        //Affichage de l'orderId dans le DOM
        document.getElementById('orderId').textContent = orderId;
        //Vide le panier (localStorage)
        window.localStorage.clear();
    } else {
        //Supression du contenue de la page
        removeContentPage();
        //Affichage du message d'erreur 
        showError()
    }
    
}


///---------------------------------------///
/// Récupération de l'id de la commande   ///
///---------------------------------------///

function getOrderId() {

    //Récupération de l'orderId dans l'url
    let orderId = new URLSearchParams(window.location.search).get('orderId');
    //Retour de l'orderId
    return orderId;
}


///-----------------------------------------------------///
/// Suppréssion du contenue de la page en cas d'erreur  ///
///-----------------------------------------------------///

function removeContentPage() {

    //Récupération du pointeur pour la suppréssion
    const pageElement = document.getElementsByClassName('confirmation');
    for (let i = 0; i < pageElement.length; i++) {
        const element = pageElement[i];
        //Suppression de chaque éléments de la page
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };
};


///-----------------------------------------------------------///
/// Affichage du message d'erreur en cas d'orderId invalide   ///
///-----------------------------------------------------------///

function showError() {

    //Implementation du message d'erreur
    document.getElementsByClassName('confirmation')[0].innerHTML += 
    `
    <p>Aucune commande n'a été validée.<br>Veuillez consulter la page <a href='./cart.html'>Panier</a></p>
    `;
}


///------------------------------------///
/// Appel de la fonction d'affichage   ///
///------------------------------------///

showContent();