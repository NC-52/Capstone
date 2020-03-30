import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#313131",
        secondary: "#D46A6A",
        accent: "#FFAAAA",
        error: "#e91e63",
        warning: "#ffc107",
        info: "#2196f3",
        success: "#009688"
      },
      dark: {
        primary: "#313131",
        secondary: "#D46A6A",
        accent: "#FFAAAA",
        error: "#e91e63",
        warning: "#ffc107",
        info: "#2196f3",
        success: "#009688"
      }
    }
  }
});
