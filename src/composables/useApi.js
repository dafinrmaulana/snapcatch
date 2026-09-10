import axios from "axios";
import { ref } from "vue";

const baseUrl = import.meta.env.VITE_API_URL;

export const useApi = () => {
  const isLoading = ref(false);
  const error = ref(null);
  const data = ref(null);

  // path is appended to VITE_API_URL (e.g. "/api/info"); params become the query string.
  const getData = async (path, params) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(baseUrl + path, { params });
      data.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    data,
    getData,
  };
};
