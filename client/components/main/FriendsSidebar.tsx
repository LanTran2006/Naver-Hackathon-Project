
import React, { useState } from 'react';
import { Friend, User } from '../../types';

interface FriendsSidebarProps {
    friends: Friend[];
    selectedFriend: Friend | null;
    onSelectFriend: (friend: Friend) => void;
    user: User;
}

const FriendsSidebar: React.FC<FriendsSidebarProps> = ({ friends, selectedFriend, onSelectFriend, user }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Searching for friend: ${searchQuery}`);
        // Placeholder for API call: /api/friends/search
    }

    return (
        <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-shrink-0 flex-col h-full hidden md:flex">
            {/* User Profile Panel */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                <div className="relative">
                    <img src={user.avatarUrl} alt="User Avatar" className="h-12 w-12 rounded-full"/>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-green-600">Online</p>
                </div>
            </div>

            {/* Find Friends */}
            <div className="p-4 border-b border-gray-200">
                <form onSubmit={handleSearch} className="flex space-x-2">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by email..." 
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                    />
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover">Search</button>
                </form>
            </div>
            
            {/* Friends List */}
            <div className="flex-grow overflow-y-auto">
                <h3 className="p-4 text-sm font-semibold text-gray-500 uppercase">Friends</h3>
                <ul>
                    {friends.map(friend => (
                        <li key={friend.email}>
                            <button
                                onClick={() => onSelectFriend(friend)}
                                className={`w-full text-left flex items-center space-x-3 p-3 transition ${selectedFriend?.email === friend.email ? 'bg-primary-light' : 'hover:bg-gray-100'}`}
                            >
                                <div className="relative">
                                    <img src={friend.avatarUrl} alt={friend.name} className="h-12 w-12 rounded-full" />
                                    {friend.isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>}
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <h4 className={`font-semibold ${selectedFriend?.email === friend.email ? 'text-primary-text' : 'text-gray-800'}`}>{friend.name}</h4>
                                    <p className="text-sm text-gray-500 truncate">{friend.lastMessage}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default FriendsSidebar;
