"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Filter, Search, MessageSquare, ShoppingBag, PlusCircle } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Item interface
interface GoodsItem {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userLocation: string
  userTrustScore: number
  itemName: string
  itemCategory: string
  condition: "new" | "like new" | "good" | "fair" | "poor"
  description: string
  images: string[]
  estimatedValue: string
  lookingFor: string
  completedTrades: number
}

export default function GoodsBarterPage() {
  const [items, setItems] = useState<GoodsItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GoodsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCondition, setSelectedCondition] = useState<string>("all")
  
  // Trade request state
  const [selectedItem, setSelectedItem] = useState<GoodsItem | null>(null)
  
  // Add a state to control the dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  
  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemCategory: "",
    condition: "",
    description: "",
    estimatedValue: "",
    lookingFor: "",
    images: [] as string[]
  })
  
  // Fetch items data from the backend database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        
        // Get user data from local storage
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("authToken")
        
        if (!storedUser || !token) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the marketplace",
            variant: "destructive"
          })
          setIsLoading(false)
          return
        }
        
        // Get all users with goods offerings from their profile
        const response = await fetch("https://backendd-fuux.onrender.com/api/users?hasGoodOfferings=true", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch goods data")
        }
        
        const data = await response.json()
        console.log("API Response:", data) // Debug log
        
        // Transform user offerings data into expected GoodsItem format
        const goodsItems: GoodsItem[] = []
        
        if (data.users && data.users.length > 0) {
          data.users.forEach((user: any) => {
            const goodsOfferings = user.offerings ? user.offerings.filter((offering: any) => offering.type === 'good') : []
            console.log(`User ${user.name} has ${goodsOfferings.length} goods offerings`) // Debug log
            
            goodsOfferings.forEach((offering: any) => {
              console.log("Processing offering:", offering) // Debug log
              goodsItems.push({
                id: offering._id || `offering-${Math.random().toString(36).substr(2, 9)}`,
                userId: user._id,
                userName: user.name,
                userAvatar: user.avatar || "/placeholder-user.jpg",
                userLocation: user.location?.address || "Location not specified",
                userTrustScore: user.trustScore || 80,
                itemName: offering.title,
                itemCategory: offering.category || "Other",
                condition: offering.condition || "good",
                description: offering.description || "No description provided",
                images: offering.images?.length > 0 ? offering.images : ["/placeholder.svg"],
                estimatedValue: offering.estimatedValue || "Price not specified",
                lookingFor: offering.lookingFor || "Open to offers",
                completedTrades: user.completedTrades || 0
              })
            })
          })
        } else {
          console.log("No users found or users array is empty") // Debug log
        }
        
        console.log("Final goods items:", goodsItems) // Debug log
        
        // If no goods from API, add some sample data for testing
        if (goodsItems.length === 0) {
          const sampleGoods: GoodsItem[] = [
            {
              id: "sample1",
              userId: "sample-user-1",
              userName: "John Doe",
              userAvatar: "/placeholder-user.jpg",
              userLocation: "Mumbai, Maharashtra",
              userTrustScore: 85,
              itemName: "iPhone 13 Pro",
              itemCategory: "Electronics",
              condition: "like new",
              description: "Excellent condition iPhone 13 Pro with original box and accessories. Used for 8 months only.",
              images: ["/placeholder.svg"],
              estimatedValue: "₹65,000",
              lookingFor: "MacBook Air or cash equivalent",
              completedTrades: 5
            },
            {
              id: "sample2", 
              userId: "sample-user-2",
              userName: "Sarah Smith",
              userAvatar: "/placeholder-user.jpg",
              userLocation: "Pune, Maharashtra",
              userTrustScore: 92,
              itemName: "Gaming Chair",
              itemCategory: "Furniture",
              condition: "good",
              description: "Ergonomic gaming chair in good condition. Some minor wear but very comfortable.",
              images: ["/placeholder.svg"],
              estimatedValue: "₹12,000",
              lookingFor: "Study desk or bookshelf",
              completedTrades: 8
            }
          ]
          goodsItems.push(...sampleGoods)
          console.log("Added sample goods for testing")
        }
        
        setItems(goodsItems)
        setFilteredItems(goodsItems)
      } catch (error) {
        console.error("Error fetching goods items:", error)
        toast({
          title: "Error loading goods",
          description: "We couldn't load the marketplace items. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchItems()
  }, [])
  
  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const imageUrls: string[] = []
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          imageUrls.push(result)
          setNewItem(prev => ({ ...prev, images: [...prev.images, result] }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Function to add new item
  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to add items",
          variant: "destructive"
        })
        return
      }

      const response = await fetch("https://backendd-fuux.onrender.com/api/users/offerings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "good",
          title: newItem.itemName,
          description: newItem.description,
          category: newItem.itemCategory,
          condition: newItem.condition,
          estimatedValue: newItem.estimatedValue,
          lookingFor: newItem.lookingFor,
          images: newItem.images
        })
      })

      if (!response.ok) {
        throw new Error("Failed to add item")
      }

      toast({
        title: "Item Listed!",
        description: "Your item has been added to the marketplace."
      })

      // Reset form and close dialog
      setNewItem({
        itemName: "",
        itemCategory: "",
        condition: "",
        description: "",
        estimatedValue: "",
        lookingFor: "",
        images: []
      })
      
      setAddItemDialogOpen(false)
      
      // Refresh the items list
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Filter items based on search query, category and condition
  useEffect(() => {
    let result = items
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        item => 
          item.itemName.toLowerCase().includes(query) ||
          item.userName.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.userLocation.toLowerCase().includes(query) ||
          item.lookingFor.toLowerCase().includes(query)
      )
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(item => item.itemCategory === selectedCategory)
    }
    
    // Apply condition filter
    if (selectedCondition !== "all") {
      result = result.filter(item => item.condition === selectedCondition)
    }
    
    setFilteredItems(result)
  }, [searchQuery, selectedCategory, selectedCondition, items])
  
  // Function to handle connecting with an item owner
  const handleConnect = (item: GoodsItem) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }
  
  // Function to send a trade request
  const sendTradeRequest = async () => {
    if (!selectedItem) {
      return
    }
    
    try {
      const token = localStorage.getItem("authToken")
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to send connection requests",
          variant: "destructive"
        })
        return
      }
      
      // Send connection request with all user goods
      const response = await fetch("https://backendd-fuux.onrender.com/api/users/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedItem.userId,
          skillId: selectedItem.id // We're reusing the same endpoint for both skills and goods
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to send request")
      }
      
      const data = await response.json()
      
      toast({
        title: "Trade Request Sent!",
        description: `Your request was sent to ${selectedItem.userName} for the ${selectedItem.itemName}. You'll be notified when they respond.`,
      })
      
      // Close the dialog
      setDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Send connection request error:", error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to send the request. Please try again later.",
        variant: "destructive",
      })
    }
  }
  
  // Get unique categories and conditions for filters
  const categories = ["all", ...new Set(items.map(item => item.itemCategory))]
  const conditions = ["all", "new", "like new", "good", "fair", "poor"]
  
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Goods Barter</h1>
            <p className="text-muted-foreground">Trade physical items with other users in your community</p>
          </div>
          <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                List My Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>List a New Item for Trade</DialogTitle>
                <DialogDescription>
                  Add details about your item to find potential trading partners
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input 
                      id="itemName" 
                      placeholder="What are you offering?" 
                      value={newItem.itemName}
                      onChange={(e) => setNewItem(prev => ({ ...prev, itemName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemCategory">Category</Label>
                    <Select value={newItem.itemCategory} onValueChange={(value) => setNewItem(prev => ({ ...prev, itemCategory: value }))}>
                      <SelectTrigger id="itemCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={newItem.condition} onValueChange={(value) => setNewItem(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Item condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your item in detail - brand, model, age, any special features or flaws" 
                    rows={4}
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Estimated Value (₹)</Label>
                  <Input 
                    id="estimatedValue" 
                    placeholder="Approximate market value" 
                    value={newItem.estimatedValue}
                    onChange={(e) => setNewItem(prev => ({ ...prev, estimatedValue: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lookingFor">What are you looking for?</Label>
                  <Textarea 
                    id="lookingFor" 
                    placeholder="Describe what you'd like to trade this item for" 
                    rows={3}
                    value={newItem.lookingFor}
                    onChange={(e) => setNewItem(prev => ({ ...prev, lookingFor: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Upload Images</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {newItem.images.map((image, index) => (
                      <div key={index} className="relative h-24 rounded-md overflow-hidden">
                        <Image src={image} alt={`Item ${index + 1}`} fill className="object-cover" />
                        <button 
                          onClick={() => setNewItem(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <label className="flex h-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground/25 p-2">
                      <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                        <PlusCircle className="h-6 w-6" />
                        <span>Add Photo</span>
                      </div>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddItemDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>List Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items, users, or locations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-full md:w-[120px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition === "all" ? "Any Condition" : condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Items grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-[200px] w-full rounded-md" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-lg font-medium">No items found matching your criteria</p>
                <p className="text-center text-muted-foreground">Try adjusting your search or filters</p>
                <Button variant="outline" className="mt-4">List Your Own Item</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <Image
                        src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg"}
                        alt={item.itemName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-white text-primary">{item.condition}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{item.itemName}</h3>
                          <Badge variant="outline" className="gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {item.userTrustScore}/100
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Image
                              src={item.userAvatar}
                              alt={item.userName}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                            <span>{item.userName}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.userLocation}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Est. Value: {item.estimatedValue}</span>
                          <span className="text-xs text-muted-foreground">{item.completedTrades} trades completed</span>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Looking for: <span className="text-primary">{item.lookingFor}</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1">
                          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" className="w-full" onClick={() => handleConnect(item)}>
                                Make Offer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Make an Offer for {selectedItem?.itemName}</DialogTitle>
                                <DialogDescription>
                                  Send a trade request to {selectedItem?.userName}. You'll be able to chat once they accept.
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedItem && (
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="relative h-[120px] overflow-hidden rounded-md">
                                      <Image
                                        src={selectedItem.images && selectedItem.images.length > 0 ? selectedItem.images[0] : "/placeholder.svg"}
                                        alt={selectedItem.itemName}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{selectedItem.itemName}</h4>
                                      <p className="text-sm text-muted-foreground">{selectedItem.description.substring(0, 100)}...</p>
                                      <p className="mt-1 text-sm font-medium">Est. Value: {selectedItem.estimatedValue}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label>Select your item to offer</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose one of your listed items" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="item1">Laptop (Est. ₹35,000)</SelectItem>
                                        <SelectItem value="item2">Bluetooth Speakers (Est. ₹8,000)</SelectItem>
                                        <SelectItem value="item3">Fitness Watch (Est. ₹12,000)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label>Additional notes</Label>
                                    <Textarea placeholder="Add any other details about your offer..." rows={3} />
                                  </div>
                                </div>
                              )}
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={sendTradeRequest}>
                                  Send Offer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button size="sm" variant="outline" className="w-full gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}