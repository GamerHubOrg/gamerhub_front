<script setup lang="ts">

</script>

<template>

    <h2>Règles du jeu du Loup-Garou</h2>

    <h3>Objectif du jeu</h3>
    <p>L'objectif est différent selon votre rôle :</p>
    <ul>
        <li><strong>Villageois</strong> : Éliminer tous les loups-garous.</li>
        <li><strong>Loups-Garous</strong> : Éliminer tous les villageois.</li>
    </ul>

    <h3>Préparation</h3>
    <p><strong>Nombre de joueurs</strong> : 8 à 18 joueurs.</p>
    <p><strong>Distribution des rôles</strong> :</p>
    <ul>
        <li>Les rôles sont distribués aléatoirement et secrètement à chaque joueur.</li>
        <li>Rôles disponibles : Loup-Garou, Villageois, Sorcière, Voyante, Cupidon, Chasseur, Voleur.</li>
    </ul>

    <h3>Les rôles</h3>

    <h4>Loups-Garous : </h4>
    <ul>
        <li>Chaque nuit, les loups-garous se réveillent et se mettent d'accord pour tuer un villageois.</li>
        <li>Pendant la journée, ils se fondent parmi les villageois et tentent de ne pas se faire démasquer.</li>
    </ul>

    <h4>Villageois : </h4>
    <ul>
        <li>Ne possède aucun pouvoir particulier.</li>
        <li>Leur objectif est de découvrir et éliminer les loups-garous.</li>
    </ul>

    <h4>Sorcière : </h4>
    <ul>
        <li>Possède deux potions : une de guérison et une de mort.</li>
        <li>Chaque nuit, elle peut choisir de sauver la victime des loups-garous avec la potion de guérison ou de tuer un joueur avec la potion de mort.</li>
        <li>Chaque potion ne peut être utilisée qu'une seule fois durant la partie.</li>
    </ul>

    <h4>Voyante : </h4>
    <ul>
        <li>Chaque nuit, la voyante peut découvrir l’identité d’un joueur de son choix.</li>
        <li>Elle doit utiliser cette information pour guider les villageois sans se faire repérer par les loups-garous.</li>
    </ul>

    <h4>Cupidon : </h4>
    <ul>
        <li>La première nuit, Cupidon désigne deux joueurs comme étant amoureux.</li>
        <li>Si l’un des amoureux meurt, l’autre meurt également de chagrin.</li>
        <li>Les amoureux peuvent être de n’importe quel rôle, y compris loup-garou. Leur nouvel objectif est de survivre ensemble et être les derniers en vie.</li>
    </ul>

    <h4>Chasseur : </h4>
    <ul>
        <li>Si le chasseur est tué (par les loups-garous ou les villageois), il peut immédiatement éliminer un autre joueur de son choix avant de mourir.</li>
    </ul>

    <h4>Voleur : </h4>
    <ul>
        <li>Avant le début de la partie, le voleur peut échanger sa carte avec une des cartes non distribuées.</li>
        <li>Il prend ainsi le rôle de cette carte pour le reste de la partie.</li>
    </ul>

    <h3>Déroulement du jeu</h3>

    <h4>Phase de nuit</h4>
    <ul>
        <li>Tous les joueurs ferment les yeux.</li>
        <li>Le maître du jeu appelle successivement les rôles actifs (loups-garous, voyante, sorcière, etc.) pour effectuer leurs actions.</li>
        <li>Chaque rôle actif se rendort après son action.</li>
    </ul>

    <h4>Phase de jour</h4>
    <ul>
        <li>Tous les joueurs ouvrent les yeux.</li>
        <li>Le maître du jeu annonce la victime des loups-garous (et éventuellement d'autres décès causés par la sorcière ou le chasseur).</li>
        <li>Les joueurs discutent pour tenter de démasquer les loups-garous.</li>
        <li>Un vote a lieu pour éliminer un joueur suspecté d'être un loup-garou.</li>
    </ul>

    <h3>Fin de la partie</h3>
    <p>La partie se termine lorsqu'une des conditions suivantes est remplie :</p>
    <ul>
        <li><strong>Victoire des villageois</strong> : Tous les loups-garous ont été éliminés.</li>
        <li><strong>Victoire des loups-garous</strong> : Les loups-garous ont éliminé tous les villageois.</li>
        <li><strong>Victoire des amoureux</strong> : Si les amoureux sont les derniers survivants, ils gagnent la partie, quelle que soit leur appartenance initiale.</li>
    </ul>

    <h3>Conseils de jeu</h3>
    <ul>
        <li><strong>Pour les villageois</strong> : Essayez de collaborer et d'analyser les comportements pour identifier les loups-garous.</li>
        <li><strong>Pour les loups-garous</strong> : Restez discrets et tentez de semer la confusion parmi les villageois.</li>
        <li><strong>Pour les rôles spéciaux</strong> : Utilisez vos pouvoirs avec stratégie pour maximiser votre impact sur la partie.</li>
    </ul>


</template>

<style scoped lang="scss">
h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
}

h3 {
    font-size: 20px;
    font-weight: bold;
    margin-top: 24px;
    margin-bottom: 16px;
}

h4 {
    font-size: 18px;
    font-weight: bold;
    margin-top: 16px;
    margin-bottom: 8px;
}

p {
    margin-bottom: 8px;
}

ul {
    list-style: inside;
    margin-bottom: 16px;
}

li {
    margin-bottom: 8px;
}

</style>
