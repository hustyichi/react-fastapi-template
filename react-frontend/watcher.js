import chokidar from "chokidar";
import { exec } from "child_process";
import { config } from "dotenv";

config({ path: ".env" });

const openapiFile = process.env.OPENAPI_OUTPUT_FILE || "./shared-data/openapi.json";

// Watch for changes in openapi.json
const watcher = chokidar.watch(openapiFile, {
  persistent: true,
  ignoreInitial: false,
});

watcher.on("change", (path) => {
  console.log(`File ${path} has been changed. Regenerating client...`);
  exec("npm run generate-client", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

console.log(`Watching for changes in ${openapiFile}...`);

