<template>
  <div>
    <h1>{{ Object.keys(characters).length }} characters</h1>

    <ul>
      <li v-for="character in characters">
        {{ character.name }} ({{ character.stars }} stars)
      </li>
    </ul>
  </div>
</template>

<script src="./overview-page.ts"></script>
