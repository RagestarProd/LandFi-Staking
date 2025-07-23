"use client"

import { IconClockBolt } from "@tabler/icons-react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
	items
}) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>More Products</SidebarGroupLabel>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild tooltip={item.title}>
								<Link href={item.url} className="mr-0">
									{item.icon && <item.icon className="h-4 w-4" />} {item.title}
									<div className="flex whitespace-nowrap items-center gap-1 p-1 ml-auto rounded-sm bg-yellow-100 text-yellow-800 text-[9px] font-medium animate-pulse">
										<IconClockBolt className="w-3 h-3" />
										Coming Soon
									</div>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
