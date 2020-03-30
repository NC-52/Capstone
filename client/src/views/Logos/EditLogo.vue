<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="mLogo.title"
        :rules="titleRules"
        label="Title"
        required
      ></v-text-field>

      <v-textarea
        solo
        v-model="mLogo.description"
        :rules="descriptionRules"
        label="Description"
        required
      ></v-textarea>

      <v-file-input
        v-model="image"
        placeholder="Select your logo"
        chips
        show-size
        accept="image/*"
        label="Image"
      ></v-file-input>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="editLogo"
      >
        Submit
      </v-btn>
    </v-form>

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
  </v-container>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { apiModel, makeApiRequest } from "@/api";

export default {
  name: "EditLogo",

  computed: {
    ...mapGetters(["logo", "logos"]),

    mLogo: function() {
      return this.logo;
    },

    mLogos: function() {
      return this.logos;
    }
  },

  data() {
    return {
      valid: true,
      token: null,
      titleRules: [v => !!v || "Title is required"],
      descriptionRules: [v => !!v || "Description is required"],
      image: null,
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
      notificationMessage: null
    };
  },

  methods: {
    async editLogo() {
      try {
        const tokenObj = await this.$auth.getIdTokenClaims();
        const token = tokenObj.__raw;
        this.token = token;

        const args = {
          logo: this.mLogo.logoId,
          title: this.mLogo.title,
          description: this.mLogo.description
        };

        const response = await makeApiRequest(
          args,
          apiModel.Logo.Update,
          token,
          {}
        );

        // eslint-disable-next-line
        console.log("Response:", response);

        const status = response.status;

        if (status === 200) {
          // Set logos state via mutations
          const newLogo = this.mLogo;
          const logos = { newLogo, ...this.mLogos };

          this.$store.commit("setLogosState", { logos });

          // Upload image if one was selected
          if (this.image) {
            // eslint-disable-next-line
            console.log("Getting upload URL")

            this.uploadImage(newLogo.logoId);
          }

          // Redirect to logo list view
          this.$router.push({ name: 'logos'})
        } else {
          this.snack("error", response.message, this.notificationIcons.error);
        }
      } catch (err) {
        this.snack("error", err, this.notificationIcons.error);
      }
    },

    async uploadImage(logo) {
      const args = {
        logo
      };

      // Get presigned URL
      const response = await makeApiRequest(args, apiModel.Logo.Upload, this.token, {});
      const uploadUrl = response.data.uploadUrl
      
      // eslint-disable-next-line
      console.log("Upload Url:", uploadUrl)

      axios.put(uploadUrl, this.image)
    },

    snack(color, err, icon) {
      this.color = color;
      this.snackbar = true;
      this.notificationMessage = err;
      this.notificationIcon = icon;
    }
  }
};
</script>

<style></style>
