"use client"

import * as React from "react"
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconCurrencyEthereum,
	IconCoins
} from "@tabler/icons-react"
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"

const columns = [
	{
		accessorKey: "status",
		header: "",
		cell: ({ row }) => {
			const status = row.original.status || "active"

			const colorMap = {
				active: "bg-green-500",
				pending: "bg-yellow-500",
				completed: "bg-blue-500",
				failed: "bg-red-500",
			}

			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={`h-2.5 w-2.5 rounded-full ${colorMap[status] || "bg-muted"} mx-auto`}
						/>
					</TooltipTrigger>
					<TooltipContent side="right" className="text-xs">
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</TooltipContent>
				</Tooltip>
			)
		},
	},
	{
		accessorKey: "product",
		header: "Staking Product",
		cell: ({ row }) => (
			<Badge variant="outline" className="flex items-center gap-1 text-muted-foreground px-1.5">
				<IconCurrencyEthereum className="size-3" />
				{row.original.product}
			</Badge>
		),
	},
	{
		accessorKey: "wallet",
		header: "Wallet Address",
		cell: ({ row }) => (
			<span className="font-mono text-xs">
				{row.original.wallet}
			</span>
		),
	},
	{
		accessorKey: "amountStaked",
		header: () => <div className="text-right">Tokens Staked (LFI)</div>,
		cell: ({ row }) => (
			<div className="text-right">
				{parseFloat(row.original.amountStaked).toLocaleString()}				
				<IconCoins className="w-4 h-4 inline-block mx-1" /> LFI 
			</div>
		),
	},
	{
		accessorKey: "rewardDue",
		header: () => <div className="text-right">Reward Due (USDC)</div>,
		cell: ({ row }) => (
			<div className="text-right text-green-500 font-medium">
				${parseFloat(row.original.rewardDue).toFixed(2)}
			</div>
		),
	},
	{
		accessorKey: "timestamp",
		header: "Date & Time",
		cell: ({ row }) => {
			const date = new Date(row.original.timestamp)
			return (
				<div className="text-sm text-muted-foreground">
					{date.toLocaleDateString()} <br className="block md:hidden" />
					<span className="whitespace-nowrap">{date.toLocaleTimeString()}</span>
				</div>
			)
		},
	},
	{
		id: "viewTx",
		header: " ",
		cell: ({ row }) => (
			<a
				href={row.original.txUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center text-sm text-primary hover:underline"
			>
				<IconCurrencyEthereum className="mr-1 size-4" />
				View Tx
			</a>
		),
	},
]

export function DataTable({ data: initialData }) {
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 30,
	})

	const table = useReactTable({
		data: initialData,
		columns,
		state: { pagination },
		getRowId: (row) => row.id.toString(),
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	})

	return (
		<div className="w-full flex-col gap-6 px-4 lg:px-6">
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted sticky top-0 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between pt-4">
				<div className="flex w-full items-center gap-8 lg:w-fit">
					<div className="hidden items-center gap-2 lg:flex">
						<Label htmlFor="rows-per-page" className="text-sm font-medium">
							Rows per page
						</Label>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => table.setPageSize(Number(value))}>
							<SelectTrigger size="sm" className="w-20" id="rows-per-page">
								<SelectValue placeholder={table.getState().pagination.pageSize} />
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-fit items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
					</div>
					<div className="ml-auto flex items-center gap-2 lg:ml-0">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to first page</span>
							<IconChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to previous page</span>
							<IconChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to next page</span>
							<IconChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden size-8 lg:flex"
							size="icon"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to last page</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
