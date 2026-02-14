import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react"
import { FamilyTree } from "./FamilyTree";
import "./App.css";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

function ThemeToggle() {
	const { setTheme, resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative rounded-full size-9"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={isDark ? "toggle light mode" : "toggle dark mode"}
		>
			<SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
	);
}

export function InputGroupDemo({ value, onChange, onApply }: { value: string; onChange: (v: string) => void; onApply?: () => void }) {
	return (
		<InputGroup className="max-w-xs">
			<InputGroupInput
				placeholder="Search..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => { if (e.key === 'Enter') onApply?.(); }}
			/>
			<InputGroupAddon>
				<Search />
			</InputGroupAddon>
			<InputGroupAddon align="inline-end">12 results</InputGroupAddon>
		</InputGroup>
	)
}

function App() {
	const { resolvedTheme } = useTheme();
	const [selectedGender, setSelectedGender] = useState<'male'|'female'|'all'>('all');
	const [appliedGender] = useState<'male'|'female'|'all'>('all');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [appliedSearch, setAppliedSearch] = useState<string | null>(null);

	// Dialog state for not-found popup
	const [dialogOpen, setDialogOpen] = useState(false);
	const [notFoundName, setNotFoundName] = useState<string | null>(null);

	const handleApplySearch = () => {
		setAppliedSearch(searchTerm.trim());
	};

	const handleNotFound = (name?: string) => {
		// use the Dialog popup instead of window.alert
		setNotFoundName(name ?? null);
		setDialogOpen(true);
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 max-w-6xl mx-auto items-center justify-between px-4">
					<h1 className="text-lg font-semibold text-foreground tracking-tight">
						Family Tree
					</h1>
					<ThemeToggle />
				</div>
			</header>

			<main className="flex-1 container max-w-6xl mx-auto px-4 py-6 flex flex-col min-h-0">
				<InputGroupDemo value={searchTerm} onChange={setSearchTerm} onApply={handleApplySearch} />

				{/* Dropdown und Button unter der Suchleiste */}
				<div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
					<div className="flex items-center gap-3">
						<label htmlFor="gender" className="text-sm font-medium">Gender</label>
						<select
							id="gender"
							value={selectedGender}
							onChange={(e) => setSelectedGender(e.target.value as 'male'|'female'|'all')}
							className="rounded-md border px-2 py-1 bg-background"
							aria-label="Geschlecht auswählen"
						>
							<option value="all">All</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<Button onClick={handleApplySearch} disabled={appliedSearch === searchTerm.trim()}>
						Search
					</Button>
				</div>

				<FamilyTree key={resolvedTheme + appliedGender + (appliedSearch ?? '')} sortByGender={appliedGender} focusName={appliedSearch ?? undefined} onNotFound={(name) => handleNotFound(name)} />

				{/* Dialog für Not Found */}
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Name nicht gefunden</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							Der Name "{notFoundName ?? ""}" wurde im Family Tree nicht gefunden.
						</DialogDescription>
						<DialogFooter>
							<Button onClick={() => setDialogOpen(false)}>OK</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</main>
		</div>
	);
}

export default App;

