import { apiEndpoint } from "@/config/auth";
import Vue from "vue";

export const apiModel = {
  Logo: {
    List: {
      method: "GET",
      url: "/logos"
    },
    Get: {
      method: "GET",
      url: "/logos/:logo"
    },
    Create: {
      method: "POST",
      url: "/logos"
    },
    Update: {
      method: "PATCH",
      url: "/logos/:logo"
    },
    Delete: {
      method: "DELETE",
      url: "/logos/:logo"
    },
    Upload: {
      method: "POST",
      url: "/logos/:logo/attachment"
    }
  }
};

export const makeApiRequest = async (
  args,
  object,
  token = "",
  // successCallback = {},
  // errorCallback = {},
  errorMessages = {}
) => {
  const self = this;
  const method = object.method;
  let urlSuffix = object.url;
  let finalUrlSuffix = "";

  // Adjust API url
  if (Object.keys(args).length === 0 && args.constructor === Object) {
    finalUrlSuffix = urlSuffix;
  } else {
    Object.keys(args).forEach(key => {
      finalUrlSuffix = urlSuffix.replace(`:${key}`, args[key]);
      urlSuffix = finalUrlSuffix;
    });
  }

  // Set headers
  let customHeaders = {};
  customHeaders["headers"] = {};

  // Set token in request header if necessary
  if (token !== "") {
    customHeaders["headers"]["Authorization"] = `Bearer ${token}`;
  }

  let response;

  switch (method) {
    case "POST":
      try {
        response = await Vue.axios.post(
          apiEndpoint + finalUrlSuffix.trim(),
          args,
          customHeaders
        );

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: self.errorMessages.generic
        });
      }

      break;

    case "GET":
      try {
        response = await Vue.axios.get(apiEndpoint + finalUrlSuffix.trim(), {
          params: args,
          headers: customHeaders["headers"]
        });

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: errorMessages.generic
        });
      }

      break;

    case "PUT":
      try {
        response = await Vue.axios.put(
          apiEndpoint + finalUrlSuffix.trim(),
          args,
          customHeaders
        );

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: errorMessages.generic
        });
      }

      break;

    case "PATCH":
      try {
        // Remove 'logo' from request boy
        delete args["logo"];

        response = await Vue.axios.patch(
          apiEndpoint + finalUrlSuffix.trim(),
          args,
          customHeaders
        );

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: self.errorMessages.generic
        });
      }

      break;

    case "DELETE":
      try {
        response = await Vue.axios.delete(
          apiEndpoint + finalUrlSuffix.trim(),
          customHeaders
        );

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: self.errorMessages.generic
        });
      }

      break;
  }
};
