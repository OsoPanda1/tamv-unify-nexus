import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card, Button, Input, Textarea, Badge,
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui';
import {
  MapPin, Edit2, Users, Image as ImageIcon, Video, Radio,
  Heart, MessageCircle, Share2, Eye, Camera, Settings, Gift,
  Award, Zap, Clock, Music, Plus, Layers, Globe2, BookOpen,
  Link2, Youtube, Instagram, X, Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Este hook recupera el usuario y todos sus datos secundarios (ampliado)
const useSuperUser = () => {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [extended, setExtended] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadAll = async () => {
      try {
        const me = await base44.auth.me();
        // Carga de assets: Posts, Fotos, Videos, DreamSpaces, Arte, Música, Cursos, Grupos, Streams, Wishlist, Donaciones, Social links
        const [
          posts, spaces, photos, videos, gifts, arts, tracks, courses,
          groups, streams, wishlist, donations, socials
        ] = await Promise.all([
          base44.entities.Post.filter({ author_id: me.id }, '-created_date', 50),
          base44.entities.DreamSpace.filter({ creator_id: me.id }, '-created_date', 20),
          base44.entities.Photo.filter({ user_id: me.id }, '-created_date', 20),
          base44.entities.Video.filter({ user_id: me.id }, '-created_date', 10),
          base44.entities.Gift.history(me.id),
          base44.entities.ArtPiece.filter({ user_id: me.id }, '-created_date', 10),
          base44.entities.MusicTrack.filter({ user_id: me.id }, '-created_date', 10),
          base44.entities.Course.list(me.id),
          base44.entities.Group.list(me.id),
          base44.entities.Stream.list(me.id),
          base44.entities.Wishlist.list(me.id),
          base44.entities.Donation.stats(me.id),
          base44.entities.Social.list(me.id),
        ]);
        setUser(me);
        setExtended({
          posts, spaces, photos, videos, gifts, arts, tracks, courses,
          groups, streams, wishlist, donations, socials
        });
        setLoaded(true);
      } catch {
        navigate('/auth');
      }
    };
    loadAll();
  }, [navigate]);
  return { user, ...extended, loaded };
};

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '', location: '' });
  const { user, posts, spaces, photos, videos, gifts, arts, tracks, courses, groups, streams, wishlist, donations, socials, loaded } = useSuperUser();

  useEffect(() => {
    if (user) setEditForm({ username: user.username || '', bio: user.bio || '', location: user.location || '' });
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: async () => {
      queryClient.invalidateQueries();
      setIsEditing(false);
    },
  });

  const handleSaveProfile = () => updateProfileMutation.mutate(editForm);

  // Lógica para badges, colores, social icons
  const getMembershipColor = (tier) => ({
    free: 'from-slate-500 to-slate-600',
    premium: 'from-blue-500 to-cyan-500',
    vip: 'from-purple-500 to-pink-500',
    elite: 'from-yellow-500 to-orange-500',
    celestial: 'from-cyan-400 via-purple-400 to-pink-400',
  }[tier] || 'from-slate-500 to-slate-600');
  const membershipBadge = {
    free: { label: 'Free' }, premium: { label: 'Premium', icon: Zap },
    vip: { label: 'VIP', icon: Award }, elite: { label: 'Elite', icon: Award },
    celestial: { label: 'Celestial', icon: Award },
  }[user?.membership_tier] || { label: 'Free' };
  const MembershipIcon = membershipBadge.icon;

  if (!loaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-black">
      {/* Header con efectos 4D e implementación orbital */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
          {/* Animación Glow */}
          <div className="absolute inset-0 opacity-60">
            <motion.div className="absolute w-[440px] h-[440px] bg-purple-900 blur-3xl rounded-full left-[-120px] top-[-120px] animate-pulse" />
            <motion.div className="absolute w-64 h-64 bg-orange-700/60 blur-2xl rounded-full right-10 top-1/4 animate-pulse" />
            <motion.div className="absolute w-32 h-32 bg-cyan-700/40 blur-2xl rounded-full bottom-10 right-1/2 animate-pulse" />
          </div>
        </div>
        {/* Perfil principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 flex flex-col md:flex-row gap-6 items-center md:items-end">
          <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="relative">
            {/* Avatar con órbitas glow */}
            <div className="absolute inset-0 -m-6 pointer-events-none">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                <div className="absolute w-full h-full border-2 border-orange-500/30 rounded-full" />
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-orange-500 rounded-full -translate-x-1/2" />
              </motion.div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
                <div className="absolute w-[90%] h-[90%] left-[5%] top-[5%] border-2 border-cyan-500/30 rounded-full" />
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-500 rounded-full -translate-x-1/2" />
              </motion.div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity }}>
                <div className="absolute w-[75%] h-[75%] left-[12.5%] top-[12.5%] border border-purple-500/20 rounded-full" />
              </motion.div>
            </div>
            <div className="relative w-48 h-48 rounded-full border-4 border-orange-500 bg-gradient-to-br from-orange-500 to-purple-600 shadow-2xl overflow-hidden">
              {user.avatar_url
                ? <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>}
              <Button size="icon" className="absolute bottom-2 right-2 w-10 h-10 bg-orange-600 hover:bg-orange-700">
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
          {/* Info del usuario */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center md:items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-white">{user.username}</h1>
                  <Badge className={`bg-gradient-to-r ${getMembershipColor(user.membership_tier)} text-white px-4 py-2`}>
                    {MembershipIcon && <MembershipIcon className="w-4 h-4 mr-1" />}
                    {membershipBadge.label}
                  </Badge>
                </div>
                {editForm.location && (
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <MapPin className="w-4 h-4" /><span>{editForm.location}</span>
                  </div>
                )}
                <p className="text-slate-100 max-w-2xl">{editForm.bio || 'Miembro TAMV MD-X4™ quantum-social.'}</p>
                {/* Social links */}
                <div className="flex gap-2 mt-2">
                  {(socials || []).map(link => {
                    const iconMap = { youtube: Youtube, instagram: Instagram, x: X, linkedin: Linkedin, web: Globe2, };
                    const Icon = iconMap[link.type] || Link2;
                    return (
                      <a key={link.type} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="text-white hover:text-yellow-400 opacity-80 transition-opacity">
                        <Icon className="w-6 h-6" />
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(!isEditing)} className="bg-slate-700 hover:bg-slate-600 text-white">
                  <Edit2 className="w-4 h-4 mr-2" />Editar Perfil
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Stats */}
            <div className="flex gap-8 justify-center md:justify-start text-center">
              <div><div className="text-2xl font-bold text-orange-400">{posts?.length}</div><div className="text-sm text-slate-400">Posts</div></div>
              <div><div className="text-2xl font-bold text-cyan-400">{user?.tamv_credits || 0}</div><div className="text-sm text-slate-400">Credits</div></div>
              <div><div className="text-2xl font-bold text-purple-400">{arts?.length}</div><div className="text-sm text-slate-400">Arte</div></div>
              <div><div className="text-2xl font-bold text-green-400">{streams?.length}</div><div className="text-sm text-slate-400">Streams</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de edición de perfil */}
      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-orange-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Editar Perfil</h3>
              <div className="space-y-4">
                <div><label className="text-slate-300 mb-2 block">Usuario</label>
                  <Input value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div><label className="text-slate-300 mb-2 block">Ubicación</label>
                  <Input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Ciudad, País" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div><label className="text-slate-300 mb-2 block">Bio</label>
                  <Textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Cuéntanos sobre ti..." className="bg-slate-800 border-slate-700 text-white min-h-[100px]" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}
                    className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="border-slate-600 text-slate-300">Cancelar</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs con todas las super-funcionalidades */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="overflow-x-auto bg-black border-b border-gradient-to-r from-orange-300/20 via-purple-400/20 to-cyan-400/20">
            <TabsTrigger value="overview"><Eye /> Overview</TabsTrigger>
            <TabsTrigger value="media"><ImageIcon /> Fotos & Videos</TabsTrigger>
            <TabsTrigger value="artGallery"><Gift /> Arte Personal</TabsTrigger>
            <TabsTrigger value="dreamspaces"><Zap /> DreamSpaces</TabsTrigger>
            <TabsTrigger value="university"><Award /> University</TabsTrigger>
            <TabsTrigger value="music"><Music /> Música</TabsTrigger>
            <TabsTrigger value="groups"><Users /> Comunidades</TabsTrigger>
            <TabsTrigger value="wishlist"><Gift /> Wishlist</TabsTrigger>
            <TabsTrigger value="donations"><Gift /> Donaciones</TabsTrigger>
            <TabsTrigger value="streams"><Video /> Streams</TabsTrigger>
            <TabsTrigger value="social"><Share2 /> Redes</TabsTrigger>
            <TabsTrigger value="settings"><Settings /> Config</TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview">
            {/* Últimos posts, resumen XR, arte */}
            {/* ... igual al esquema anterior, agrega stats y previews */}
          </TabsContent>
          <TabsContent value="media">
            {/* Fotos y videos del usuario, galería grid, efecto visual */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos?.map(photo => <img key={photo.id} src={photo.url} alt={photo.title} className="rounded-lg object-cover w-full aspect-square" />)}
              {videos?.map(video => (
                <video key={video.id} src={video.url} controls className="rounded-lg object-cover w-full aspect-square" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="artGallery">
            {/* Arte personal, NFTs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {arts?.map(art => (
                <div key={art.id} className="rounded-xl border-2 border-purple-500/60 bg-slate-900 p-2">
                  <img src={art.image_url} alt={art.title} className="rounded w-full aspect-square object-cover" />
                  <div className="mt-2 text-xs text-white">{art.title}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="dreamspaces">
            {/* DreamSpaces interactivos XR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spaces?.map(space => (
                <div key={space.id} className="bg-gradient-to-br from-purple-900/70 to-orange-900/70 border-2 border-purple-500/40 rounded-xl p-3 flex flex-col">
                  <img src={space.thumbnail_url} alt={space.title} className="rounded-lg aspect-square object-cover" />
                  <div className="mt-2 text-white font-semibold">{space.title}</div>
                  <div className="text-xs text-slate-400">{space.description}</div>
                  <Button className="mt-2 bg-purple-700 text-white">Explorar XR</Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="university">
            {/* Cursos activos, logros, progreso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses?.map(course => (
                <Card key={course.id} className="bg-slate-900/80 border-cyan-500/30 p-4">
                  <div className="text-lg text-cyan-400 font-bold">{course.name}</div>
                  <div className="text-xs text-slate-300 mb-2">{course.progress}% completado</div>
                  <div className="flex gap-2">
                    <Badge className="bg-cyan-700">{course.badge}</Badge>
                    <Button size="sm" className="bg-cyan-700 text-white">Ir al curso</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="music">
            {/* Playlist, tracks, visualizador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks?.map(track => (
                <Card key={track.id} className="bg-gradient-to-br from-cyan-700 to-purple-800 border-purple-600 p-3">
                  <div className="font-semibold text-white">{track.title}</div>
                  <audio src={track.url} controls className="mt-1 w-full" />
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="groups">
            {/* Listas de grupos/canales y foros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups?.map(group => (
                <Card key={group.id} className="bg-gradient-to-br from-orange-500/10 to-purple-700/10 border-orange-400 p-3">
                  <div className="font-semibold text-white">{group.name}</div>
                  <div className="text-xs text-slate-400">{group.description}</div>
                  <Button className="mt-1 bg-orange-600 text-white">Entrar</Button>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="wishlist">
            {/* Wishlist de assets, curso, packs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wishlist?.map(item => (
                <Card key={item.id} className="bg-slate-900 border-purple-400/30 p-3">
                  <div className="font-semibold text-purple-400">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.category}</div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="donations">
            {/* Donaciones y meta */}
            <Card className="bg-slate-900 border-yellow-400/30 p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Donaciones</h3>
              <div className="text-white">Total recaudado: ${donations?.total}</div>
              <div className="mt-3 flex gap-2">
                <Button className="bg-yellow-500 text-white">Donar</Button>
                <Button variant="outline" className="border-yellow-300 text-yellow-400">¿Por qué donar?</Button>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="streams">
            {/* Streams activos y próximos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {streams?.map(stream => (
                <Card key={stream.id} className="bg-gradient-to-br from-green-700 to-purple-900 border-green-500 p-3">
                  <div className="font-semibold text-white">{stream.title}</div>
                  <div className="text-xs text-slate-400">{stream.description}</div>
                  <Button className="mt-1 bg-green-700 text-white">Ver stream</Button>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="social">
            {/* Redes sociales y enlaces */}
            <div className="flex gap-3 flex-wrap">
              {(socials || []).map(link => {
                const iconMap = { youtube: Youtube, instagram: Instagram, x: X, linkedin: Linkedin, web: Globe2, };
                const Icon = iconMap[link.type] || Link2;
                return (
                  <a key={link.type} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white bg-gradient-to-r from-cyan-400 to-purple-500 px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" /> {link.handle || link.type}
                  </a>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="settings">
            {/* Configuraciones avanzadas, seguridad quantum */}
            <Card className="bg-slate-800 border-purple-500 p-6">
              <h3 className="text-lg text-white font-bold mb-3">Preferencias y Seguridad</h3>
              <Button className="bg-purple-600 text-white">Modo Quantum</Button>
              <Button variant="outline" className="ml-2 border-purple-400 text-purple-400">Configuración avanzada</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
