<template>
  <v-app>
    <v-app-bar app color="secondary" dark dense>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-spacer></v-spacer>
      <v-img
        class="shrink mr-2"
        src="./assets/logo.png"
        transition="scale-transition"
        contain
        width="40"
      />
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer app fixed dark v-model="drawer">
      <v-list>
        <v-list-item v-for="(item, i) in menu" :to="item.to" :key="i">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    drawer: false,
    menu: [
      {
        name: "Home",
        icon: "mdi-home",
        to: "/",
      },
      {
        name: "Users",
        icon: "mdi-account-multiple",
        to: "/users",
      },
      {
        name: "Highlights",
        icon: "mdi-star",
        to: "/highlights",
      },
      {
        name: "Articles",
        icon: "mdi-newspaper",
        to: "/articles",
      },
      {
        name: "Settings",
        icon: "mdi-flower",
        to: "/settings",
      },
    ],
  }),
});
</script>
