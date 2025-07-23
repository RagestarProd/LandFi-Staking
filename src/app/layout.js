
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
	SidebarProvider,
} from "@/components/ui/sidebar"
import IntroScreen from '@/components/IntroScreen'


export const metadata = {
	title: "LandFi Staking",
	description: "Invest and innovate",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`antialiased bg-[linear-gradient(150deg,_#1a2037_20%,_#364377_48%,_#16a36e_76%,_#00ff84)]`}
			>
				<IntroScreen />
				<SidebarProvider
					className="gap-2 !my-5 !relative"
					style={
						{
							"--sidebar-width": "250px",
							"--header-height": "calc(var(--spacing) * 12)"
						}
					}>

					<AppSidebar variant="inset" />
					{children}
				</SidebarProvider>

			</body>
		</html>
	);
}
