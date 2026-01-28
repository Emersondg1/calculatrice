// Selection des éléments du DOM

const ecran = document.querySelector('#ecran h2');
const boutons = document.querySelectorAll('button');
let calculTermine = false;


let affichage = '0';
let resultat = null;
let dernierResultat = null;
let modeAngle = 'deg'; // 'deg' ou 'rad'

// Fonction pour mettre à jour l'affichage de l'écran

function mettreAjourEcran() {
    ecran.textContent = affichage;

    // Auto-scroll vers le bas de l'écran

    const conteneur = document.querySelector('#ecran');
    conteneur.scrollTop = conteneur.scrollHeight;
}



// Fonction pour ajouter un chiffre à l'affichage

function ajouterChiffre(valeur) {
    if (calculTermine) {
        affichage = valeur;   // on repart à zéro
        calculTermine = false;
    } else if (affichage === '0' || affichage === 'Erreur') {
        affichage = valeur;
    } else {
        affichage += valeur;
    }
    mettreAjourEcran();
}



// Fonction pour ajouter un opérateur à l'affichage

function ajouterOperateur(operateur) {
    const map = {
        '÷': '/',
        'x': '*',
        '-': '-',
        '+': '+',
    };

    if (calculTermine) {
        calculTermine = false; 
    }

    affichage += map[operateur];
    mettreAjourEcran();
}





// Fonction pour calculer le résultat

function calculSecurise(expression) {
    if (!/^[0-9+\-*/().% ]+$/.test(expression)) {
        throw new Error("Expression invalide");
    }
    return Function(`"use strict"; return (${expression})`)();
}


function calculer() {
    try {
        let expression = affichage
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E);

        resultat = calculSecurise(expression); // 🔐 plus de eval
        dernierResultat = resultat;
        affichage = resultat.toString();
        calculTermine = true;

        // (optionnel) historique
        // ajouterHistorique(expression, resultat);

    } catch {
        affichage = 'Erreur';
    }
    mettreAjourEcran();
}




// Fonction pour effacer l'affichage

function effacer() {
    affichage = '0';
    mettreAjourEcran();
}



// Fonction mathématique avancée
function appliquerFonctionMath(fonction) {
    try {
        let v = parseFloat(affichage);       // récupérer la valeur affichée
        if (fonction === 'x!') v = Math.floor(v); // arrondir pour factorielle
        let r;

        switch (fonction) {
            case 'sin':
                r = modeAngle === 'deg' ? Math.sin(v * Math.PI / 180) : Math.sin(v);
                break;
            case 'cos':
                r = modeAngle === 'deg' ? Math.cos(v * Math.PI / 180) : Math.cos(v);
                break;
            case 'tan':
                r = modeAngle === 'deg' ? Math.tan(v * Math.PI / 180) : Math.tan(v);
                break;
            case 'ln':
                r = Math.log(v);
                break;
            case 'log':
                r = Math.log10(v);
                break;
            case '√':
                r = Math.sqrt(v);
                break;
            case 'x!':
                r = factoriel(v);
                break;
            case '%':
                r = v / 100;
                break;
        }

        resultat = r;
        affichage = resultat.toString();
    } catch {
        affichage = 'Erreur';
    }
    mettreAjourEcran();
}




// Fonction pour calculer la factorielle


function factoriel(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let f = 1;
    for (let i = 2; i <= n; i++) f *= i;
    return f;
}





// Changer le mode angle ou radian


function changerMode(mode) {
    modeAngle = mode;
    document.querySelector('.Deg').style.backgroundColor = mode === 'deg' ? 'lightblue' : 'lightgray';
    document.querySelector('.Red').style.backgroundColor = mode === 'rad' ? 'lightblue' : 'lightgray';
}





// Ajout des événements aux boutons


boutons.forEach(btn => {
    const txt = btn.textContent;

    if (!isNaN(txt)) btn.onclick = () => ajouterChiffre(txt);
    else if (txt === '.') btn.onclick = () => ajouterChiffre('.');
    else if (['+', '-', 'x', '÷'].includes(txt)) btn.onclick = () => ajouterOperateur(txt);
    else if (txt === '=') btn.onclick = calculer;
    else if (txt === '(' || txt === ')') btn.onclick = () => {
        affichage += txt;
        mettreAjourEcran();
    };
});






// Fonctions avancées


document.querySelector('.sin').onclick = () => appliquerFonctionMath('sin');
document.querySelector('.cos').onclick = () => appliquerFonctionMath('cos');
document.querySelector('.tan').onclick = () => appliquerFonctionMath('tan');
document.querySelector('.logarythme').onclick = () => appliquerFonctionMath('ln');
document.querySelector('.log').onclick = () => appliquerFonctionMath('log');
document.querySelector('.racine').onclick = () => appliquerFonctionMath('√');
document.querySelector('.fonction').onclick = () => appliquerFonctionMath('x!');
document.querySelector('.modulo').onclick = () => appliquerFonctionMath('%');




// Constantes


document.querySelector('.pi').onclick = () => ajouterChiffre('π');
document.querySelector('.e').onclick = () => ajouterChiffre('e');




// Autres


document.querySelector('.fonction1').onclick = effacer;
document.querySelector('.ans').onclick = () => ajouterChiffre(dernierResultat?.toString() || '0');
document.querySelector('.puissance').onclick = () => ajouterChiffre('**');





// Mode angle

document.querySelector('.Deg').onclick = () => changerMode('deg');
document.querySelector('.Red').onclick = () => changerMode('rad');




// Initialisation


changerMode('deg');
console.log('Calculatrice prête');

// Fin du fichier js/calculatrice.js
