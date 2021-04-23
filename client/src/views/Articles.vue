<template>
  <v-container class="mt-4">
    <v-expand-transition>
      <v-alert
        v-show="message || error"
        :type="error ? 'error' : 'success'"
        class="mb-4"
      >
        {{ message || error }}
      </v-alert>
    </v-expand-transition>
    <v-row class="mx-5">
      <h2>Articles</h2>
      <v-spacer></v-spacer>
      <v-btn icon @click="update" :loading="updating">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-col cols="12">
        <v-simple-table>
          <thead>
            <tr>
              <th colspan="2">Article Title</th>
              <th>Published at</th>
              <td>
                <span class="d-sr-only">actions</span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-show="!articles.length">
              <td colspan="4">
                <p class="text-body-2">Nothing to show articles.</p>
              </td>
            </tr>
            <template v-for="article in articles">
              <tr :key="article.id">
                <td class="pa-4">{{ article.title }}</td>
                <td class="py-4">{{ article.source }}</td>
                <td style="min-width: 180px;" class="py-4 text-right">
                  {{ formatDate(new Date(article.datetime)) }}
                </td>
                <td class="py-4 text-right">
                  <v-btn
                    icon
                    color="error"
                    @click="removeArticle(article.id)"
                    :disabled="deleting"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    error: undefined,
    message: undefined,
    updating: false,
    deleting: false,
    articles: [],
  }),
  methods: {
    update() {
      this.error = null;
      this.message = null;
      this.updating = true;
      this.axios
        .get("/update")
        .then(() => {
          this.message = "Updated!";
          this.fetchArticles();
        })
        .catch((e) => {
          this.error = e.message;
        })
        .finally(() => {
          this.updating = false;
        });
    },
    removeArticle(id) {
      this.deleting = true;
      this.axios
        .delete("/api/articles/" + id)
        .then(() => {
          this.message = "#" + id + " has been deleted";
          this.fetchArticles();
        })
        .catch((e) => {
          this.error = "Unable to delete! " + e.message;
        })
        .finally(() => {
          this.deleting = false;
        });
    },
    fetchArticles() {
      this.axios("/api/articles").then(({ data }) => {
        this.articles = data.sort(
          (a, b) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
      });
    },
    formatDate(dt) {
      let [d, m, h, i, y] = [
        dt.getDate(),
        dt.getMonth() + 1,
        dt.getHours(),
        dt.getMinutes(),
        dt.getFullYear(),
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
      return `${d}-${m}-${y} ${A} ${h}:${i}`;
    },
  },
  beforeMount() {
    this.fetchArticles();
  },
};
</script>
