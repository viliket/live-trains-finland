import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import {
  DocumentHeadTags,
  DocumentHeadTagsProps,
  documentGetInitialProps,
} from '@mui/material-nextjs/v16-pagesRouter';
import {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps,
} from 'next/document';

function InitMetaThemeColorScript(): React.ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const currentTheme = document.documentElement.getAttribute('data-theme');

              const matchingMetaTag = document.querySelector(
                \`meta[name="theme-color"][media*="\${currentTheme}"]\`
              );
              if (!matchingMetaTag) return;

              const metaContentColor = matchingMetaTag.getAttribute('content');
              if (!metaContentColor) return;

              document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
                meta.setAttribute('content', metaContentColor);
              });
            } catch (_) {}
          })();
        `,
      }}
    />
  );
}

export default function Document(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang="fi">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f9f9fb"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#1e1e1e"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
        />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <InitColorSchemeScript attribute="data-theme" />
        <InitMetaThemeColorScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  return documentGetInitialProps(ctx);
};
