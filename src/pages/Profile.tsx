<Tabs defaultValue="overview" className="space-y-4">
  <TabsList className="bg-card/30 border border-primary/20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
    <TabsTrigger value="overview">Resumen</TabsTrigger>
    <TabsTrigger value="gallery">Galería</TabsTrigger>
    <TabsTrigger value="posts">Posts</TabsTrigger>
    <TabsTrigger value="reels">Reels</TabsTrigger>
    <TabsTrigger value="streams">Streamings</TabsTrigger>
    <TabsTrigger value="groups">Grupos</TabsTrigger>
    <TabsTrigger value="channels">Canales</TabsTrigger>
    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
  </TabsList>

  <TabsContent value="gallery">
    <Card className="glass-effect p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">🎨 Galería Multisensorial</h2>
      {/* Mapear imágenes del usuario */}
    </Card>
  </TabsContent>

  <TabsContent value="posts">
    <Card className="glass-effect p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">🧠 Ideas & Pensamientos</h2>
      {/* Mapear publicaciones estilo Twitter */}
    </Card>
  </TabsContent>

  <TabsContent value="reels">
    <Card className="glass-effect p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">📺 Reels</h2>
      {/* Mapear videos cortos estilo TikTok */}
    </Card>
  </TabsContent>

  <TabsContent value="streams">
    <Card className="glass-effect p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">🔴 Streamings en Vivo</h2>
      {/* Integración con video en vivo */}
    </Card>
  </TabsContent>

  <TabsContent value="groups">
    <Card className="glass-effect p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">🌀 Grupos</h2>
      {/* Listado de grupos TAMV */}
    </Card>
  </TabsContent>

  <TabsContent value="channels">
    <Card className="glass-effect p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">📡 Canales</h2>
      {/* Canales temáticos, estilo Discord */}
    </Card>
  </TabsContent>

  <TabsContent value="wishlist">
    <Card className="glass-effect p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">🛒 Lista de Deseos</h2>
      {/* Favoritos, productos, ideas guardadas */}
    </Card>
  </TabsContent>
</Tabs>
