import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav'
import '@reach/skip-nav/styles.css'

import { useAuth } from 'context/auth-context'
import classes from './Layout.module.scss'
import NavAuthenticated from 'components/NavAuthenticated'
import NavUnauthenticated from 'components/NavUnauthenticated'
import config from '../../../package.json'

const PAGES = [
  { link: '/hail', title: 'Hail a Boat Daddy' },
  { link: '/daddies', title: 'Boat Daddies' },
  { link: '/about', title: 'About' },
  { link: '/privacy-policy', title: 'Policy' },
]

export type LayoutProps = {
  title?: string
  showFooter?: Boolean
  children: React.ReactChild | React.ReactChild[]
}

function Session() {
  const auth = useAuth()

  return (
    <div id="session">
      {auth.data ? <NavAuthenticated /> : <NavUnauthenticated />}
    </div>
  )
}

function Layout({
  title = config.siteTitle,
  showFooter = true,
  children,
}: LayoutProps) {
  const router = useRouter()
  const { pathname } = router
  const pathnameRoot = pathname.split('/', 2).join('/')

  // const currentPageIndex = PAGES.findIndex(page => page.link === pathnameRoot)
  const isCurrentPage = (link: string) => link === pathnameRoot

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="true"
        />
        <meta
          property="og:image"
          content="https://og-image.vercel.app/%F0%9F%9B%A5%EF%B8%8F%F0%9F%91%A8.png?theme=light&md=0&fontSize=350px"
        />
        <meta name="og:title" content={config.siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <SkipNavLink />
      <header id="top" className={classes.header}>
        <h1>
          <Link href="/" aria-label="Boat Daddy home page">
            🛥️👨
          </Link>
        </h1>
        <Session />
      </header>
      <SkipNavContent />
      <main className={classes.main}>{children}</main>
      {showFooter && (
        <footer className={classes.footer}>
          <nav aria-label="Footer">
            <ul>
              {PAGES.map(({ link, title: pageTitle }) => (
                <li
                  key={link}
                  className={isCurrentPage(link) ? 'current' : undefined}
                >
                  <Link href={link}>{pageTitle}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div
            style={{
              lineHeight: 1.6,
              marginTop: '1em',
              fontSize: '80%',
            }}
          >
            &copy;2021 <span style={{ opacity: 0.33 }}>|</span> Amanda and
            Maranda, CEOs <span style={{ opacity: 0.33 }}>|</span>{' '}
            <a href="https://brti.dev">Matt Berti</a> production
          </div>
        </footer>
      )}
    </>
  )
}

export default Layout
