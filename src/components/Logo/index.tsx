import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src={`/logo.svg`}
        alt={`logo`}
        title={`logo`}
        width={30}
        height={30}
      />
    </Link>
  )
}
