<template>
  <v-container>
    <v-btn icon @click="$router.back()">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-card elevation="0" :loading="loading">
      <v-card-title> {{ id }} </v-card-title>
      <v-card-subtitle>
        <v-rating
          v-show="max_limit"
          :value="max_limit - read_count"
          :length="max_limit"
          color="amber"
          dense
          half-increments
          readonly
          size="14"
        />
        <v-chip v-show="max_limit" x-small color="yellow darken-4" dark>
          Premium
        </v-chip>
        <v-chip v-show="banned" class="ma-1" color="red darken-2" dark x-small>
          Banned
        </v-chip>
        <v-chip
          v-show="unlimited"
          class="ma-1"
          color="blue darken-2"
          dark
          x-small
        >
          Unlimited
        </v-chip>
        <v-chip
          v-show="disabled"
          class="ma-1"
          color="grey darken-2"
          dark
          x-small
        >
          Disabled
        </v-chip>
        <v-chip
          v-show="session.daily.notified"
          dark
          class="ma-1"
          color="red darken-2"
          x-small
        >
          Daily Limit
        </v-chip>
        <v-chip
          v-show="session.hourly.notified"
          dark
          class="ma-1"
          color="red darken-2"
          x-small
        >
          Hourly Limit
        </v-chip>
      </v-card-subtitle>
      <v-card-text>
        <v-btn class="ma-1" color="primary" small rounded>
          Reset All
        </v-btn>
        <v-btn class="ma-1" color="primary darken-1" small rounded>
          Reset Hourly
        </v-btn>
        <v-btn class="ma-1" color="primary darken-1" small rounded>
          Reset Daily
        </v-btn>
        <v-btn class="ma-1" color="red darken-1" dark small rounded>
          Banned
        </v-btn>
        <v-btn class="ma-1" color="grey darken-1" dark small rounded>
          Disabled
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    id: undefined,
    loading: true,
    first_date: undefined,
    last_date: undefined,
    session: {
      hourly: {},
      daily: {},
    },
    total_count: undefined,
    max_limit: undefined,
    read_count: undefined,
    notified_emtpy: undefined,
    notified_error: undefined,
    banned: undefined,
    disabled: undefined,
    unlimited: undefined,
  }),
  beforeMount() {
    this.id = this.$route.params.id;
    this.axios
      .get(`/api/users/${this.id}`)
      .then(({ data }) => {
        this.first_date = data.first_date;
        this.last_date = data.last_date;
        this.session = data.session;
        this.total_count = data.total_count;
        this.max_limit = parseInt(data.max_limit);
        this.read_count = parseInt(data.read_count);
        this.notified_emtpy = data.notified_emtpy;
        this.notified_error = data.notified_error;
        this.banned = data.session.banned;
        this.disabled = data.session.disabled;
        this.unlimited = data.session.unlimited;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
