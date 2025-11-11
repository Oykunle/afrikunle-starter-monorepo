import { Redirect } from "expo-router";

export default function Index() {
  // When the app starts, it will automatically go to the Python Shell
  return <Redirect href="/shell" />;
}