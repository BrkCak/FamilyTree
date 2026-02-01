import { useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./App.css";

const techLinks = [
	{ href: "https://vite.dev", src: viteLogo, alt: "Vite", label: "Vite", tech: "vite" },
	{ href: "https://react.dev", src: reactLogo, alt: "React", label: "React", tech: "react" },
	{ href: "https://hono.dev/", src: honoLogo, alt: "Hono", label: "Hono", tech: "hono" },
	{
		href: "https://workers.cloudflare.com/",
		src: cloudflareLogo,
		alt: "Cloudflare",
		label: "Cloudflare Workers",
		tech: "cloudflare",
	},
];

function App() {
	const [count, setCount] = useState(0);
	const [name, setName] = useState("unknown");

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 max-w-4xl mx-auto items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<img
							src={viteLogo}
							alt=""
							className="h-7 w-7"
							aria-hidden
						/>
						<span className="font-semibold text-foreground">
							Stack Template
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						{["Vite", "React", "Hono", "Cloudflare"].map((tech) => (
							<Badge
								key={tech}
								variant="secondary"
								className="font-normal text-xs"
							>
								{tech}
							</Badge>
						))}
					</div>
				</div>
			</header>

			<main className="flex-1 container max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
				{/* Hero */}
				<section className="text-center space-y-4 mb-12">
					<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
						Vite + React + Hono + Cloudflare
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Edit <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">src/App.tsx</code> and save to test HMR. Deploy to the edge with Workers.
					</p>
				</section>

				{/* Tech logos */}
				<section className="flex flex-wrap justify-center gap-6 mb-14">
					{techLinks.map(({ href, src, label, tech }) => (
						<Tooltip key={label}>
							<TooltipTrigger asChild>
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className={`logo-link logo-link--${tech} inline-flex rounded-lg p-3 transition-all hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
									aria-label={`${label} (opens in new tab)`}
								>
									<img
										src={src}
										alt=""
										className="h-12 w-12 sm:h-14 sm:w-14 logo"
										aria-hidden
									/>
								</a>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								{label} — click to learn more
							</TooltipContent>
						</Tooltip>
					))}
				</section>

				<Separator className="mb-12 w-full max-w-md" />

				{/* Feature cards */}
				<section className="grid gap-6 w-full sm:grid-cols-2 max-w-3xl">
					<Card className="overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg">Hot Module Replacement</CardTitle>
							<CardDescription>
								Counter updates instantly without a full reload.
							</CardDescription>
						</CardHeader>
						<CardContent className="pb-4">
							<div className="rounded-lg bg-muted/50 py-6 text-center">
								<span className="text-3xl font-bold tabular-nums text-foreground">
									{count}
								</span>
							</div>
						</CardContent>
						<CardFooter className="pt-0">
							<Button
								onClick={() => setCount((c) => c + 1)}
								aria-label="Increment count"
								className="w-full"
							>
								Count is {count}
							</Button>
						</CardFooter>
					</Card>

					<Card className="overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg">API from Worker</CardTitle>
							<CardDescription>
								Edit <code className="text-xs">worker/index.ts</code> to change the response.
							</CardDescription>
						</CardHeader>
						<CardContent className="pb-4">
							<div className="rounded-lg bg-muted/50 py-6 text-center">
								<span className="text-lg font-medium text-foreground break-all">
									{name}
								</span>
							</div>
						</CardContent>
						<CardFooter className="pt-0">
							<Button
								variant="secondary"
								onClick={() => {
									fetch("/api/")
										.then((res) => res.json() as Promise<{ name: string }>)
										.then((data) => setName(data.name));
								}}
								aria-label="Get name from API"
								className="w-full"
							>
								Fetch name from API
							</Button>
						</CardFooter>
					</Card>
				</section>

				<p className="mt-12 text-sm text-muted-foreground">
					Click on the logos to learn more about each technology.
				</p>
			</main>
		</div>
	);
}

export default App;
