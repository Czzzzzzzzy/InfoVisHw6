import Head from "next/head";
import Assignment6 from "./assignment6"; // ✅ 注意路径

export default function Home() {
  return (
    <>
      <Head>
        <title>Healthcare Visualization</title>
        <meta name="description" content="Healthcare visualization using node-link diagram and treemap" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: 0, padding: 0, backgroundColor: "white" }}>
        <Assignment6 />
      </main>
    </>
  );
}
