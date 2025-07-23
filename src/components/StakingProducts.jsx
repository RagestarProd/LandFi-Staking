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
	IconClock,
	IconLockCheck,
	IconCircleCheck,
	IconHourglass,
	IconCalendarTime,
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
		border: '#eab308',
		icon: <IconCalendarTime className="w-4 h-4 mr-1" />,
		tooltip: 'This product is coming soon. Staking is not yet available.',
	},
	[PHASES.BUY]: {
		badge: 'bg-blue-100 text-blue-800',
		border: '#3b82f6',
		icon: <IconHourglass className="w-4 h-4 mr-1" />,
		tooltip: 'The staking window is open. You can stake your LandFi tokens now.',
	},
	[PHASES.STAKING]: {
		badge: 'bg-purple-100 text-purple-800',
		border: '#8b5cf6',
		icon: <IconLockCheck className="w-4 h-4 mr-1" />,
		tooltip: 'The pool is locked. Rewards are being calculated over time.',
	},
	[PHASES.COMPLETED]: {
		badge: 'bg-green-100 text-green-800',
		border: '#22c55e',
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
	},
]

export function StakingProducts() {
	const [stakes, setStakes] = useState({})
	const [now, setNow] = useState(Date.now())
	const [filter, setFilter] = useState('All')
	const [hasMounted, setHasMounted] = useState(false)

	const filteredProducts = stakingProducts.filter(
		(p) => filter === 'All' || p.phase === filter
	)
	const phases = ['All', ...Object.values(PHASES)]

	useEffect(() => {
		setHasMounted(true)
		const interval = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(interval)
	}, [])

	const handleStake = (id, product) => {
		const amount = Number(stakes[id])
		if (!amount || amount < product.minStake) {
			toast.error(`Minimum stake is ${product.minStake} LandFi`)
			return
		}
		if (product.staked + amount > product.maxStake) {
			toast.error(`Cannot exceed max stake of ${product.maxStake}`)
			return
		}
		const estimatedReward = ((amount / product.maxStake) * product.usdcRewards).toFixed(2)
		toast.success(`Staked ${amount} LandFi. Estimated Reward: $${estimatedReward} USDC`)
	}

	if (!hasMounted) return null

	return (
		<div>
			<div className="px-4 lg:px-6 mb-6 space-y-4">
				<h2 className="text-3xl font-bold tracking-tight">Staking Products</h2>
				<p className="text-muted-foreground max-w-2xl">
					Below you'll find all available staking opportunities.
				</p>

				<div className="flex flex-wrap gap-2">
					{phases.map((phase) => (
						<Button
							key={phase}
							variant={filter === phase ? 'default' : 'outline'}
							onClick={() => setFilter(phase)}
							className="text-sm"
						>
							{phase}
						</Button>
					))}
				</div>
			</div>

			<div className="w-full flex flex-wrap gap-4 px-4 lg:px-6 items-center justify-center">
				{filteredProducts.map((product) => {
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
								: 'flex-3 h-[600px]'
								}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}

						>
							<Card className={`group overflow-hidden rounded-xl max-w-[450px] p-0 h-full flex flex-col border-[3px]`}
								style={{
									boxShadow: `0 0 6px 3px ${PHASE_STYLES[product.phase].border}`,
									borderColor: `${PHASE_STYLES[product.phase].border}`
								}}>
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
										<div className="absolute inset-0 backdrop-blur-md group-hover:opacity-0! transition-all duration-500 ease-in-out" />

										<div className="relative z-10 p-5 flex flex-col justify-between w-full h-full flex-1">
											<CardTitle
												className={`bg-clip-text text-white text-shadow-black/30 text-shadow-sm mb-auto group-hover:text-shadow-lg group-hover:text-shadow-black transition-all duration-500
													${[PHASES.COMPLETED, PHASES.ANNOUNCED].includes(product.phase)
														? 'text-2xl'
														: 'text-4xl'
													}`}
											>
												{product.name}
											</CardTitle>

											<Tooltip>
												<TooltipTrigger asChild>
													<span
														className={`flex items-center px-2 py-1 rounded-md text-m mt-auto mr-auto font-medium ${PHASE_STYLES[product.phase].badge}`}
													>
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

									<div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
										<div className="flex items-center gap-2">
											<IconGauge className="w-4 h-4" />
											<span>Min Stake: {product.minStake} LandFi</span>
										</div>
										<div className="flex items-center gap-2">
											<IconTrophy className="w-4 h-4" />
											<span>USDC Rewards: ${product.usdcRewards.toLocaleString()}</span>
										</div>
									</div>

									{product.phase === PHASES.BUY && (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Input
													type="number"
													placeholder="Amount"
													min={product.minStake}
													className="w-full"
													value={stakes[product.id] || ''}
													onChange={(e) =>
														setStakes((prev) => ({
															...prev,
															[product.id]: e.target.value,
														}))
													}
												/>
												<Button onClick={() => handleStake(product.id, product)}>Stake</Button>
											</div>
											{stakeAmount > 0 && (
												<p className="text-sm text-muted-foreground ml-1">
													Estimated Reward: ${estimatedReward} USDC
												</p>
											)}
										</div>
									)}

									{product.phase === PHASES.COMPLETED && (
										<Button variant="outline" className="w-full">
											<IconEye className="w-4 h-4 mr-2" />
											View Staking Results
										</Button>
									)}
								</CardContent>
							</Card>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}
