'use client'

import { useEffect, useState } from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
	IconClockBolt,
	IconCoins,
	IconTrophy,
	IconGauge,
	IconEye,
	IconCircleCheck,
	IconHourglass,
	IconCalendarTime,
	IconLockCheck,
	IconUsers
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const PHASES = {
	ANNOUNCED: 'Announced',
	BUY: 'Buy Phase',
	STAKING: 'Staking Phase',
	COMPLETED: 'Completed',
}

const PHASE_STYLES = {
	[PHASES.ANNOUNCED]: {
		badge: 'bg-yellow-100 text-yellow-800',
		border: 'border-yellow-500',
		col: 'rgba(0,201,81,1)',
		icon: <IconCalendarTime className="w-4 h-4 mr-1" />,
		tooltip: 'This product is coming soon. Staking is not yet available.',
	},
	[PHASES.BUY]: {
		badge: 'bg-blue-100 text-blue-800',
		border: 'border-blue-500',
		col: 'rgba(48,134,254,1)',
		icon: <IconHourglass className="w-4 h-4 mr-1" />,
		tooltip: 'The staking window is open. You can stake your LandFi tokens now.',
	},
	[PHASES.STAKING]: {
		badge: 'bg-purple-100 text-purple-800',
		border: 'border-purple-500',
		col: 'rgba(170,80,255,1)',
		icon: <IconLockCheck className="w-4 h-4 mr-1" />,
		tooltip: 'The pool is locked. Rewards are being calculated over time.',
	},
	[PHASES.COMPLETED]: {
		badge: 'bg-green-100 text-green-800',
		border: 'border-green-500',
		col: 'rgba(0,201,81,1)',
		icon: <IconCircleCheck className="w-4 h-4 mr-1" />,
		tooltip: 'This product has finished its staking cycle. You can view the results.',
	},
}

const formatTime = (ms) => {
	const totalSeconds = Math.floor(ms / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60
	return `${hours}h ${minutes}m ${seconds}s`
}

const stakingProducts = [
	{
		id: 'prelaunch',
		name: 'Staking Launch Test',
		phase: PHASES.COMPLETED,
		phaseEndsAt: null,
		staked: 1000,
		minStake: 10,
		maxStake: 1000,
		usdcRewards: 100,
		walletCount: 12,
	},
	{
		id: 'intro',
		name: 'Intro Staking Product',
		phase: PHASES.STAKING,
		phaseEndsAt: Date.now() + 1000 * 60 * 60 * 24 * 2,
		staked: 50000,
		minStake: 50,
		maxStake: 50000,
		usdcRewards: 5000,
		walletCount: 38,
	},
	{
		id: 'july-2025',
		name: 'July 2025 Cycle',
		phase: PHASES.BUY,
		phaseEndsAt: Date.now() + 1000 * 60 * 60 * 5,
		staked: 32000,
		minStake: 100,
		maxStake: 50000,
		usdcRewards: 12000,
		walletCount: 75,
	},
	{
		id: 'exclusive',
		name: 'Exclusive Staking Pool',
		phase: PHASES.ANNOUNCED,
		phaseEndsAt: null,
		staked: 0,
		minStake: 200,
		maxStake: 30000,
		usdcRewards: 10000,
		walletCount: 0,
	},
]


export function StakingProductsHead() {
	const [stakes, setStakes] = useState({})
	const [now, setNow] = useState(Date.now())
	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(interval)
	}, [])

	return (
		<div className="w-full flex flex-wrap gap-4 px-4 lg:px-6 items-center justify-center">
			{stakingProducts.map((product) => {
				const timeRemaining =
					product.phaseEndsAt && product.phase !== PHASES.ANNOUNCED
						? product.phaseEndsAt - now
						: null
				const phaseProgress =
					product.phaseEndsAt && timeRemaining > 0
						? ((product.phaseEndsAt - now) / (product.phaseEndsAt - (product.phaseEndsAt - 1000 * 60 * 60 * 24))) * 100
						: 100
				const stakeProgress = Math.min((product.staked / product.maxStake) * 100, 100)

				const stakeAmount = Number(stakes[product.id]) || 0
				const estimatedReward = ((stakeAmount / product.maxStake) * product.usdcRewards).toFixed(2)

				return (
					<motion.div
						key={product.id}
						className={`${[PHASES.COMPLETED, PHASES.ANNOUNCED].includes(product.phase)
							? 'flex-2 h-[540px]'
							: 'flex-3 h-[600px]'}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						<Card
							className={`
							group overflow-hidden rounded-xl border-[3px] 
							${PHASE_STYLES[product.phase].border}
							max-w-[450px] min-w-[250px] p-0 h-full flex flex-col duration-300 
							shadow-[0_0px_0px_8px_${PHASE_STYLES[product.phase].col}] hover:shadow-[0_25px_50px_-12px_${PHASE_STYLES[product.phase].col}]
							transition-all ease-in-out
							`}
						>
							<CardHeader className="relative p-0 m-0">
								<div
									className="relative flex items-start justify-between p-0 flex-col min-h-[180px] flex-1"
									style={{
										backgroundImage: `url("https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name)}&backgroundType=gradientLinear&backgroundColor=0dbd82&shape1Color=48b8d0&shape2Color=1a2037&shape3Color=4a86b1")`,
										backgroundSize: 'cover',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center',
									}}
								>
									<div className="absolute inset-0 backdrop-blur-md group-hover:opacity-0 transition-all duration-500 ease-in-out" />

									<div className="relative z-10 p-5 flex flex-col justify-between w-full h-full flex-1">
										<CardTitle
											className={`text-left bg-clip-text text-white text-shadow-black/30 text-shadow-sm mb-auto group-hover:text-shadow-lg group-hover:text-shadow-black transition-all duration-500 ${[PHASES.COMPLETED, PHASES.ANNOUNCED].includes(product.phase) ? 'text-2xl' : 'text-4xl'}`}
										>
											{product.name}
										</CardTitle>

										<Tooltip>
											<TooltipTrigger asChild>
												<span className={`flex items-center px-2 py-1 rounded-md text-m mt-auto mr-auto font-medium ${PHASE_STYLES[product.phase].badge}`}>
													{PHASE_STYLES[product.phase].icon}
													{product.phase}
												</span>
											</TooltipTrigger>
											<TooltipContent>{PHASE_STYLES[product.phase].tooltip}</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-4 pt-0 pb-4 flex-grow flex flex-col justify-between">
								{product.phase !== PHASES.ANNOUNCED && product.phaseEndsAt && (
									<div className="space-y-1">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<IconClockBolt className="w-4 h-4" />
											<span>Time remaining: {formatTime(timeRemaining)}</span>
											{phaseProgress >= 100 && <IconCircleCheck className="w-4 h-4 text-green-500" />}
										</div>
										<Progress value={100 - phaseProgress} />
									</div>
								)}

								<div className="space-y-1">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<IconCoins className="w-4 h-4" />
										<span>{product.staked.toLocaleString()} / {product.maxStake.toLocaleString()} LandFi Staked</span>
										{stakeProgress >= 100 && <IconCircleCheck className="w-4 h-4 text-green-500" />}
									</div>
									<Progress value={stakeProgress} />
								</div>

								<div className="grid gap-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<IconGauge className="w-4 h-4" />
										<span>Min Stake: {product.minStake} LandFi</span>
									</div>
								</div>

								<div className="grid gap-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<IconTrophy className="w-4 h-4" />
										<span>USDC Rewards: ${product.usdcRewards.toLocaleString()}</span>
									</div>
								</div>

								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<IconUsers className="w-4 h-4" />
									<span>{product.walletCount} wallets</span>
								</div>

								{product.phase === PHASES.BUY && (
									<div className="bg-blue-50 p-3 rounded-md space-y-2 mt-4 border border-blue-200">
										<div className="flex items-center gap-2">
											<Input
												type="number"
												placeholder="Amount to stake"
												value={stakes[product.id] || ''}
												onChange={(e) =>
													setStakes({ ...stakes, [product.id]: e.target.value })
												}
												className="flex-grow"
												min={product.minStake}
												max={product.maxStake}
											/>
											<Button
												onClick={() =>
													toast.success(`Staked ${stakes[product.id]} tokens!`)
												}
												className="!bg-blue-500"
											>
												Submit Stake
											</Button>
										</div>
										{stakeAmount > 0 && (
											<div className="text-sm text-blue-700">
												Estimated USDC Reward: <strong>${estimatedReward}</strong>
											</div>
										)}
									</div>
								)}

								{product.phase === PHASES.COMPLETED && (
									<div className="bg-green-50 p-3 rounded-md space-y-2 mt-4 border border-green-200">
										<div className="flex items-center gap-2">
											<Button className="w-full">
												View Results
											</Button>
										</div>
									</div>
								)}

								{product.phase === PHASES.STAKING && (
									<div className="bg-purple-50 p-3 rounded-md space-y-2 mt-4 border border-purple-200">
										<div className="flex items-center gap-2">
											<Button className="w-full !bg-purple-500">
												View TXs
											</Button>
										</div>
									</div>
								)}

								{product.phase === PHASES.ANNOUNCED && (
									<div className="bg-yellow-50 p-3 rounded-md space-y-2 mt-4 border border-yellow-200">
										<div className="flex items-center gap-2">
											<Button className="w-full !bg-yellow-500">
												Coming Soon
											</Button>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				)
			})}
		</div>
	)
}
