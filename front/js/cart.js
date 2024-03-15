///-----------------------------------------------------------------------------------------------------------------///
/// Cette page sert à gérer l'affichage du panier dans la page cart.html et ecoute la confirmation de la commande   ///
///-----------------------------------------------------------------------------------------------------------------///

///--------------------------------------------------------///
/// Suppréssion du Produit dans le panier (localStorage)   ///
///--------------------------------------------------------///

function removeProductCart(productId, productColor) {

    //Récupération du panier
    let cart = getCart();
    //Suppréssion du produit donnée
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == productId && cart[i].color == productColor) {
            cart.splice(i, 1);
        }
    };
    //Sauvegarde du panier
    saveCart(cart);
};


///-----------------------------------------------------///
/// Récupération du contenue du panier (localStorage)   ///
///-----------------------------------------------------///

function getCart() {

    let cart = localStorage.getItem('cart');
    if (cart != undefined) {
        return JSON.parse(cart);
    } else {
        return [];
    };
};


///---------------------------------------///
/// Savaugarde du panier (localStorage)   ///
///---------------------------------------///

function saveCart(cart) {

    localStorage.setItem('cart', JSON.stringify(cart));
};


///-----------------------------///
/// Récupération des Produits   ///
///-----------------------------///

function getProducts() {

    fetch('http://127.0.0.1:3000/api/products')
        //Transformation des donées au format JSON
        .then(res => res.json())
        //Appel de la fonction d'affichage des données correspondantent au panier
        .then(res => {showMatchCart(res)})
    .catch((error) => {
        //affichage de l'erreur dans la console
        console.error('Erreur lors de la récupération des produits : ', error);
        //Appel de la fonction d'affichage de l'erreur dans le DOM
        showError(error);
    });
};


///----------------------------------------------------------------------///
/// Affichage des produits correspondant à ceux présent dans le panier   ///
///----------------------------------------------------------------------///

function showMatchCart(products) {

    //Récupération du panier
    let cart = getCart();
    if (cart.length > 0) {
        //Parcour de la liste des produits du catalogue
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            //Parcour de la liste des produits du panier
            for (let i = 0; i < cart.length; i++) {
                const productCart = cart[i];
                if (product._id == productCart.id ) {
                    //Parcour de la liste des produits d'une certaine couleur du catalogue
                    for (let i = 0; i < product.colors.length; i++) {
                        const color = product.colors[i];
                        //Affichage de l'artcle dans le DOM
                        if (color == productCart.color) {
                            document.getElementById('cart__items').innerHTML += 
                            `
                            <article class="cart__item" data-id="${product._id}" data-color="${color}">
                                <div class="cart__item__img">
                                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                                </div>
                                <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                        <h2>${product.name}</h2>
                                        <p>${color}</p>
                                        <p>${product.price} €</p>
                                    </div>
                                    <div class="cart__item__content__settings">
                                        <div class="cart__item__content__settings__quantity">
                                            <p>Qté : ${productCart.quantity}</p>
                                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productCart.quantity}">
                                        </div>
                                        <div class="cart__item__content__settings__delete">
                                            <p class="deleteItem">Supprimer</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                            `;
                        };
                    };
                };
            };
        };
        //Récupération du nombre total d'articles
        let totalArticles = getTotalArticles();
        //Récupération du prix total du panier
        let totalPrice = getTotalPrice(products);
        //Formatage du nombre total d'articles
        let totalArticlesFormated = numberFormat(totalArticles);
        //Formatage du prix total du panier
        let totalPriceFormated = numberFormat(totalPrice);
        //Affichage du nombre total d'articles
        document.getElementById('totalQuantity').innerHTML += totalArticlesFormated;
        //Affichage du prix total du panier
        document.getElementById('totalPrice').innerHTML += totalPriceFormated;
        //Ecoute de la modification du nombre d'un article
        listenCartQuantity();
        //Ecoute de la supréssion d'un article
        listenCartRemove();
    } else {
        showEmptyCart();
    };
};


///------------------------------------------------------------///
/// Affichage du message d'erreur un cas de fetch non réussit  ///
///------------------------------------------------------------///

function showError(error) {
    
    //Supprésion des éléments de la page
    removeContentPage();
    //Insertion des éléments de l'erreur et de rafraichissement
    const pageElement = document.getElementsByClassName('cartAndFormContainer');
    pageElement[0].style.flexDirection = 'column';
    pageElement[0].innerHTML +=
    `
    <h1>Erreur lors de la comunication avec le serveur : <br>${error}</h1>
    <a href='./cart.html' style='display: flex;justify-content: center;font-size: 22px;border-radius: 40px;border: 0;background-color: #2c3e50;color: white;padding: 18px 28px;cursor: pointer;margin: 40px auto;width: fit-content;'>Raffraichir</a>
    `;
};


///--------------------------------------///
/// Affichage du message de panier vide  ///
///--------------------------------------///

function showEmptyCart() {
    
    //Supprésion des éléments de la page
    removeContentPage();
    //Insertion des éléments de l'erreur et de rafraichissement
    const pageElement = document.getElementsByClassName('cartAndFormContainer');
    pageElement[0].innerHTML +=
    `
    <h1>Votre panier est vide !</h1>
    <a href='./index.html' style='display: flex;justify-content: center;font-size: 22px;border-radius: 40px;border: 0;background-color: #2c3e50;color: white;padding: 18px 28px;cursor: pointer;margin: 40px auto;width: fit-content;'>Retour à la page des produits</a>
    `;
};


///-----------------------------------------------------///
/// Suppréssion du contenue de la page en cas d'erreur  ///
///-----------------------------------------------------///

function removeContentPage() {

    //Récupération du pointeur pour la suppréssion
    const pageElement = document.getElementsByClassName('cartAndFormContainer');
    for (let i = 0; i < pageElement.length; i++) {
        const element = pageElement[i];
        //Suppression de chaque éléments de la page
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };
};


///---------------------------------------------------///
/// Retour du nombre total d'articles dans le panier  ///
///---------------------------------------------------///

function getTotalArticles() {

    //Récupération du panier
    const cart = getCart();
    //Initialisation du nombre de produit
    let productQuantity = 0;
    //Parcour des produits et mise en mémoire du nombre
    for (const product of cart) {
        productQuantity += product.quantity;
    };
    //Retour nombre total
    return productQuantity;
};


///---------------------------------------------------///
/// Retour du prix total des articles dans le panier  ///
///---------------------------------------------------///

function getTotalPrice(products) {

    //Récupération du panier
    const cart = getCart();
    //Initialisation du prix total du panier
    let productPrice = 0;
    //Parcour du catalogue et du panier et ajout du prix en mémoire
    for (const product of products) {
        for (const item of cart) {
            if (product._id == item.id) {
                for (const color of product.colors) {
                    if (color == item.color) {
                        productPrice += product.price * item.quantity;
                    };
                };
            };
        };
    };
    //Retour du prix total
    return productPrice;
};


///---------------------------------------------------------------------///
/// Formate l'affichage du nombre avec un espace tout les 3 caractères  ///
///---------------------------------------------------------------------///

function numberFormat(number) {

    //Initialisation du nombre
    let nombre = '' + number;
    //Initialisation du retour du nombre
    let retour = '';
    //Initialisation du compteur du nombre
    let count = 0;
    //Compte de la position du nombre et ajout espace si modulo 3
    for(let i = nombre.length-1 ; i >= 0 ; i--) {
        if(count!=0 && count % 3 == 0){
            retour = nombre[i] + ' ' + retour ;
        } else {
            retour = nombre[i] + retour ;
        };
        count++;
    };
    //Retour du nombre formaté
    return retour;
};


///----------------------------------------------------------------///
/// Ecoute l'input du nombre d'articles de chaque produit affiché  ///
///----------------------------------------------------------------///

function listenCartQuantity() {

    //Initilation du pointeur
    const modifyQuantityInputList = document.getElementsByClassName('itemQuantity');
    //Parcours de tous les éléments pointés
    for (let i = 0; i < modifyQuantityInputList.length; i++) {
        const modifyQuantityInput = modifyQuantityInputList[i];
        
        //Ecoute des inputs de quantité
        modifyQuantityInput.addEventListener('change', () => {
            if (modifyQuantity(modifyQuantityInput.closest("article.cart__item").dataset['id'], modifyQuantityInput.closest("article.cart__item").dataset['color'], modifyQuantityInput.value)) {
                location.reload();
            };
        });
    };
};


///--------------------------------------------------------///
/// Modifie la quantité d'un produit donné dans le panier  ///
///--------------------------------------------------------///

function modifyQuantity(productId, productColor, quantity) {

    //Récupération du panier
    let cart = getCart();
    //Parcours du panier et modification de la quantitée si conditions respectées
    for (const item of cart) {
        if (item.id == productId && item.color == productColor) {
            if (parseFloat(quantity) > 0 && parseFloat(quantity) <= 100) {
                item.quantity = parseFloat(quantity);
                saveCart(cart);
                return true;
            } else if (parseFloat(quantity) <= 0) {
                removeProductCart(productId, productColor);
                return true;
            } else {
                console.log('La quantitée du produit ne peut être suppérieur à 100 unitées.');
                return false;
            };
        };
    };
};


///-----------------------------------------------------------------------------------///
/// Ecoute la balise <p class="deleteItem">Supprimer</p> de chaque article du panier  ///
///-----------------------------------------------------------------------------------///

function listenCartRemove() {

    //Initialisation du pointeur
    const deleteInputList = document.getElementsByClassName('deleteItem');
    //Parcours des éléments détectés
    for (let i = 0; i < deleteInputList.length; i++) {
        const deleteInput = deleteInputList[i];
        //Ajout d'écoute du click sur l'élément et supréssion si confirmation
        deleteInput.addEventListener('click', () => {
            if (window.confirm("Vous êtes sur le point de supprimer cet élement du panier, êtes vous sûr ?")) {
                removeProductCart(deleteInput.closest("article.cart__item").dataset['id'], deleteInput.closest("article.cart__item").dataset['color']);
                location.reload();
            };
        });
    };
};


///-----------------------------------------------------------///
/// Ecoute de l'envoie du formulaire de validation du panier  ///
///-----------------------------------------------------------///

document.addEventListener("DOMContentLoaded", () => {

    let form = document.querySelector('.cart__order__form');
    form.addEventListener("submit", (event) => {
        let cart = getCart();
        let isValid = true;
        let fields = [
            { id: 'firstName', errorMsgId: 'firstNameErrorMsg', fieldName: 'Prénom', value: '' },
            { id: 'lastName', errorMsgId: 'lastNameErrorMsg', fieldName: 'Nom', value: '' },
            { id: 'address', errorMsgId: 'addressErrorMsg', fieldName: 'Adresse', value: '' },
            { id: 'city', errorMsgId: 'cityErrorMsg', fieldName: 'Ville', value: '' },
            { id: 'email', errorMsgId: 'emailErrorMsg', fieldName: 'Email', value: '' }
        ];
        fields.forEach((field) => {
            field.value = document.getElementById(field.id).value;
            let errorMsg = document.getElementById(field.errorMsgId);
            switch (true) {
                case (field.value.trim() === ''):
                    errorMsg.textContent = 'Veuillez entrer votre ' + field.fieldName;
                    isValid = false;
                    break;
                case (field.id === 'email' && !isValidEmail(field.value)):
                    errorMsg.textContent = 'Veuillez entrer une adresse email valide';
                    isValid = false;
                    break;
                case ((field.id === 'firstName' || field.id === 'lastName') && containsNumbers(field.value)):
                    errorMsg.textContent = 'Le champ ' + field.fieldName + ' ne doit pas contenir de chiffres';
                    isValid = false;
                    break;
                default:
                    errorMsg.textContent = '';
                    break;
            }
        });
        if (isValid && cart.length > 0) {
            const contactForm = newContactObjet(fields);
            sendCommand(contactForm);
        } else if (cart.length <= 0) {
            alert('Vous ne pouvez confirmer la commande. Votre panier ne doit pas vide!');
        }
        event.preventDefault();
    });
});


///--------------------------------------------------///
/// Création de l'objet de Contact pour la commande  ///
///--------------------------------------------------///

function newContactObjet() {

    //Création du pointeur des valeur
    const form = document.querySelector('.cart__order__form');
    //Mise en forme d'objet des valeurs
    const contactForm = {
        contact: {
			firstName: form.firstName.value,
			lastName: form.lastName.value,
			address: form.address.value,
			city: form.city.value,
			email: form.email.value,
        },
        products : listIds()
    };
    //Retour de l'objet
    return contactForm;
};


///--------------------------------------------------------------///
/// Création de la liste des Ids pour le passage de la commande  ///
///--------------------------------------------------------------///

function listIds() {
    
    //Récupération du panier
    let cart = getCart();
    //Création du tableau des ids
	let ids = [];
    //Ajout de chaque id du panier dans le tableau
    for (let i = 0; i < cart.length; i++) {
        ids.push(cart[i].id)
    };
    //Retour du tableau d'ids
	return ids;
};


///--------------------------------------------------///
/// Passage de la commande auprès du serveur Nodejs  ///
///--------------------------------------------------///

async function sendCommand(contactForm) {

    await fetch('http://127.0.0.1:3000/api/products/order', {
        method: 'POST',
        body: JSON.stringify(contactForm),
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId;
            window.location.href = 'confirmation.html?orderId=' + orderId;
        })
    .catch((error) => {
        console.log(error);
        alert('Erreur : ' + error);
    });
};


///--------------------------------///
/// Vérification regex de l'email  ///
///--------------------------------///

function isValidEmail(email) {
    
    //Expression régulière pour valider une adresse email
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


///--------------------------------------------------------///
/// Vérification de la présence de chiffre dans la string  ///
///--------------------------------------------------------///

function containsNumbers(string) {
    
    //Retour true si présence de chiffre(s)
    return /\d/.test(string);
};


///--------------------------------------------------///
/// Appel de la fonction de récupération du produit  ///
///--------------------------------------------------///

getProducts();