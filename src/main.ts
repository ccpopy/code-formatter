import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import { applyTheme, getStoredTheme } from "@/lib/theme";

const app = createApp(App);
app.use(router);

// 初始主题：默认跟随系统；如用户已手动设置则读取本地存储
applyTheme(getStoredTheme());

app.mount("#app");
