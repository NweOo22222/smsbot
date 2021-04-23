<template>
  <v-container>
    <v-form @submit.prevent="save" ref="form">
      <v-card elevation="0" :loading="submiting">
        <v-card-title>
          Add Highlights
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="contents"
            label="Contents"
            :rules="rules.contents"
            outlined
          ></v-textarea>
          <v-combobox
            v-model="source"
            :items="sources"
            :rules="rules.source"
            label="Source"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" type="submit" block>
            <v-icon class="mr-2" small>mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    submiting: false,
    source: "",
    contents: "",
    sources: [],
    rules: {
      contents: [(value) => !!value],
      source: [(value) => !!value],
    },
  }),
  methods: {
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.submiting = true;
      this.axios
        .post("/api/highlights", {
          title: this.contents,
          source: this.source,
          timestamp: Date.now(),
        })
        .then(() =>
          this.$router.push({
            name: "Highlights",
          })
        );
    },
  },
  beforeMount() {
    this.axios("/api/highlights").then(({ data }) => {
      this.sources = data.map(({ source }) => source || null);
    });
  },
};
</script>
