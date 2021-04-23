<template>
  <v-container>
    <v-expand-transition>
      <v-alert
        v-show="message || error"
        :type="error ? 'error' : 'success'"
        class="mb-4"
      >
        {{ message || error }}
      </v-alert>
    </v-expand-transition>
    <v-card elevation="0">
      <v-card-title>Users</v-card-title>
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th>Phone</th>
              <th class="text-center">Actions</th>
              <th class="text-center">Hourly</th>
              <th class="text-center">Daily</th>
              <th class="text-center">Renew On</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="user in users">
              <tr
                :class="
                  (getActionCount(user.session.daily.total_action) >
                    maxDailyAction &&
                    'red darken-2 white--text') ||
                  (getActionCount(user.session.hourly.total_action) >
                    maxHourlyAction &&
                    'yellow darken-4 white--text')
                "
                @click="$router.push({ name: 'User', params: { id: user.id } })"
                :key="user.id"
              >
                <td class="pa-4 text-center">{{ user.number }}</td>
                <td class="text-center">{{ user.total_count }}</td>
                <td class="text-center">
                  {{ getActionCount(user.session.hourly.total_action) }}/
                  {{ maxHourlyAction }}
                </td>
                <td class="text-center">
                  {{ getActionCount(user.session.daily.total_action) }}/
                  {{ maxDailyAction }}
                </td>
                <td class="pt-4 text-center">
                  <p>
                    {{ formatDate(new Date(user.session.hourly.expired)) }}
                  </p>
                  <p>
                    {{ formatDate(new Date(user.session.daily.expired)) }}
                  </p>
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    error: undefined,
    message: undefined,
    users: [],
    settings: {},
  }),
  methods: {
    fetchUsers() {
      this.axios("/api/users").then(({ data }) => {
        this.users = data;
      });
    },
    fetchSettings() {
      this.axios.get("/api/settings").then(({ data }) => {
        this.settings = data;
      });
    },
    getActionCount(count) {
      return Math.round(Number(count) / this.settings.ACTION_SCORE);
    },
    formatDate(dt) {
      let [d, m, h, i] = [
        dt.getDate(),
        dt.getMonth() + 1,
        dt.getHours(),
        dt.getMinutes(),
      ];
      let A;
      if (h > 18) A = "ည";
      else if (h > 15) A = "ညနေ";
      else if (h > 11) A = "နေ့လည်";
      else A = "မနက်";
      if (m < 10) m = "0" + m;
      if (h > 12) h -= 12;
      if (h < 10) h = "0" + h;
      if (i < 10) i = "0" + i;
      return `${d}-${m} ${A} ${h}:${i}`;
    },
  },
  computed: {
    maxHourlyAction() {
      return parseInt(
        this.settings.MAX_HOURLY_LIMIT / this.settings.ACTION_SCORE
      );
    },
    maxDailyAction() {
      return parseInt(
        this.settings.MAX_DAILY_LIMIT / this.settings.ACTION_SCORE
      );
    },
  },
  beforeMount() {
    this.fetchUsers();
    this.fetchSettings();
  },
};
</script>
