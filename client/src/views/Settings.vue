<template>
  <v-container class="mt-4">
    <v-alert
      v-show="message || error"
      :type="error ? 'error' : 'success'"
      class="mb-4"
    >
      {{ message || error }}
    </v-alert>

    <v-form @submit.prevent="save" class="mt-3">
      <v-text-field
        type="text"
        label="Mobile Number"
        v-model="MOBILE_NUMBER"
        outlined
      />
      <v-row>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-select
            label="SIM Slot"
            :items="Object.values(SIMSLOTS)"
            v-model="USE_SIMSLOT"
            outlined
          />
        </v-col>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-text-field
            type="tel"
            autocapitalize="off"
            label="News per SMS (count)"
            v-model="NEWS_PER_SMS"
            outlined
          />
        </v-col>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-text-field
            type="tel"
            autocapitalize="off"
            label="Daily Actions (count)"
            v-model="MAX_DAILY_LIMIT"
            outlined
          />
        </v-col>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-text-field
            type="tel"
            autocapitalize="off"
            label="Hourly Actions (count)"
            v-model="MAX_HOURLY_LIMIT"
            outlined
          />
        </v-col>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-text-field
            type="tel"
            autocapitalize="off"
            label="Daily Session (hour)"
            v-model="PER_DAILY_SESSION"
            outlined
          />
        </v-col>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-text-field
            type="tel"
            autocapitalize="off"
            label="Hourly Session (hour)"
            v-model="PER_HOURLY_SESSION"
            outlined
          />
        </v-col>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-text-field
            type="tel"
            autocapitalize="off"
            label="Spam Protection (second)"
            v-model="SPAM_PROTECTION_TIME"
            outlined
          />
        </v-col>
        <v-col cols="6" sm="4" md="3" lg="2" xl="1">
          <v-text-field
            autocapitalize="off"
            label="Action Score"
            v-model="ACTION_SCORE"
            outlined
          />
        </v-col>
      </v-row>

      <v-btn type="submit" block color="primary">
        <v-icon class="mr-2">mdi-save</v-icon>
        Save
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    ACTION_SCORE: undefined,
    MAX_CHARACTER_LIMIT: undefined,
    MAX_DAILY_LIMIT: undefined,
    MAX_HOURLY_LIMIT: undefined,
    MOBILE_NUMBER: undefined,
    NEWS_PER_SMS: undefined,
    PER_DAILY_SESSION: undefined,
    PER_HOURLY_SESSION: undefined,
    SPAM_PROTECTION_TIME: undefined,
    USE_SIMSLOT: undefined,
    SIMSLOTS: {
      "-1": "(any)",
      "0": "SIM 1",
      "1": "SIM 2",
    },
    error: undefined,
    message: undefined,
  }),
  methods: {
    save() {
      const config = {
        ACTION_SCORE: this.ACTION_SCORE,
        MAX_CHARACTER_LIMIT: parseInt(this.MAX_CHARACTER_LIMIT),
        MAX_DAILY_LIMIT: parseFloat(this.MAX_DAILY_LIMIT),
        MAX_HOURLY_LIMIT: parseFloat(this.MAX_HOURLY_LIMIT),
        MOBILE_NUMBER: this.MOBILE_NUMBER,
        NEWS_PER_SMS: parseInt(this.NEWS_PER_SMS),
        PER_DAILY_SESSION: parseInt(this.PER_DAILY_SESSION) * 3600000,
        PER_HOURLY_SESSION: parseInt(this.PER_HOURLY_SESSION) * 3600000,
        SPAM_PROTECTION_TIME: parseInt(this.SPAM_PROTECTION_TIME) * 1000,
        USE_SIMSLOT: this.selectSIM(this.USE_SIMSLOT),
      };
      console.log(config);
      this.error = null;
      this.message = null;
      this.axios
        .post("/api/settings", config)
        .then(() => {
          this.message = "Saved!";
        })
        .catch((e) => {
          this.error = "Failed to save settings! " + e.message;
        });
    },
    selectSIM(_value) {
      const index = Object.values(this.SIMSLOTS).findIndex(
        (value) => value == _value
      );
      return index < 0 ? "-1" : Object.keys(this.SIMSLOTS)[index];
    },
  },
  beforeMount() {
    this.axios.get("/api/settings").then(({ data }) => {
      const slot = data.USE_SIMSLOT.toString();
      this.ACTION_SCORE = data.ACTION_SCORE;
      this.USE_SIMSLOT = this.SIMSLOTS[slot];
      this.MAX_CHARACTER_LIMIT = data.MAX_CHARACTER_LIMIT;
      this.MAX_DAILY_LIMIT = data.MAX_DAILY_LIMIT;
      this.MAX_HOURLY_LIMIT = data.MAX_HOURLY_LIMIT;
      this.MOBILE_NUMBER = data.MOBILE_NUMBER;
      this.NEWS_PER_SMS = data.NEWS_PER_SMS;
      this.PER_DAILY_SESSION = parseInt(data.PER_DAILY_SESSION / 3600000);
      this.PER_HOURLY_SESSION = parseInt(data.PER_HOURLY_SESSION / 3600000);
      this.SPAM_PROTECTION_TIME = parseInt(data.SPAM_PROTECTION_TIME / 1000);
    });
  },
};
</script>
