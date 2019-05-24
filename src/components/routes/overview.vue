<template>
  <div id="app">
    <p>{{ Object.keys(characters).length }} characters:</p>

    <ul>
      <li v-for="character in characters">
        {{ character.name }} ({{ character.stars }} stars)
      </li>
    </ul>
  </div>
</template>

<script src="./overview.ts"></script>
