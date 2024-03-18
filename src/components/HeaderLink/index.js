import Link from "next/link";

export default function HeaderLink ({url, children})
{
    return (
        <Link href={url} className="link">
          {children}
        </Link>
    );
}