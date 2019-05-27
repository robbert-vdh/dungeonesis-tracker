<template>
  <div v-if="character !== undefined">
    <h1>{{ character.name }}</h1>

    <p>({{ character.stars }} stars)</p>

    <p>You have <strong>{{ user.unspent_stars }}</strong> unspent stars.</p>

    <h3>TODO:</h3>

    <ul>
      <li>Character selection dropdown</li>
      <li>
        Buttons after character name:
        <ul>
          <li>Add stars</li>
          <li>Rename</li>
          <li>Delete</li>
        </ul>
      </li>
      <li>Level progress bar with current level</li>
      <li>Banner display similar to the actual sheet</li>
    </ul>
  </div>
  <p v-else>
    The character could not be found.
  </p>
</template>

<script src="./character-page.ts"></script>
