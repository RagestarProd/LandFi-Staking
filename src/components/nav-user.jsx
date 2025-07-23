'use client'

import {
	IconCreditCard,
	IconDotsVertical,
	IconLogout,
	IconNotification,
	IconUserCircle,
	IconClockBolt,
	IconPlugConnected,
	IconPlugConnectedX,
} from "@tabler/icons-react"

import { useState } from "react"
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function NavUser({ user }) {
	const { isMobile } = useSidebar()
	const [connected, setConnected] = useState(true)
	const [balance, setBalance] = useState(1254.78) // Simulated LFI balance

	return (
		<SidebarMenu>
			<SidebarMenuItem className="group flex flex-col space-y-2 px-3 py-2">
				{/* Wallet Status Row */}
				<div className="flex items-center justify-between text-xs font-medium text-sidebar-foreground pl-1">
					<span>Wallet Status</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={`w-3 h-3 rounded-full 
                                    ${connected ? 'bg-green-500' : 'bg-red-500'}
                                `}
							/>
						</TooltipTrigger>
						<TooltipContent side="left">
							{connected ? 'Wallet Connected' : 'Wallet Disconnected'}
						</TooltipContent>
					</Tooltip>
				</div>

				{/* When Disconnected: Show Connect Button */}
				{!connected ? (
					<Button
						variant="default"
						size="lg"
						className="w-full mt-2"
						onClick={() => setConnected(true)}
					>
						<IconPlugConnected className="w-4 h-4 mr-2" />
						Connect Wallet
					</Button>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="group/user data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-primary"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={`https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${user.email}`} alt={user.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="text-background/80 truncate text-xs">{user.email}</span>
									<span className="text-sidebar-dark text-xs font-semibold">
										{balance.toFixed(2)} LFI
									</span>
								</div>
								<IconDotsVertical className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg "
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={`https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${user.email}`} alt={user.name} />
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{user.name}</span>
										<span className="text-primary truncate text-xs">
											{user.email}
										</span>
										<span className="text-sidebar-dark text-xs font-semibold">
											{balance.toFixed(2)} LFI
										</span>
									</div>
								</div>
							</DropdownMenuLabel>

							<DropdownMenuSeparator />

							<DropdownMenuGroup>
								<DropdownMenuItem>
									<IconUserCircle />
									Account
									<div className="flex whitespace-nowrap items-center gap-1 p-1 ml-auto rounded-sm bg-yellow-100 text-yellow-800 text-[9px] font-medium animate-pulse">
										<IconClockBolt className="w-3 h-3" />
										Coming Soon
									</div>
								</DropdownMenuItem>
							</DropdownMenuGroup>

							<DropdownMenuSeparator />

							<DropdownMenuItem
								onClick={() => setConnected(false)}
							>
								<IconPlugConnectedX className="mr-2 h-4 w-4" />
								Disconnect Wallet
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
