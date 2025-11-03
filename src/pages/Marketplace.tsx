import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Sparkles, 
  Tag, 
  TrendingUp,
  Star,
  Filter
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartWidget from "@/components/CartWidget";
import { toast } from "sonner";

const products = [
  {
    id: 1,
    name: "Avatar Quantum Premium",
    category: "Avatares",
    price: 500,
    gradient: "from-primary to-purple-500",
    rating: 4.8,
  },
  {
    id: 2,
    name: "DreamSpace Template Pro",
    category: "Espacios",
    price: 1200,
    gradient: "from-secondary to-cyan-500",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Skin Neon Dreams",
    category: "Skins",
    price: 300,
    gradient: "from-accent to-yellow-500",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Effect Pack Sensorial",
    category: "Efectos",
    price: 800,
    gradient: "from-resonance to-pink-500",
    rating: 4.6,
  },
];

export default function Marketplace() {
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast.success(`${product.name} añadido al carrito`);
  };

  return (
    <div className="min-h-screen bg-background">
      <CartWidget />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full glow-quantum mb-4">
            <ShoppingCart className="w-6 h-6 text-accent-glow animate-pulse" />
            <span className="font-orbitron font-bold text-lg">Marketplace™</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-gold">
            Economía Digital TAMV
          </h1>
          <p className="text-muted-foreground text-lg">
            Assets 2D/3D/4D, NFTs auditados, skins y experiencias únicas
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="border-border hover:border-primary">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" className="border-border hover:border-secondary">
            <Tag className="w-4 h-4 mr-2" />
            Categorías
          </Button>
          <Button variant="outline" className="border-border hover:border-accent">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="glass-effect hover:shadow-glow transition-all duration-300 hover:scale-105 group">
              <div className={`h-48 bg-gradient-to-br ${product.gradient} relative rounded-t-lg`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white/80 animate-float" />
                </div>
                <Badge className="absolute top-3 left-3 bg-background/80 text-foreground">
                  {product.category}
                </Badge>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-orbitron font-bold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-accent fill-accent"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{product.rating}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-3xl font-orbitron font-bold text-gradient-gold">
                      {product.price}
                    </p>
                    <p className="text-xs text-muted-foreground">TAMV Credits</p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-quantum hover:shadow-glow"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Añadir al Carrito
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
