"use client"

import * as React from "react"
import {
	IconDashboard,
	IconRefresh,
	IconChartBar,
	IconLock,
	IconUsers,
	IconCoins,
	IconGift,
	IconSettings2,
	IconBubbleText,
	IconHelp,
	IconSearch,
	IconFileText,
	IconReport,
	IconCode,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarGroup
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavStaking } from "./nav-staking"

const data = {
	user: {
		name: "landfi.eth",
		email: "0x403071dda7e639435ca51fb05982abe8d06ad688",
		avatar: "/avatars/landfi.jpg",
	},
	navStaking: [
		{
			title: "Staking Products",
			url: "/products",
			icon: IconRefresh, 
		},
		{
			title: "Staking Dashboard",
			url: "/dashboard",
			icon: IconDashboard,
		},
		{
			title: "Staking FAQ",
			url: "/faq",
			icon: IconBubbleText,
		}
	],
	navMain: [
		{
			title: "Vesting",
			url: "#",
			icon: IconChartBar,
		},
		{
			title: "Futures",
			url: "#",
			icon: IconLock,
		},
		{
			title: "Referrals",
			url: "#",
			icon: IconUsers,
		},
	],
	navClouds: [
		{
			title: "Stake Management",
			icon: IconCoins,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Stakes",
					url: "#",
				},
				{
					title: "Completed Stakes",
					url: "#",
				},
			],
		},
		{
			title: "Rewards",
			icon: IconGift,
			url: "#",
			items: [
				{
					title: "Claimed Rewards",
					url: "#",
				},
				{
					title: "Pending Rewards",
					url: "#",
				},
			],
		},
		{
			title: "Governance",
			icon: IconSettings2,
			url: "#",
			items: [
				{
					title: "Open Proposals",
					url: "#",
				},
				{
					title: "Archived Votes",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Support",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Wallet Search",
			url: "#",
			icon: IconSearch,
		},
	],
	documents: [
		{
			name: "Whitepaper",
			url: "#",
			icon: IconFileText,
		},
		{
			name: "Tokenomics",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Smart Contract ABI",
			url: "#",
			icon: IconCode,
		},
	],
}
export function AppSidebar({ ...props }) {
	return (
		<Sidebar className="
			border-none
			group-data-[variant=offcanvas]:bg-sidebar-mobile
			bg-sidebar-primary
			md:bg-transparent
		">
			<SidebarHeader>
				<SidebarGroup className="gap-1 group-data-[collapsible=icon]:p-0">
					<Link href="/">
						<img src="/logo.png" alt="Logo" className="w-[150px]" />
					</Link>
					<h1 className="group-data-[collapsible=icon]:hidden text-sidebar-foreground/70 text-xs">Staking Dashboard</h1>
					<span className="text-[9px] font-bold group-data-[collapsible=icon]:hidden text-sidebar-foreground/70">v0.0.1 BETA</span>
				</SidebarGroup>
			</SidebarHeader>

			<SidebarContent className="flex flex-col gap-2">
				<NavStaking items={data.navStaking} />
				<NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>

	)
}