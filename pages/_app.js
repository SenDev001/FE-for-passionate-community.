import React, { useEffect } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import {
  ThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../theme'
import '../styles/globals.css'
import { AppProvider } from '@/context/state'
import analytics from '@/const/analytics'
import SnipcartManager from '@/components/Snipcart/SnipcartManager'
import PianoManager from '@/components/piano/PianoManager'
import { ApolloProvider } from '@apollo/client'
import { client } from '../lib/apollo-client'

Router.events.on('routeChangeComplete', () =>
  typeof window !== 'undefined' && typeof window.tp !== 'undefined'
    ? window?.tp?.experience?.execute()
    : () => {}
)

const generateClassName = createGenerateClassName({
  productionPrefix: 'ascd',
})

function App({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useEffect(() => {
    analytics.page({
      title: pageProps?.SEO?.fields?.title
        ? pageProps?.SEO?.fields?.title
        : document?.title,
      href: pageProps?.SEO?.fields?.pageUrl
        ? pageProps?.SEO?.fields?.pageUrl
        : location?.href,
      path: location?.pathname,
    })
  }, [pageProps])

  useEffect(() => {
    const pathname = location?.pathname.toLowerCase().replaceAll('_', '-')
    if (pathname !== location?.pathname) {
      setTimeout(() => {
        Router.push(pathname)
      }, 50)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        <link rel='icon' type='image/ico' href='/favicon.ico' />
      </Head>
      <StylesProvider generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApolloProvider client={client}>
            <AppProvider>
              <Component {...pageProps} />
            </AppProvider>
            <SnipcartManager />
            <PianoManager />
          </ApolloProvider>
        </ThemeProvider>
      </StylesProvider>
    </React.Fragment>
  )
}

export default App
