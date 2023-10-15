<template>
  <q-layout view="lHh Lpr lFf">
    <div class="row items-center justify-evenly">
      <q-page-container style="max-width: 1000px" class="col-12">
        <div class="q-mx-xl q-mt-xl">
          <q-img src="header.svg" class="full-width" />
        </div>
        <router-view />
        <div class="row justify-center bg-primary text-white">
          <span class="q-pa-sm"
            ><div class="column items-center">
              <div>Made with 🥦 by FAIRFOODDATA, LDA.</div>
              <a href="https://www.fairfooddata.com/" target="_blank"
                >Partner with us <q-icon name="open_in_new"
              /></a></div
          ></span>
        </div>
      </q-page-container>
    </div>
  </q-layout>
</template>

<style>
a {
  color: white;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
