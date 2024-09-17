<script setup lang="ts">

</script>

<template>
<h2>Règles du jeu SpeedrunDLE</h2>

    <h3>Objectif du jeu :</h3>
<p>Le but est de deviner les personnages à partir d'indices, en prenant en compte deux critères : le temps pris pour trouver le personnage et le nombre de tentatives effectuées. Le joueur qui accumule le plus de points gagne la partie.</p>

<h3>Préparation :</h3>
<p><strong>Nombre de joueurs</strong> : 1 à 50 joueurs.</p>
<p><strong>Thème des personnages</strong> : Les personnages appartiennent à un thème défini (par exemple, personnages de League of Legends).</p>
<p><strong>Configuration</strong> :</p>
<p>Le nombre de rounds (un round = un personnage à deviner) est déterminé avant le début de la partie.</p>
<p>Chaque joueur reçoit les mêmes personnages à deviner.</p>
<h3>Déroulement du jeu :</h3>
<h4>Lancement d'un round :</h4>

<p>Un tableau d'indices pour les personnages déjà devinés est présenté avec les informations suivantes :</p>
<p><strong>League of legends</strong> :</p>
<ul>
    <li>Genre</li>
    <li>Espèce</li>
    <li>Combat (ex : Assassin, Tank)</li>
    <li>Ressource (ex : Mana, Energie)</li>
    <li>Range (Mêlée, Distance)</li>
    <li>Position (ex : Mid, Support)</li>
    <li>Région</li>
    <li>Date de sortie</li>
</ul>

<h4>Deviner le personnage :</h4>

<p>Chaque joueur tente de deviner le personnage le plus rapidement possible et en effectuant le moins de tentatives.</p>
<p>Après chaque soumission, les joueurs voient si leur réponse est correcte ou non.</p>
<p>Une fois le personnage trouvé, le joueur passe immédiatement au personnage suivant, sans attendre les autres joueurs.</p>
 
<h4>Système de points :</h4>

<p>Les points sont calculés en fonction du temps écoulé pour deviner le personnage et du nombre de tentatives utilisées :</p>
<p>Moins de temps = Plus de points.</p>
<p>Moins de tentatives = Plus de points.</p>
<p>Les joueurs peuvent continuer à deviner jusqu'à ce qu'ils trouvent le bon personnage, mais plus il y a de tentatives, moins ils marquent de points.</p>

<h4>Résultats du round :</h4>

<p>Chaque joueur reçoit ses points une fois qu'il a deviné correctement le personnage.</p>
<p>Le jeu ne s'arrête pas pour les autres joueurs, ils continuent à chercher jusqu'à ce qu'ils trouvent également le personnage.</p>

<h4>Fin de la partie :</h4>

<p>La partie se termine après un nombre prédéfini de rounds.</p>
<p>Le joueur avec le score total le plus élevé remporte la partie.</p>

<h4>Conseils de jeu :</h4>
<p><strong>Rapidité</strong> : Essayez de deviner le personnage aussi rapidement que possible tout en restant précis.</p>
<p><strong>Précision</strong> : Moins vous faites de tentatives, plus vous gagnerez de points. Analysez les indices avant de soumettre une réponse.</p>
<p><strong>Focus individuel</strong> : Même si d'autres joueurs continuent à chercher, concentrez-vous sur votre propre progression pour avancer plus vite.</p>
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
