<template>
  <v-container>
    <v-row class="mt-4">
      <v-col cols="6" sm="4" md="3" lg="2" xl="1">
        <v-card color="primary" dark>
          <v-card-subtitle class="text-center pt-6 pb-1">
            <h2>{{ total.users }}</h2>
            <h2>{{ total.users }}</h2>
            <p>Users</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4" md="3" lg="2" xl="1">
        <v-card color="primary" dark>
          <v-card-subtitle class="text-center pt-6 pb-1">
            <h2>{{ total.actions }}</h2>
            <p>Actions</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4" md="3" lg="2" xl="1">
        <v-card color="primary" dark>
          <v-card-subtitle class="text-center pt-6 pb-1">
            <h2>{{ total.disables }}</h2>
            <p>Disabled</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4" md="3" lg="2" xl="1">
        <v-card color="primary" dark>
          <v-card-subtitle class="text-center pt-6 pb-1">
            <h2>{{ total.bans }}</h2>
            <p>Banned</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      actives: 0,
      total: {},
      settings: {},
    };
  },
  beforeMount() {
    this.axios.get("/api/total").then(({ data }) => {
      this.total = data;
    });

    this.axios.get("/api/settings").then(({ data }) => {
      this.settings = data;
    });
  },
};
</script>
