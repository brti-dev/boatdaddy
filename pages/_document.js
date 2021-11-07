/**
 * Rewrites Next document tree. The only reason to do this is to inject `lang` prop into <html> tag..
 */
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script src="https://apis.google.com/js/api:client.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
