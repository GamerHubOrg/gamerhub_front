<script setup lang="ts">

</script>

<template>
    <h2>Règles du jeu Undercover</h2>

    <h3>Objectif du jeu</h3>
    <p>L'objectif du jeu <strong>Undercover</strong> est de découvrir qui sont les espions (ou "undercover") parmi les joueurs tout en essayant de ne pas se faire démasquer si vous êtes un espion.</p>

    <h3>Préparation</h3>
    <p><strong>Nombre de joueurs</strong> : 4 à 20 joueurs.</p>
    <p><strong>Distribution des rôles</strong> :</p>
    <ul>
        <li>Chaque joueur reçoit secrètement un rôle : soit un citoyen, soit un espion.</li>
        <li>Les rôles sont généralement assignés aléatoirement par l'application ou le maître de jeu.</li>
    </ul>
    <p><strong>Cartes des mots</strong> :</p>
    <ul>
        <li>Les citoyens reçoivent tous le même mot.</li>
        <li>Les espions reçoivent un mot différent, mais proche du mot des citoyens.</li>
    </ul>

    <h3>Déroulement du jeu</h3>

    <h4>Tour de parole</h4>
    <ul>
        <li>Chaque joueur, à tour de rôle, doit dire un mot ou une phrase en lien avec le mot qu'il a reçu.</li>
        <li>L'objectif est de donner un indice assez clair pour les citoyens, mais pas trop évident pour que les espions ne puissent pas deviner le mot des citoyens.</li>
    </ul>

    <h4>Discussions</h4>
    <p>Après que chaque joueur ait donné son indice, il y a une phase de discussion où les joueurs peuvent débattre et essayer de déterminer qui sont les espions.</p>

    <h4>Votes</h4>
    <ul>
        <li>Tous les joueurs votent pour éliminer un joueur qu'ils suspectent être un espion.</li>
        <li>Le joueur qui reçoit le plus de votes est éliminé du jeu.</li>
        <li>Si c'est un citoyen, il révèle son mot.</li>
        <li>Si c'est un espion, il ne révèle pas le mot des citoyens.</li>
    </ul>

    <h3>Fin de la partie</h3>
    <p>La partie se termine lorsqu'une des conditions suivantes est remplie :</p>
    <ul>
        <li><strong>Victoire des citoyens</strong> : Tous les espions ont été éliminés.</li>
        <li><strong>Victoire des espions</strong> : Le nombre d'espions restants est égal ou supérieur au nombre de citoyens restants.</li>
    </ul>

    <h3>Conseils de jeu</h3>
    <ul>
        <li><strong>Pour les citoyens</strong> : Soyez prudents avec vos indices. Trop évident et les espions devineront, trop obscur et vous serez suspectés.</li>
        <li><strong>Pour les espions</strong> : Essayez de donner des indices qui sont assez proches des citoyens pour ne pas vous faire démasquer, mais assez différents pour semer le doute.</li>
    </ul>


</template>

<style scoped lang="scss">


</style>
