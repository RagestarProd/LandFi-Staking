'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    IconCoins,
    IconLock,
    IconChartBar,
    IconClock,
    IconShield,
    IconSend,
} from "@tabler/icons-react"

import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"

export default function StakingFaqPage() {
    return (
        <SidebarInset className="bg-background !m-0 !ml-5 !rounded-xl !mr-5 md:!ml-0">
            <SiteHeader />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col md:flex-row gap-4 p-4 md:gap-6 md:p-6">

                        {/* FAQ Card */}
                        <Card className="flex-1">
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full space-y-2">

                                    <AccordionItem value="q1">
                                        <AccordionTrigger className="text-left">
                                            <div className="flex items-center gap-2">
                                                <IconCoins className="w-4 h-4 text-yellow-600" />
                                                What is staking?
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Staking is the process of locking up your LandFi tokens in a smart contract to earn rewards. It's a way to support the network and receive USDC incentives.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="q2">
                                        <AccordionTrigger className="text-left">
                                            <div className="flex items-center gap-2">
                                                <IconLock className="w-4 h-4 text-blue-600" />
                                                Are my tokens locked when I stake?
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. During the staking period, your tokens will be locked and cannot be withdrawn until the cycle ends.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="q3">
                                        <AccordionTrigger className="text-left">
                                            <div className="flex items-center gap-2">
                                                <IconChartBar className="w-4 h-4 text-purple-600" />
                                                How are staking rewards calculated?
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Rewards are calculated based on the amount of LandFi tokens staked and the predefined APY of each staking cycle. Rewards are paid in USDC.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="q4">
                                        <AccordionTrigger className="text-left">
                                            <div className="flex items-center gap-2">
                                                <IconClock className="w-4 h-4 text-pink-600" />
                                                When do I receive my rewards?
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Rewards are distributed at the end of each staking cycle, along with your original staked tokens.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="q5">
                                        <AccordionTrigger className="text-left">
                                            <div className="flex items-center gap-2">
                                                <IconShield className="w-4 h-4 text-green-600" />
                                                Is staking safe?
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Staking is handled by secure smart contracts. While there’s always some risk in crypto, we prioritize safety and transparency in all products.
                                        </AccordionContent>
                                    </AccordionItem>

                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Telegram Card */}
                        <Card className="flex-1 bg-[#0088cc] text-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <IconSend className="w-5 h-5" />
                                    Join Our Telegram
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3">
                                <p>
                                    Stay connected with the LandFi community! Join our official Telegram group to ask questions, receive updates, and be the first to hear about new staking opportunities.
                                </p>
                                <a
                                    href="https://t.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 px-4 py-2 bg-white text-[#0088cc] font-medium rounded-md hover:bg-blue-100 transition"
                                >
                                    Join Now
                                </a>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </SidebarInset>
    )
}
