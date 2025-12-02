import { execSync } from "child_process";

if (process.env.HOGE) {
  console.log("--------- HOGE ", process.env.HOGE);
} else {
  console.log("--------- NONE");
}

