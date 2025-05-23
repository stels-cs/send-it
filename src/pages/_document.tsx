// import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { Head, Html, Main, NextScript } from "next/document";

function MyDocument() {
  return (
    <Html lang="en">
      <Head />
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  );
}

// MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
//   const cache = createCache();
//   const originalRenderPage = ctx.renderPage;
//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: (App) => (props) => (
//         <StyleProvider cache={cache}>
//           <App {...props} />
//         </StyleProvider>
//       ),
//     });
//
//   const initialProps = await Document.getInitialProps(ctx);
//   const style = extractStyle(cache, true);
//   return {
//     ...initialProps,
//     styles: (
//       <>
//         {initialProps.styles}
//         <style dangerouslySetInnerHTML={{ __html: style }} />
//       </>
//     ),
//   };
// };
export default MyDocument;
