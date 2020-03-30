<template>
  <v-card class="mx-auto" max-width="400">
    <v-img
      v-if="urlValid"
      class="white--text align-end"
      height="200px"
      :src="logo.attachmentUrl"
    >
      <v-card-title>
        {{ logo.title }}
      </v-card-title>
    </v-img>

    <v-card-title v-else>
      {{ logo.title }}
    </v-card-title>

    <v-card-subtitle class="pb-0">
      {{ logo.createdAt }}
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div>
        {{ logo.description }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        text
        @click="editLogo"
      >
        Edit
      </v-btn>

      <v-btn color="danger" text @click="deleteLogo">
        Delete
      </v-btn>
    </v-card-actions>

    <v-snackbar
      :color="color"
      :bottom="bottom"
      :top="top"
      :left="left"
      :right="right"
      v-model="snackbar"
      dark
    >
      <v-icon color="white" class="mr-3">{{ notificationIcon }}</v-icon>

      <div>{{ notificationMessage }}</div>

      <v-icon size="16" @click="snackbar = false">mdi-close-circle</v-icon>
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { apiModel, makeApiRequest } from "@/api";

export default {
  name: "Logo",

  computed: {
    ...mapGetters(["logos"]),

    mLogos: function() {
      return this.logos;
    }
  },

  props: ["logo"],

  data() {
    return {
      loading: true,
      color: null,
      top: true,
      bottom: false,
      left: false,
      right: true,
      snackbar: false,
      notificationIcons: {
        success: "mdi-check-circle",
        error: "mdi-alert-octagon"
      },
      notificationIcon: null,
      notificationMessage: null,
      urlValid: null
    };
  },

  methods: {
    async editLogo() {
      // Set logo state via mutations
      const logo = this.logo
      this.$store.commit('setLogoState', { logo });

      // Redirect to edit view
      this.$router.push({ name: 'edit-logo', params: { logo: this.logo.logoId } })
    },

    async deleteLogo() {
      const tokenObj = await this.$auth.getIdTokenClaims();
      const token = tokenObj.__raw;

      const args = {
        logo: this.logo.logoId
      }

      try {
        const response = await makeApiRequest(
          args,
          apiModel.Logo.Delete,
          token,
          {}
        );

        const status = response.status;

        if (status === 200) {
          // Set logos state via mutations
          const newLogos = this.mLogos.filter(a => {
            return a.logoId !== this.logo.logoId;
          });

          this.$store.commit("setLogosState", { logos: newLogos });
        } else {
          this.snack("error", response.message, this.notificationIcons.error);
        }
      } catch (err) {
        this.snack("error", err, this.notificationIcons.error);
      }
    },

    async checkAttachmentURL() {
      try {
        await axios.get(this.logo.attachmentUrl)

        this.urlValid = true
      } catch {
        this.urlValid = false
      }
    },

    snack(color, err, icon) {
      this.color = color;
      this.snackbar = true;
      this.notificationMessage = err;
      this.notificationIcon = icon;
    }
  },

  async mounted() {
    await this.checkAttachmentURL()
  }
};
</script>
