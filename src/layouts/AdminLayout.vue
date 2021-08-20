<template>
  <v-app>
    <Sidebar />
    <Header />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default {
  name: "AdminLayout",
  components: {
    Header,
    Sidebar,
  },
};
</script>
