import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import TabNavigator from './TabNavigator';
import OverviewTab from './tabs/OverviewTab';
import GalleryTab from './tabs/GalleryTab';
import PostsTab from './tabs/PostsTab';
import ReelsTab from './tabs/ReelsTab';
import WishlistTab from './tabs/WishlistTab';

const ProfilePage = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUserData(data));
  }, [userId]);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab user={userData} />;
      case 'gallery': return <GalleryTab user={userData} />;
      case 'posts': return <PostsTab user={userData} />;
      case 'reels': return <ReelsTab user={userData} />;
      case 'wishlist': return <WishlistTab user={userData} />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {userData && (
        <>
          <ProfileHeader user={userData} />
          <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-4">{renderTab()}</div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
