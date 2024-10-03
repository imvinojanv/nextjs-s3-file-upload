import { ArrowRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const routes = [
    { name: "AWS S3 Bucket", href: "/s3" },
    { name: "Edgestore", href: "/edgestore" },
    { name: "Edgestore with S3", href: "/edgestore-s3" },
    { name: "Bunny CDN", href: "/bunny-cdn" },
    { name: "Next S3 Upload", href: "/next-s3-upload" },
    { name: "Cloudflare R2", href: "/cloudflare-r2" },
    { name: "Firebase Storage", href: "/firebase-storage" },
    { name: "Backblaze B2 Cloud Storage", href: "/backblaze-b2" },
    { name: "Storj (Decentralized Cloud Storage) with S3", href: "/storj-s3" },
]

const Home = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="mt-4 mb-8 text-xl font-semibold text-slate-800 tracking-wide">Click to navigate to the separate Image upload providers</h1>
            <div className="grid grid-cols-2 gap-4">
                {routes.map(route => (
                    <Link key={route.href} href={route.href}>
                        <p className="px-6 py-4 rounded-md flex justify-between items-center font-medium text-gray-900 hover:text-gray-700 hover:bg-slate-100 border">
                            {route.name}
                            <ArrowRightIcon className="w-6 h-6"/>
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Home