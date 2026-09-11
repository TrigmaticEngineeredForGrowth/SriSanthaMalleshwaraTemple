// vite.config.js
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { readFileSync } from "fs";
import { extname, join } from "path";
var serveJsxAsText = () => ({
  name: "serve-jsx-as-text",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || "";
      if (url.endsWith(".jsx") || url.endsWith(".css")) {
        const filePath = join(process.cwd(), url.split("?")[0]);
        try {
          const content = readFileSync(filePath, "utf-8");
          res.setHeader("Content-Type", url.endsWith(".jsx") ? "text/babel" : "text/css");
          res.setHeader("Cache-Control", "no-store");
          res.end(content);
          return;
        } catch {
        }
      }
      next();
    });
  }
});
var vite_config_default = defineConfig({
  plugins: [serveJsxAsText()],
  server: {
    port: 5173,
    host: true,
    open: false,
    headers: {
      "Cache-Control": "no-store"
    }
  },
  appType: "mpa",
  build: {
    outDir: "dist"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGV4dG5hbWUsIGpvaW4gfSBmcm9tICdwYXRoJztcblxuY29uc3Qgc2VydmVKc3hBc1RleHQgPSAoKSA9PiAoe1xuICBuYW1lOiAnc2VydmUtanN4LWFzLXRleHQnLFxuICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgICBpZiAodXJsLmVuZHNXaXRoKCcuanN4JykgfHwgdXJsLmVuZHNXaXRoKCcuY3NzJykpIHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBqb2luKHByb2Nlc3MuY3dkKCksIHVybC5zcGxpdCgnPycpWzBdKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gcmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKTtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCB1cmwuZW5kc1dpdGgoJy5qc3gnKSA/ICd0ZXh0L2JhYmVsJyA6ICd0ZXh0L2NzcycpO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tc3RvcmUnKTtcbiAgICAgICAgICByZXMuZW5kKGNvbnRlbnQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLy8gZmFsbCB0aHJvdWdoIHRvIG5leHQgaGFuZGxlclxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBuZXh0KCk7XG4gICAgfSk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3NlcnZlSnN4QXNUZXh0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgb3BlbjogZmFsc2UsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tc3RvcmUnLFxuICAgIH0sXG4gIH0sXG4gIGFwcFR5cGU6ICdtcGEnLFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsU0FBUyxZQUFZO0FBRTlCLElBQU0saUJBQWlCLE9BQU87QUFBQSxFQUM1QixNQUFNO0FBQUEsRUFDTixnQkFBZ0IsUUFBUTtBQUN0QixXQUFPLFlBQVksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQ3pDLFlBQU0sTUFBTSxJQUFJLE9BQU87QUFDdkIsVUFBSSxJQUFJLFNBQVMsTUFBTSxLQUFLLElBQUksU0FBUyxNQUFNLEdBQUc7QUFDaEQsY0FBTSxXQUFXLEtBQUssUUFBUSxJQUFJLEdBQUcsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDdEQsWUFBSTtBQUNGLGdCQUFNLFVBQVUsYUFBYSxVQUFVLE9BQU87QUFDOUMsY0FBSSxVQUFVLGdCQUFnQixJQUFJLFNBQVMsTUFBTSxJQUFJLGVBQWUsVUFBVTtBQUM5RSxjQUFJLFVBQVUsaUJBQWlCLFVBQVU7QUFDekMsY0FBSSxJQUFJLE9BQU87QUFDZjtBQUFBLFFBQ0YsUUFBUTtBQUFBLFFBRVI7QUFBQSxNQUNGO0FBQ0EsV0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxlQUFlLENBQUM7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCxpQkFBaUI7QUFBQSxJQUNuQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
