import Layout from 'src/components/Layout'

export default function ErrorPage({
  title,
  message,
  children,
}: {
  title?: string
  message?: string
  children?: React.ReactElement
}) {
  return (
    <Layout>
      {title && <h1>{title}</h1>}
      {message && <p>{message}</p>}
      {children}
    </Layout>
  )
}
