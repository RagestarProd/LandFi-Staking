'use client'

import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

import data from "../data.json"

export default function Page() {
	return (
		<>
			<SidebarInset className="bg-background !m-0 !ml-5 !rounded-xl !mr-5 md:!ml-0">
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<SectionCards />
							<DataTable data={data} />
						</div>
					</div>
				</div>
			</SidebarInset>
		</>
	)
}
