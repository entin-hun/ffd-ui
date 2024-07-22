<template>
  <q-layout view="lHh Lpr lFf">
    <div class="row items-center justify-evenly">
      <q-page-container style="max-width: 1000px">
        <div class="q-mx-xl q-mt-xl">
          <q-img src="header.svg" class="full-width q-px-sm" />
        </div>
        <router-view />
        <div class="column items-center">
          <q-btn rounded class="q-ma-lg" color="cyan" @click="openPartnerLink">
            Partner with us!
          </q-btn>
        </div>
        <div
          class="row justify-center bg-primary text-white"
          style="border-radius: 5px 5px 0px 0px"
        >
          <span class="q-pa-sm"
            ><div class="column items-center">
              <div>Made with 🥦 by FAIRFOODDATA, LDA.</div>
            </div></span
          >
        </div>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
function openPartnerLink() {
  window.open('https://www.fairfooddata.com/', '_blank');
}
</script>
