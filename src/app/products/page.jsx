'use client'

import { StakingProductsHead } from "@/components/StakingProductsHead"
import { StakingProducts } from "@/components/StakingProducts"
import { SidebarInset } from "@/components/ui/sidebar"
import { motion } from "framer-motion"

export default function Page() {
	return (
		<>
			<SidebarInset className="bg-transparent! text-center items-center h-full">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="text-4xl lg:text-5xl font-bold text-white mb-4"
				>LandFi Staking
				</motion.h1>
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="text-2xl font-bold text-white mb-8"
				>Explore our staking opportunities below — or browse other products in the sidebar.</motion.h2>

				<StakingProductsHead />
			</SidebarInset>
		</>
	)
}
