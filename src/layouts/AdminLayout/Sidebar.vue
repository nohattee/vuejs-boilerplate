<template>
  <v-navigation-drawer app permanent v-model="drawer" :mini-variant.sync="mini">
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img :src="$store.state.currentUser.avatar"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>{{ $store.state.currentUser.name }}</v-list-item-title>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <template v-for="(item, idx) in items">
        <v-list-group
          v-if="Array.isArray(item.children)"
          :key="idx"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="childrentItem in item.children"
            :key="childrentItem.title"
            :to="childrentItem.link"
            link
          >
            <!-- <v-list-item-icon>
              <v-icon>{{ childrentItem.icon }}</v-icon>
            </v-list-item-icon> -->

            <v-list-item-content>
              <v-list-item-title>{{ childrentItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :key="item.title" :to="item.link" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      drawer: true,
      items: [
        {
          title: this.$t("global.dashboard"),
          icon: "mdi-home-city",
          link: "/",
        },
        {
          title: this.$t("global.cms"),
          icon: "mdi-post",
          link: "/cms",
          children: [
            {
              title: this.$t("global.post"),
              icon: "mdi-post",
              link: "/cms/post",
            },
            {
              title: this.$t("global.category"),
              icon: "mdi-post",
              link: "/cms/category",
            },
          ],
        },
        {
          title: this.$t("global.user"),
          icon: "mdi-account-group",
          link: "/user",
        },
      ],
      mini: true,
    };
  },
};
</script>
