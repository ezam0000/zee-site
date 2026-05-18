export const env = {
  isDev: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1",
  get isProd() {
    return !this.isDev;
  },
  hotjarEnabled: true, 
};
