import Link from "next/link"
import { Sprout, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
	return (
		<footer className="bg-muted/50 border-t">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<Sprout className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="font-serif text-xl font-bold">KrishiConnect</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Connecting farmers directly with consumers across Nepal. Fresh produce, fair prices, authentic quality.
						</p>
						<div className="flex space-x-4">
							<Link href="#" className="text-muted-foreground hover:text-primary">
								<Facebook className="h-5 w-5" />
							</Link>
							<Link href="#" className="text-muted-foreground hover:text-primary">
								<Twitter className="h-5 w-5" />
							</Link>
							<Link href="#" className="text-muted-foreground hover:text-primary">
								<Instagram className="h-5 w-5" />
							</Link>
						</div>
					</div>
					<div className="space-y-4">
						<h3 className="font-semibold">Quick Links</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/products" className="text-muted-foreground hover:text-primary">
									All Products
								</Link>
							</li>
							<li>
								<Link href="/bidding" className="text-muted-foreground hover:text-primary">
									Live Bidding
								</Link>
							</li>
							<li>
								<Link href="/farmers" className="text-muted-foreground hover:text-primary">
									For Farmers
								</Link>
							</li>
							<li>
								<Link href="/about" className="text-muted-foreground hover:text-primary">
									About Us
								</Link>
							</li>
							<li>
								<Link href="/contact" className="text-muted-foreground hover:text-primary">
									Contact
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="font-semibold">Categories</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/category/fruits" className="text-muted-foreground hover:text-primary">
									Fruits
								</Link>
							</li>
							<li>
								<Link href="/category/vegetables" className="text-muted-foreground hover:text-primary">
									Vegetables
								</Link>
							</li>
							<li>
								<Link href="/category/grains" className="text-muted-foreground hover:text-primary">
									Grains & Rice
								</Link>
							</li>
							<li>
								<Link href="/category/spices" className="text-muted-foreground hover:text-primary">
									Spices
								</Link>
							</li>
							<li>
								<Link href="/category/honey" className="text-muted-foreground hover:text-primary">
									Honey
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="font-semibold">Contact Info</h3>
						<div className="space-y-3 text-sm">
							<div className="flex items-center space-x-2">
								<MapPin className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">Kathmandu, Nepal</span>
							</div>
							<div className="flex items-center space-x-2">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">+977-1-4444444</span>
							</div>
							<div className="flex items-center space-x-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">hello@krishiconnect.com</span>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
					<p>&copy; 2024 KrishiConnect. All rights reserved. Made with ❤️ for Nepal&apos;s farmers.</p>
				</div>
			</div>
		</footer>
	)
}