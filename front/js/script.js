///-------------------------------------------------------------------------///
/// Cette page sert à gérer l'affichage des élément de la page index.html   ///
///-------------------------------------------------------------------------///

///-----------------------------///
/// Récupération des Produits   ///
///-----------------------------///

function getProducts() {
    
    fetch('http://127.0.0.1:3000/api/products')
        //Transformation des donées au format JSON
        .then(res => res.json())
        //Appel de la fonction d'affichage des données
        .then(res => {showProducts(res)})
    .catch((error) => {
        //affichage de l'erreur dans la console
        console.error('Erreur lors de la récupération des produits : ', error);
        //Appel de la fonction d'affichage de l'erreur dans le DOM
        showError(error);
    });
}


///-------------------------///
/// Affichage des produits  ///
///-------------------------///

function showProducts(products) {
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        //Implémentation dans le DOM au niveau de #items des infos du produit
        document.getElementById('items').innerHTML += 
        `
        <a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>
        `;
    };
};


///------------------------------------------------------------///
/// Affichage du message d'erreur un cas de fetch non réussit  ///
///------------------------------------------------------------///

function showError(error) {
    //Supprésion des éléments de la page
    removeContentPage()
    //Insertion des éléments de l'erreur et de rafraichissement
    document.getElementsByClassName('titles')[0].innerHTML +=
    `
    <h1>Erreur lors de la comunication avec le serveur : <br>${error}</h1>
    <a href='./index.html' style='display: flex;justify-content: center;font-size: 22px;border-radius: 40px;border: 0;background-color: #2c3e50;color: white;padding: 18px 28px;cursor: pointer;margin: 40px auto;width: fit-content;'>Raffraichir</a>
    `
}


///-----------------------------------------------------///
/// Suppréssion du contenue de la page en cas d'erreur  ///
///-----------------------------------------------------///

function removeContentPage() {
    //Récupération du pointeur pour la suppréssion
    const pageElement = document.getElementsByClassName('titles')

    for (let i = 0; i < pageElement.length; i++) {
        const element = pageElement[i];
        
        //Suppression de chaque éléments de la page
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}


///----------------------------------------------------///
/// Appel de la fonction de récupération des produits  ///
///----------------------------------------------------///

getProducts();