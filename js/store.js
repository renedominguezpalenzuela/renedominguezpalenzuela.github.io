const { reactive, useState } = owl;

export const store = reactive({
  jwtToken: "",


});

export default function useStore() {
  return useState(store);
}