<template>
  <main class="container">
    <section class="section">
      <!-- Header with logo and intro text -->
      <div style="overflow: auto">
        <img
          v-if="headerLogo"
          :src="headerLogo"
          alt="Logo"
          class="logo-img header-logo"
        />
        <div class="q-ma-sm">
          It's essential to know what you eat, so we made it easily accessible.
          These values were published via Ethereum Swarm, the
          censorship-resistant decentralized storage.
        </div>
      </div>
    </section>

    <section
      v-if="
        title || subtitle || description || productImage || manufacturerLogo
      "
      class="section"
    >
      <div class="content-flex">
        <div
          class="content-text"
          :class="{
            'no-logo': !manufacturerLogo,
            centered: !title && !description && subtitle,
          }"
        >
          <img
            v-if="manufacturerLogo"
            :src="manufacturerLogo"
            alt="Manufacturer Logo"
            class="logo-img content-logo"
          />
          <h1 v-if="title">{{ title }}</h1>
          <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
          <p v-if="description">{{ description }}</p>
        </div>
        <div v-if="productImage" class="content-product">
          <img
            :src="productImage"
            alt="Product image"
            class="product-image"
            style="max-width: 300px"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductInstance } from '@trace.market/types';

type HeaderProps = {
  instance: ProductInstance;
  headerLogo?: string;
  manufacturerLogo?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  productImage?: string;
};

const props = defineProps<HeaderProps>();

const headerLogo = computed(() => props.headerLogo ?? '/logo.png');
const manufacturerLogo = computed(
  () =>
    props.manufacturerLogo ?? props.instance?.process?.knowHow?.logoURL ?? ''
);
const title = computed(() => props.title ?? props.instance?.title ?? '');
const subtitle = computed(() => props.subtitle ?? props.instance?.type ?? '');
const description = computed(
  () => props.description ?? props.instance?.description ?? ''
);
const productImage = computed(
  () => props.productImage ?? props.instance?.pictureURL ?? ''
);
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-size: 14px;
  color: #2d2d2d;
  background-color: #f4f4f4;
  line-height: 1.7;
}

.container {
  max-width: 1200px;
  width: 92%;
  margin: 0 auto;
  padding: 0 20px;
}

@media (min-width: 981px) {
  .container {
    max-width: 1400px;
  }
}

.section {
  background-color: #fff;
  margin: 5px 0;
  padding: 0px 0px;
  border-radius: 8px;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.05);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #006633;
  margin-bottom: 15px;
  font-weight: bold;
}

h1 {
  font-size: 28px;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 20px;
}

p {
  margin-bottom: 15px;
  line-height: 1.6;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.product-image {
  max-width: 400px;
  margin: 0 auto;
}

.subtitle {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
}

.logo-img {
  max-width: 100%;
  height: auto;
}

.header-logo {
  float: left;
  max-width: 300px;
  margin-right: 30px;
  margin-bottom: 20px;
}

.content-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: flex-start;
}

.content-text {
  flex: 2 1 400px;
  overflow: auto;
}

.content-text.no-logo {
  flex: 1 1 100%;
}

.content-text.centered {
  text-align: center;
}

.content-logo {
  float: right;
  max-width: 150px;
  margin-left: 30px;
  margin-bottom: 20px;
}

.content-product {
  flex: 0 1 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 830px) {
  .content-product {
    flex: 1 1 100%;
  }
}

@media (max-width: 767px) {
  .section {
    padding: 20px 15px;
  }

  h1 {
    font-size: 22px;
  }

  h2 {
    font-size: 18px;
  }
}

@media (max-width: 400px) {
  .container {
    width: 96%;
    padding: 0 10px;
  }
}
</style>
