import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react"
import { FamilyTree } from "./FamilyTree";
import "./App.css";

function ThemeToggle() {
	const { setTheme, resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative rounded-full size-9"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={isDark ? "Zu Hellmodus wechseln" : "Zu Dunkelmodus wechseln"}
		>
			<SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
	);
}

export function InputGroupDemo() {
	return (
		<InputGroup className="max-w-xs">
		<InputGroupInput placeholder="Search..." />
		<InputGroupAddon>
			<Search />
		</InputGroupAddon>
		<InputGroupAddon align="inline-end">12 results</InputGroupAddon>
		</InputGroup>
	)
}

function App() {
	const { resolvedTheme } = useTheme();

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 max-w-6xl mx-auto items-center justify-between px-4">
					<h1 className="text-lg font-semibold text-foreground tracking-tight">
						Demiral Family Tree
					</h1>
					<ThemeToggle />
				</div>
			</header>

			<main className="flex-1 container max-w-6xl mx-auto px-4 py-6 flex flex-col min-h-0">
				<InputGroupDemo />
				<FamilyTree key={resolvedTheme} />
			</main>
		</div>
	);
}

export default App;