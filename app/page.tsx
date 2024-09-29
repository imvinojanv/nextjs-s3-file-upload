import { ArrowRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const routes = [
    { name: "AWS S3 Bucket", href: "/s3" },
    { name: "Edgestore", href: "/edgestore" },
    { name: "Edgestore with S3", href: "/edgestore-s3" },
]

const Home = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="mt-4 mb-8 text-xl font-semibold text-slate-800 tracking-wide">Click to navigate to the separate Image upload providers</h1>
            <div className="flex flex-col gap-y-4">
                {routes.map(route => (
                    <Link key={route.href} href={route.href}>
                        <p className="px-4 py-2 rounded-md flex justify-between items-center font-medium text-gray-900 hover:text-gray-700 hover:bg-slate-100 border">
                            {route.name}
                            <ArrowRightIcon />
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Home