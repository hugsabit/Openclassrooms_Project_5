///-----------------------------------------------------------------------------------------------------------///
/// Cette page sert à gérer l'affichage de l'élément sélectionné à l'aide de l'id dans la page product.html   ///
///-----------------------------------------------------------------------------------------------------------///

///--------------------------------------------------///
/// Récupération du produit dans la base de donnée   ///
///--------------------------------------------------///

function getProduct() {

    fetch('http://127.0.0.1:3000/api/products/' + new URLSearchParams(document.location.search).get('id'))
        //Vérification de l'existance du produit
        .then(res => {
            if (!res.ok) {
                //Message d'erreur en cas de produit non existant
                throw new Error('Le produit demandé n\'existe pas');
            }
            //Transformation des donées au format JSON
            return res.json();
        })
        //Appel de la fonction d'affichage du produit
        .then(res => {showProduct(res)})
    .catch((error) => {
        console.log('Erreur : ' + error);
        //Appel de la fonction d'affichage d'erreur
        showError(error);
    });
}


///------------------------------------///
/// Affichage des données du produit   ///
///------------------------------------///

function showProduct(product) {
    
    //Titre de la page
    document.title = `${product.name}`;
    //Affichage de l'image
    document.getElementsByClassName('item__img')[0].innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    //Affichage du nom
    document.getElementById('title').innerHTML += `${product.name}`;
    //Affichage du prix
    document.getElementById('price').innerHTML += `${product.price}`;
    //Affichage de la description
    document.getElementById('description').innerHTML += `${product.description}`;
    //Affichage des couleurs possible
    for(color of product.colors) {
        document.getElementById('colors').innerHTML +=`<option value="${color}">${color}</option>`;
    };
    //Appel de la fonction d'écoute du bouton d'envoie
    listenAddToCart();
};




///--------------------------------------///
/// Ecoute du bouton d'ajout au panier   ///
///--------------------------------------///

function listenAddToCart() {

    //Sélection du bouton au clic
    document.getElementById('addToCart').addEventListener('click', () => {
        //Appel de la fonction de vérification des données
        verifyAddToCart();
    });
};


///------------------------------------------------///
/// Vérification du contenue à ajouter au panier   ///
///------------------------------------------------///

function verifyAddToCart() {

    //Déclaration des variables de vérification
    let colorCheck = false;
    let quantityCheck = false;
    //Récupération de la value de color
    let colorSeledcted = document.getElementById('colors').options[document.getElementById('colors').selectedIndex].value;
    //Vérification du choix de la couleur
    if (colorSeledcted.length === 0) {
        console.log("Probleme de choix couleur");
        //Ajout du style à l'input en cas de problème de choix de couleur
        document.querySelectorAll('select#colors')[0].style.border = '3px solid red';
        //Ajout du text en cas de problème de choix de quantité
        if (!document.querySelectorAll('p#errorColorMessage')[0]) {
            document.getElementsByClassName('item__content__settings__color')[0].innerHTML +=
            `
            <p id="errorColorMessage" style="text-align: center; color: red" >Veuillez choisir une couleur valide.</p>
            `;
        };
        //Appel de la fonction en cas de modification de la couleur
        listenColorInput();
    } else {
        console.log('Couleur choisie : ' + colorSeledcted);
        colorCheck = true;
    }
    
    //Récupération du nombre d'article
    let quantityProducts = document.getElementById('quantity').valueAsNumber;
    //Vérification de la quantité de produit
    if (quantityProducts <= 0 || quantityProducts > 100) {
        console.log('La quantité de produit doit être au minimum de 1 et au maximum de 100 produits');
        console.log(document.querySelectorAll('input#quantity')[0]);
        //Ajout du style à l'input en cas de problème de choix de quantité
        document.querySelectorAll('input#quantity')[0].style.border = '3px solid red';
        //Ajout du text en cas de problème de choix de quantité
        if (!document.querySelectorAll('p#errorQuantityMessage')[0]) {
            document.getElementsByClassName('item__content__settings__quantity')[0].innerHTML +=
            `
            <p id="errorQuantityMessage" style="text-align: center; color: red" >Veuillez choisir une quantité valide.</p>
            `;
        };
        listenQuantityInput();
    } else {
        console.log('la quantité : ' + quantityProducts + " de produit(s) est valide");
        quantityCheck = true;
    };
    //Vérification de validation de tout les paramètres saisie
    if (quantityCheck && colorCheck) {
        console.log('Ajout de la commande au panier');
        //Appel de la fonction d'ajout du produit au panier
        productToCart(new URLSearchParams(document.location.search).get('id'), colorSeledcted, quantityProducts);
        //Appel de la fonction d'overlay pour le choix de la redirection
        windowEventValidProduct();
    } else {
        console.log("Echec de l'ajout de la commande au panier (validation fail)");
    };
};


///---------------------------------------------------------------///
/// Ecoute du choix de la couleur en cas de couleur non choisie   ///
///---------------------------------------------------------------///

function listenColorInput() {

    //Ecoute de l'input de la couleur en cas de changement
    document.querySelectorAll('select#colors')[0].addEventListener('change',() => {
        if (document.querySelectorAll('select#colors')[0].options[document.querySelectorAll('select#colors')[0].selectedIndex].value) {
            //Mise en place du style par default
            document.querySelectorAll('select#colors')[0].style.border = '1px solid #767676';
            //Suppréssion du message d'erreur
            document.getElementById("errorColorMessage").remove();
        }
    })
}


///--------------------------------------------------------///
/// Ecoute de la quantité en cas de quantité non valide   ///
///--------------------------------------------------------///

function listenQuantityInput() {

    //Ecoute de l'input de la quantité en cas de changement
    document.querySelectorAll('input#quantity')[0].addEventListener('change',() => {
        //Mise en place du style par default
        document.querySelectorAll('input#quantity')[0].style.border = '1px solid #767676';
        //Suppréssion du message d'erreur
        document.getElementById("errorQuantityMessage").remove();
    })
}


///--------------------------------------------------------///
/// Fonction d'affichage de l'overay pour la redirection   ///
///--------------------------------------------------------///

function windowEventValidProduct() {

    //Implementation du message d'erreur au DOM
    document.querySelectorAll('body')[0].innerHTML += 
    `
    <div class="overlay">
        <div class="overlayContent">
            <h1>Produit ajouté au panier !</h1>
            <p>Souhaitez vous :</p>
            <div class="overlayContentNav">
                <a class='closeOverlay' style='cursor: pointer;'>Rester sur la page de ce produit</a>
                <a href="./index.html">Accéder au catalogue des produits</a>
                <a href="./cart.html">Accerder au panier</a>
            </div>
        </div>
    </div>
    `;
    //Application du style des élément de l'overlay
    document.getElementsByClassName('overlay')[0].style.position = 'absolute';
    document.getElementsByClassName('overlay')[0].style.top = '0%';
    document.getElementsByClassName('overlay')[0].style.left = '0%';
    document.getElementsByClassName('overlay')[0].style.width = '100%';
    document.getElementsByClassName('overlay')[0].style.height = '100%';
    document.getElementsByClassName('overlay')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    document.getElementsByClassName('overlay')[0].style.display = 'flex';
    document.getElementsByClassName('overlay')[0].style.justifyContent = 'center';
    document.getElementsByClassName('overlay')[0].style.alignItems = 'center';
    document.getElementsByClassName('overlayContent')[0].style.backgroundColor = '#3498db';
    document.getElementsByClassName('overlayContent')[0].style.padding = '50px';
    document.querySelectorAll('.overlayContent>h1')[0].style.margin = '20px 0';
    document.querySelectorAll('.overlayContent>p')[0].style.fontSize = '20px';
    document.querySelectorAll('.overlayContent>p')[0].style.textAlign = 'center';
    document.getElementsByClassName('overlayContentNav')[0].style.display = 'flex';
    document.getElementsByClassName('overlayContentNav')[0].style.flexDirection = 'column';
    document.getElementsByClassName('overlayContentNav')[0].style.alignItems = 'center';
    for (let i = 0; i < document.querySelectorAll('.overlayContentNav>a').length; i++) {
        const element = document.querySelectorAll('.overlayContentNav>a')[i];
        element.style.margin = '10px';
        element.style.textDecoration = 'none';
        element.style.color = '#2c3e50';
    }
    updateOverlayPosition();
    window.addEventListener('scroll', updateOverlayPosition);
    document.getElementsByClassName('closeOverlay')[0].addEventListener('click',() => {
        //Suppression de l'overlay
        document.getElementsByClassName('overlay')[0].remove();
        //Suppression de l'eventListener
        window.removeEventListener('scroll', updateOverlayPosition);
        //Appel de la fonction d'écoute du bouton d'envoie
        listenAddToCart();
    });
}


///--------------------------------------------------///
/// Ecoute de la position du scroll pour l'overlay   ///
///--------------------------------------------------///

function updateOverlayPosition() {

    //Déclaration de la postion du scroll
    let scrollY = window.scrollY;
    //Ajout de la position du scroll à l'overlay
    document.getElementsByClassName('overlay')[0].style.top = scrollY + 'px';
}


///--------------------------------------------------------------------------///
/// Transformation du produit en objet avant l'ajout du contenue au panier   ///
///--------------------------------------------------------------------------///

function productToCart(id, color, quantity) {

    //Structure de l'objet
    const productObject = {
        id: id,
        color: color,
        quantity: quantity
    };
    //Ajout du produit au panier
    addCart(productObject);
};


///---------------------------------------------///
/// Ajout de l'objet au panier (localStorage)   ///
///---------------------------------------------///

function addCart(product) {

    //Récupération du panier
    let cart = getCart();
    //Récupération du produit à trouver
    let productTofind = cart.find(p => p.id == product.id && p.color == product.color);

    //Vérification de l'existance du produit dans le panier
    if (productTofind != undefined) {
        //Modification de la quantité du produit dans le panier
        changeQuantityProduct(product.quantity, productTofind);
    } else {
        if (product.quantity < 1) {
            alert("Vous ne pouvez avoir un produit dans votre panier au nombre de 0 ou moins");
        } else {
            //Ajout du produit dans le panier
            cart.push(product);
            //Sauvegarde du panier
            saveCart(cart);
        }
    }
}


///---------------------------------------------------------------------///
/// Fonction de modification de la quantité du produit dans le panier   ///
///---------------------------------------------------------------------///

function changeQuantityProduct(quantity, product) {
    
    //Récupération du panier
    let cart = getCart();
    let newQuantity = product.quantity + quantity;
    //Vérification de la valeur de la nouvelle quantité
    if (newQuantity <=0) {
        //Supréssion du produit dans le panier
        removeProductCart(product);
    } else if (newQuantity > 100) {
        cart.forEach(p => {
            if (p.id == product.id && p.color == product.color) {
                p.quantity = 100;
                alert("Vous ne pouvez avoir plus de 100 produit d'un même article.");
            }
        });
        //Sauvegarde du panier
        saveCart(cart);
    } else {
        cart.forEach(p => {
            if (p.id == product.id && p.color == product.color) {
                p.quantity = newQuantity;
            }
        });
        //Sauvegarde du panier
        saveCart(cart);
    }
}


///--------------------------------------------------------///
/// Suppréssion du Produit dans le panier (localStorage)   ///
///--------------------------------------------------------///

function removeProductCart(product) {

    //Récupération du panier
    let cart = getCart();
    //Suppréssion du produit donnée
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == product.id && cart[i].color == product.color) {
            cart.splice(i, 1);
        }
    }
    //Sauvegarde du panier
    saveCart(cart);
}


///-----------------------------------------------------///
/// Récupération du contenue du panier (localStorage)   ///
///-----------------------------------------------------///

function getCart() {

    let cart = localStorage.getItem('cart');
    if (cart != undefined) {
        return JSON.parse(cart);
    } else {
        return [];
    }
}


///---------------------------------------///
/// Savaugarde du panier (localStorage)   ///
///---------------------------------------///

function saveCart(cart) {

    localStorage.setItem('cart', JSON.stringify(cart));
}


///------------------------------------------------------------///
/// Affichage du message d'erreur un cas de fetch non réussit  ///
///------------------------------------------------------------///

function showError(error) {
    
    //Supprésion des éléments de la page
    removeContentPage();
    //Insertion des éléments de l'erreur et de rafraichissement
    const pageElement = document.getElementsByClassName('item');
    pageElement[0].style.flexDirection = 'column';
    pageElement[0].innerHTML +=
    `
    <h1>Erreur lors de la comunication avec le serveur : <br>${error}</h1>
    <a href='./product.html?id=${new URLSearchParams(document.location.search).get('id')}' style='display: flex;justify-content: center;font-size: 22px;border-radius: 40px;border: 0;background-color: #2c3e50;color: white;padding: 18px 28px;cursor: pointer;margin: 40px auto;width: fit-content;'>Raffraichir</a>
    `;
}


///-----------------------------------------------------///
/// Suppréssion du contenue de la page en cas d'erreur  ///
///-----------------------------------------------------///

function removeContentPage() {
    //Récupération du pointeur pour la suppréssion
    const pageElement = document.getElementsByClassName('item');
    for (let i = 0; i < pageElement.length; i++) {
        const element = pageElement[i];
        
        //Suppression de chaque éléments de la page
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

///--------------------------------------------------///
/// Appel de la fonction de récupération du produit  ///
///--------------------------------------------------///

getProduct();