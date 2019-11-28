import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import 'antd/dist/antd.css'

import { withApollo } from '../lib/apollo'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <React.Fragment>
        <Head>
          <title>Todo App</title>
        </Head>

        {/* <Layout route="/reviews"> */}
        <Component {...pageProps} />
        {/* </Layout> */}
      </React.Fragment>
    )
  }
}

export default withApollo(MyApp)
