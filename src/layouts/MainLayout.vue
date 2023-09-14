<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-img
        src="../assets/solarpunk_essence_food_header.jpg"
        class="full-width"
      />
    </q-header>

    <div class="row items-center justify-evenly">
      <q-page-container style="max-width: 1000px">
        <router-view />
      </q-page-container>
    </div>
    <q-footer>
      <div class="row justify-center">
        <p class="q-pa-sm q-pt-lg">Made with 🥦 by FAIRFOODDATA, LDA.</p>
      </div>
    </q-footer>
  </q-layout>
</template>
